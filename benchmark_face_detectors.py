import time
import cv2
from PIL import Image
import torch
from utils.face_detector import HybridFaceDetector
from facenet_pytorch import MTCNN

def run_benchmark(video_path, sample_interval=5, max_frames=50):
    print(f"\n==========================================")
    print(f"  BENCHMARK: MTCNN (v1.0) vs HYBRID (v1.1)")
    print(f"==========================================")
    print(f"Video: {video_path}")
    print(f"Sample Interval: {sample_interval} | Max Frames: {max_frames}\n")
    
    device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
    
    # Initialize Detectors
    t0 = time.time()
    mtcnn_only = MTCNN(image_size=299, margin=80, min_face_size=40, keep_all=False, select_largest=True, device=device, post_process=False)
    print(f"[Init] MTCNN loaded in {time.time()-t0:.2f}s")
    
    t0 = time.time()
    hybrid = HybridFaceDetector(device=device)
    print(f"[Init] Hybrid Detector loaded in {time.time()-t0:.2f}s\n")
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video {video_path}")
        return
        
    frame_idx = 0
    analyzed_count = 0
    
    # Metrics
    mtcnn_hits = 0
    mtcnn_time = 0.0
    
    hybrid_hits = 0
    hybrid_yolo_hits = 0
    hybrid_mtcnn_fallback_hits = 0
    hybrid_time = 0.0
    
    while analyzed_count < max_frames:
        ret, frame = cap.read()
        if not ret: break
        
        if frame_idx % sample_interval == 0:
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            
            # --- Benchmark 1: MTCNN Baseline ---
            t_start = time.time()
            boxes, _ = mtcnn_only.detect(pil_img)
            mtcnn_duration = time.time() - t_start
            mtcnn_time += mtcnn_duration
            if boxes is not None and len(boxes) > 0:
                mtcnn_hits += 1
                
            # --- Benchmark 2: Hybrid Detector ---
            t_start = time.time()
            face_crop, source = hybrid.detect_face(pil_img)
            hybrid_duration = time.time() - t_start
            hybrid_time += hybrid_duration
            if face_crop is not None:
                hybrid_hits += 1
                if source == "YOLOv8-Face":
                    hybrid_yolo_hits += 1
                elif source == "MTCNN-Fallback":
                    hybrid_mtcnn_fallback_hits += 1
                    
            analyzed_count += 1
            
        frame_idx += 1
        
    cap.release()
    
    print("------------------------------------------")
    print("  RESULTS")
    print("------------------------------------------")
    print(f"Total Frames Sampled: {analyzed_count}")
    print(f"\n1. MTCNN Baseline (v1.0):")
    print(f"   - Detected Faces: {mtcnn_hits}/{analyzed_count} ({(mtcnn_hits/analyzed_count)*100:.1f}%)")
    print(f"   - Avg Latency:    {(mtcnn_time/analyzed_count)*1000:.1f} ms / frame")
    
    print(f"\n2. Hybrid Detector (v1.1):")
    print(f"   - Detected Faces: {hybrid_hits}/{analyzed_count} ({(hybrid_hits/analyzed_count)*100:.1f}%)")
    print(f"   - YOLO Primary:   {hybrid_yolo_hits} frames")
    print(f"   - MTCNN Fallback: {hybrid_mtcnn_fallback_hits} frames")
    print(f"   - Avg Latency:    {(hybrid_time/analyzed_count)*1000:.1f} ms / frame")
    print("------------------------------------------")
    
    recall_gain = ((hybrid_hits - mtcnn_hits) / analyzed_count) * 100
    speedup = ((mtcnn_time - hybrid_time) / mtcnn_time) * 100 if mtcnn_time > 0 else 0
    print(f"Recall Delta:  {'+' if recall_gain >= 0 else ''}{recall_gain:.1f}%")
    print(f"Speed Delta:   {'+' if speedup >= 0 else ''}{speedup:.1f}% faster")
    print("==========================================\n")

if __name__ == "__main__":
    run_benchmark("temp_WhatsApp Video 2025-12-02 at 11.49.02.mp4", sample_interval=5, max_frames=60)
