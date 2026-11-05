import os
import sys
import cv2
import random
import argparse
from pathlib import Path
from facenet_pytorch import MTCNN
import torch

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def process_and_inject(video_source: str = "fine_tune_data/fake", 
                       train_dest: str = "output_faces/train/fake", 
                       val_dest: str = "output_faces/val/fake"):
    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    mtcnn = MTCNN(keep_all=True, device=device, margin=80, post_process=False)

    if not os.path.exists(video_source):
        print(f"❌ Error: Folder {video_source} not found.")
        print(f"Please create '{video_source}' and place challenging videos there.")
        return

    os.makedirs(train_dest, exist_ok=True)
    os.makedirs(val_dest, exist_ok=True)

    print(f"[INFO] Extracting Hard Negatives from {video_source} using {device}...")
    
    videos = [f for f in os.listdir(video_source) if f.endswith(('.mp4', '.avi', '.mov', '.webm'))]
    if not videos:
        print(f"❌ No video files found in {video_source}")
        return

    total_faces = 0
    
    for vid in videos:
        vid_path = os.path.join(video_source, vid)
        cap = cv2.VideoCapture(vid_path)
        frame_count = 0
        saved_count = 0
        
        print(f"  ├── Extracting: {vid}...")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Sample every 3rd frame to get rich variation of failure modes
            if frame_count % 3 == 0:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                boxes, _ = mtcnn.detect(frame_rgb)
                
                if boxes is not None:
                    for i, box in enumerate(boxes):
                        x1, y1, x2, y2 = [int(b) for b in box]
                        h, w, _ = frame_rgb.shape
                        x1 = max(0, x1); y1 = max(0, y1); x2 = min(w, x2); y2 = min(h, y2)
                        
                        face_crop = frame_rgb[y1:y2, x1:x2]
                        
                        if face_crop.size > 0:
                            filename = f"hardneg_{Path(vid).stem}_{frame_count}_{i}.jpg"
                            save_path = os.path.join(train_dest if random.random() < 0.9 else val_dest, filename)
                                
                            face_bgr = cv2.cvtColor(face_crop, cv2.COLOR_RGB2BGR)
                            cv2.imwrite(save_path, face_bgr)
                            saved_count += 1
                            total_faces += 1
            frame_count += 1
        cap.release()
        print(f"      ✅ Added {saved_count} faces.")

    print(f"\n[DONE] Injected {total_faces} hard negative faces into dataset partitions.")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Hard Negative Mining Extractor")
    parser.add_argument("--source", "-s", type=str, default="fine_tune_data/fake", help="Directory of difficult fake videos")
    parser.add_argument("--train-dest", type=str, default="output_faces/train/fake", help="Destination for training faces")
    parser.add_argument("--val-dest", type=str, default="output_faces/val/fake", help="Destination for validation faces")
    args = parser.parse_args()
    
    process_and_inject(args.source, args.train_dest, args.val_dest)


if __name__ == "__main__":
    main()
