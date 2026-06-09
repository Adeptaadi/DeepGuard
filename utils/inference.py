import torch
from torchvision import transforms
from PIL import Image
import cv2
import os
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
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
        
    boxes, _ = mtcnn.detect(pil_image)
    if boxes is None: return "No face detected", 0.0

    box = boxes[0]
    box = [max(0, b) for b in box]
    
    width = box[2] - box[0]
    height = box[3] - box[1]
    ratio = width / height if height > 0 else 0
    if ratio < 0.5 or ratio > 2.0: return "Bad Crop", 0.0

    face_img = pil_image.crop((box[0], box[1], box[2], box[3]))
    if face_img.size[0] == 0 or face_img.size[1] == 0: return "No face detected", 0.0

    img_tensor = base_transform(face_img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        out_xc = model_xc(img_tensor)
        prob_xc = torch.nn.functional.softmax(out_xc, dim=1)[:, 0].item()

        out_ef = model_ef(img_tensor)
        prob_ef = torch.nn.functional.softmax(out_ef, dim=1)[:, 0].item()

        avg_fake_score = (prob_xc + prob_ef) / 2

    # Return label, confidence, tensor, and crop for visualization
    label = "FAKE" if avg_fake_score > 0.50 else "REAL"
    confidence = avg_fake_score * 100 if label == "FAKE" else (1 - avg_fake_score) * 100
    
    return label, confidence, img_tensor, face_img

def predict_video(video_path, sequence_length=3):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened(): return "Error", {"message": "Could not open video"}
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps if fps > 0 else 0
    
    fake_frame_count = 0
    processed_frames = 0
    consecutive_fake_streak = 0
    max_fake_streak = 0
    suspicious_timestamps = []
    
    # Evidence Collection Logic
    evidence_frames = []
    frames_per_second = int(fps)
    next_capture_second = 0  # We want to capture at 0s, 1s, 2s, etc.
    
    # Setup GradCAM
    target_layer = model_xc.act4 if hasattr(model_xc, 'act4') else model_xc.conv4
    cam = GradCAM(model_xc, target_layer)
    
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        # Calculate current time in seconds
        current_time_sec = frame_idx / fps
        
        # Analyze every 5th frame for general stats
        if frame_idx % 5 == 0:
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            label, conf, tensor, crop = predict_frame_ensemble(pil_img)
            
            if label not in ["Bad Crop", "No face detected"]:
                processed_frames += 1
                
                if label == "FAKE" and conf > 60.0:
                    fake_frame_count += 1
                    consecutive_fake_streak += 1
                    
                    # --- CAPTURE EVIDENCE (1 PER SECOND) ---
                    # Logic: If this frame is fake AND we crossed a new second marker
                    if current_time_sec >= next_capture_second:
                        try:
                            heatmap = cam.generate_heatmap(tensor, target_class_idx=0)
                            overlay = overlay_heatmap(crop, heatmap)
                            evidence_frames.append({
                                "frame": overlay,
                                "conf": conf,
                                "time": f"{int(current_time_sec)}s"
                            })
                            # Increment target so we don't capture again until the next second
                            next_capture_second += 1
                        except Exception as e:
                            print(f"GradCAM Error: {e}")

                    if consecutive_fake_streak >= sequence_length:
                        seconds = frame_idx / fps if fps else 0
                        time_str = f"{int(seconds // 60)}m {int(seconds % 60):02d}s"
                        if time_str not in suspicious_timestamps: suspicious_timestamps.append(time_str)
                else:
                    max_fake_streak = max(max_fake_streak, consecutive_fake_streak)
                    consecutive_fake_streak = 0
        frame_idx += 1
    cap.release()

    fake_ratio = (fake_frame_count / processed_frames) * 100 if processed_frames > 0 else 0
    final_prediction = "FAKE" if fake_ratio > 30.0 else "REAL"

    return final_prediction, {
        "fake_ratio": f"{fake_ratio:.2f}%",
        "max_consecutive_fakes": max_fake_streak * 5, 
        "timestamps": suspicious_timestamps,
        "evidence": evidence_frames[:10] # Limit to 10 frames max just in case
    }

def predict_frame_tta(pil_image):
    l, c, _, _ = predict_frame_ensemble(pil_image)
    return l, c