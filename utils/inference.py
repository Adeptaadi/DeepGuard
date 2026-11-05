import torch
from torchvision import transforms
from PIL import Image
import cv2
import os
import gc
import numpy as np
from facenet_pytorch import MTCNN
from utils.model_utils import get_model
from utils.visualize import GradCAM, overlay_heatmap

# --- CONFIGURATION ---
DEVICE = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# PATHS
PATH_XCEPTION = 'models/deepfake_detector_xception.pth'
PATH_EFFNET   = 'models/deepfake_detector_efficientnet.pth'

# --- LOAD ENSEMBLE ---
print(f"[INFO] Initializing Ensemble Engine on {DEVICE}...")

model_xc = get_model(model_name='xception', num_classes=2, pretrained=False)
if os.path.exists(PATH_XCEPTION):
    model_xc.load_state_dict(torch.load(PATH_XCEPTION, map_location=DEVICE))
model_xc.to(DEVICE).eval()

model_ef = get_model(model_name='efficientnet_b0', num_classes=2, pretrained=False)
if os.path.exists(PATH_EFFNET):
    model_ef.load_state_dict(torch.load(PATH_EFFNET, map_location=DEVICE))
model_ef.to(DEVICE).eval()

# --- PREPROCESSING ---
mtcnn = MTCNN(
    image_size=299, margin=80, min_face_size=40,
    keep_all=False, select_largest=True,
    device=DEVICE, post_process=False 
)

base_transform = transforms.Compose([
    transforms.Resize((299, 299)),
    transforms.ToTensor(), 
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]) 
])


def predict_frame_ensemble(pil_image):
    """
    Inference on a single PIL image using the Dual-CNN ensemble.
    Always returns a 4-tuple: (label, confidence, img_tensor, face_crop).
    """
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
        
    boxes, _ = mtcnn.detect(pil_image)
    if boxes is None or len(boxes) == 0:
        return "No face detected", 0.0, None, None

    box = boxes[0]
    box = [max(0, b) for b in box]
    
    width = box[2] - box[0]
    height = box[3] - box[1]
    ratio = width / height if height > 0 else 0
    if ratio < 0.5 or ratio > 2.0:
        return "Bad Crop", 0.0, None, None

    face_img = pil_image.crop((box[0], box[1], box[2], box[3]))
    if face_img.size[0] == 0 or face_img.size[1] == 0:
        return "No face detected", 0.0, None, None

    img_tensor = base_transform(face_img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        out_xc = model_xc(img_tensor)
        prob_xc = torch.nn.functional.softmax(out_xc, dim=1)[:, 0].item()

        out_ef = model_ef(img_tensor)
        prob_ef = torch.nn.functional.softmax(out_ef, dim=1)[:, 0].item()

        avg_fake_score = (prob_xc + prob_ef) / 2

    label = "FAKE" if avg_fake_score > 0.50 else "REAL"
    confidence = avg_fake_score * 100 if label == "FAKE" else (1 - avg_fake_score) * 100
    
    return label, confidence, img_tensor, face_img


def predict_video(video_path, sequence_length=3, progress_callback=None):
    """
    Processes video media, sampling frames across time, calculating temporal streak statistics,
    and generating Grad-CAM heatmaps for forensic evidence.
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return "Error", {"message": "Could not open video file", "fake_ratio": "0%", "evidence": []}
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps <= 0:
        fps = 25.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    fake_frame_count = 0
    processed_frames = 0
    consecutive_fake_streak = 0
    max_fake_streak = 0
    suspicious_timestamps = []
    
    # Evidence Collection Logic
    evidence_frames = []
    next_capture_second = 0
    
    # Setup GradCAM lazily
    target_layer = getattr(model_xc, 'act4', None) or getattr(model_xc, 'conv4', None)
    cam = GradCAM(model_xc, target_layer) if target_layer is not None else None
    
    # Sample interval: sample every ~0.3s to 0.4s to be fast and memory-safe
    sample_interval = max(5, int(fps // 3)) if fps else 8
    max_frames_to_process = 60  # Cap at 60 analyzed frames to prevent memory spikes on Render free tier
    estimated_target = max(1, min(max_frames_to_process, int(total_frames // sample_interval))) if total_frames > 0 else 30

    if progress_callback:
        progress_callback(15, 0, f"Decoding video: {total_frames} frames detected at {int(fps)} FPS...")
    
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret or processed_frames >= max_frames_to_process:
            break
        
        current_time_sec = frame_idx / fps
        
        if frame_idx % sample_interval == 0:
            # Resize frame if exceptionally large to conserve RAM
            h, w = frame.shape[:2]
            if w > 1280 or h > 720:
                frame = cv2.resize(frame, (1280, int(h * (1280 / w))))
                
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            pred_res = predict_frame_ensemble(pil_img)
            
            # Safe unpack
            if len(pred_res) == 4:
                label, conf, tensor, crop = pred_res
            else:
                label, conf = pred_res[0], pred_res[1]
                tensor, crop = None, None
            
            if label not in ["Bad Crop", "No face detected"] and tensor is not None:
                processed_frames += 1
                
                if progress_callback:
                    ratio = min(1.0, processed_frames / estimated_target)
                    pct = int(20 + ratio * 65)
                    stage_idx = 1 if pct < 45 else 2
                    stage_title = "Face Alignment" if stage_idx == 1 else "Dual-CNN Ensemble inference"
                    progress_callback(pct, stage_idx, f"Processing frame {processed_frames}/{estimated_target}: {stage_title}...")
                
                if label == "FAKE" and conf > 60.0:
                    fake_frame_count += 1
                    consecutive_fake_streak += 1
                    
                    if current_time_sec >= next_capture_second and cam is not None and len(evidence_frames) < 6:
                        try:
                            heatmap = cam.generate_heatmap(tensor, target_class_idx=0)
                            overlay = overlay_heatmap(crop, heatmap)
                            evidence_frames.append({
                                "frame": overlay,
                                "conf": conf,
                                "time": f"{int(current_time_sec)}s"
                            })
                            next_capture_second += 1
                        except Exception as e:
                            print(f"[WARN] GradCAM Error: {e}")

                    if consecutive_fake_streak >= sequence_length:
                        seconds = frame_idx / fps if fps else 0
                        time_str = f"{int(seconds // 60)}m {int(seconds % 60):02d}s"
                        if time_str not in suspicious_timestamps:
                            suspicious_timestamps.append(time_str)
                else:
                    max_fake_streak = max(max_fake_streak, consecutive_fake_streak)
                    consecutive_fake_streak = 0
            
            # Explicit reference cleanup
            del pil_img
            if tensor is not None:
                del tensor
            if crop is not None:
                del crop
            
        frame_idx += 1
        
    cap.release()
    gc.collect()

    if progress_callback:
        progress_callback(88, 3, "Synthesizing Grad-CAM explainability heatmaps...")

    fake_ratio = (fake_frame_count / processed_frames) * 100 if processed_frames > 0 else 0.0
    final_prediction = "FAKE" if fake_ratio > 30.0 else "REAL"

    if progress_callback:
        progress_callback(96, 3, "Computing temporal streaks & compiling forensic report...")

    return final_prediction, {
        "fake_ratio": f"{fake_ratio:.2f}%",
        "max_consecutive_fakes": max_fake_streak * sample_interval, 
        "timestamps": suspicious_timestamps,
        "evidence": evidence_frames[:6],
        "processed_frames": processed_frames
    }


def predict_frame_tta(pil_image):
    """
    Inference on a single image.
    Always returns a 2-tuple: (label, confidence).
    """
    res = predict_frame_ensemble(pil_image)
    return res[0], res[1]
