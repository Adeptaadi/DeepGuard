import os
import cv2
import numpy as np
from PIL import Image
import torch
from facenet_pytorch import MTCNN

class HybridFaceDetector:
    """
    Hybrid Face Detector (DeepGuard v1.1 Experiment)
    
    Architecture:
      Primary:  YOLOv8-Face (Fast, robust under extreme pose / blur)
      Fallback: MTCNN (Exact v1.0 baseline detector preserved as safety net)
      
    Guarantees:
      - If YOLOv8 detects a valid face, it returns the crop immediately.
      - If YOLOv8 misses or yields an invalid crop, it seamlessly delegates to MTCNN.
      - If YOLOv8 is unavailable or disabled, it functions identically to MTCNN v1.0.
    """
    def __init__(self, yolo_weights_path="models/yolov8n-face.pt", conf_thresh=0.45, device=None):
        self.device = device or ('cuda:0' if torch.cuda.is_available() else 'cpu')
        self.conf_thresh = conf_thresh
        self.yolo_model = None
        self.mtcnn = None
        
        # 1. Initialize Primary (YOLOv8-Face)
        self._init_yolo(yolo_weights_path)
        
        # 2. Initialize Fallback (MTCNN - exact v1.0 configuration)
        self._init_mtcnn()

    def _init_yolo(self, weights_path):
        if os.path.exists(weights_path):
            try:
                from ultralytics import YOLO
                self.yolo_model = YOLO(weights_path)
                # Suppress verbose logging
                print(f"[INFO] HybridFaceDetector: Primary YOLOv8-Face loaded from '{weights_path}'")
            except Exception as e:
                print(f"[WARN] HybridFaceDetector: Could not initialize YOLOv8-Face ({e}). Falling back to MTCNN.")
                self.yolo_model = None
        else:
            print(f"[WARN] HybridFaceDetector: Weights '{weights_path}' not found. Using MTCNN exclusively.")
            self.yolo_model = None

    def _init_mtcnn(self):
        try:
            self.mtcnn = MTCNN(
                image_size=299, margin=80, min_face_size=40,
                keep_all=False, select_largest=True,
                device=self.device, post_process=False
            )
            print(f"[INFO] HybridFaceDetector: Fallback MTCNN initialized on {self.device}")
        except Exception as e:
            print(f"[ERROR] HybridFaceDetector: Failed to initialize MTCNN: {e}")
            self.mtcnn = None

    def detect_face(self, pil_image, enable_fallback=True):
        """
        Detects and extracts the primary face crop from a PIL Image.
        
        Returns:
            face_img (PIL.Image or None): Cropped face image (or None if no face found)
            source (str): 'YOLOv8-Face', 'MTCNN-Fallback', or failure status
        """
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
            
        w_img, h_img = pil_image.size
        
        # --- STAGE 1: Try Primary Detector (YOLOv8-Face) ---
        if self.yolo_model is not None:
            try:
                img_np = np.array(pil_image)
                results = self.yolo_model(img_np, conf=self.conf_thresh, verbose=False)
                
                if len(results) > 0 and len(results[0].boxes) > 0:
                    boxes = results[0].boxes.xyxy.cpu().numpy()
                    confs = results[0].boxes.conf.cpu().numpy()
                    
                    # Choose detection with highest confidence
                    best_idx = int(np.argmax(confs))
                    box = boxes[best_idx]
                    
                    x1 = max(0, int(box[0]))
                    y1 = max(0, int(box[1]))
                    x2 = min(w_img, int(box[2]))
                    y2 = min(h_img, int(box[3]))
                    
                    bw = x2 - x1
                    bh = y2 - y1
                    ratio = bw / bh if bh > 0 else 0
                    
                    if 0.4 <= ratio <= 2.5 and bw >= 20 and bh >= 20:
                        face_crop = pil_image.crop((x1, y1, x2, y2))
                        if face_crop.size[0] > 0 and face_crop.size[1] > 0:
                            return face_crop, "YOLOv8-Face"
            except Exception as e:
                # Log and proceed to fallback
                pass

        if not enable_fallback or self.mtcnn is None:
            return None, "No face detected"

        # --- STAGE 2: Fallback to MTCNN ---
        try:
            boxes, _ = self.mtcnn.detect(pil_image)
            if boxes is not None and len(boxes) > 0:
                box = boxes[0]
                box = [max(0, b) for b in box]
                
                x1 = int(box[0])
                y1 = int(box[1])
                x2 = min(w_img, int(box[2]))
                y2 = min(h_img, int(box[3]))
                
                bw = x2 - x1
                bh = y2 - y1
                ratio = bw / bh if bh > 0 else 0
                
                if ratio < 0.5 or ratio > 2.0:
                    return None, "Bad Crop"
                    
                face_crop = pil_image.crop((x1, y1, x2, y2))
                if face_crop.size[0] > 0 and face_crop.size[1] > 0:
                    return face_crop, "MTCNN-Fallback"
        except Exception as e:
            return None, f"Detection Error: {e}"

        return None, "No face detected"
