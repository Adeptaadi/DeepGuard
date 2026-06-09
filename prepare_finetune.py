import os
import cv2
import shutil
import random
from facenet_pytorch import MTCNN
import torch
from pathlib import Path

# --- CONFIG ---
# Where your problem video is
VIDEO_SOURCE = os.path.join("fine_tune_data", "fake")

# Where to put the faces (Injecting into your main dataset)
TRAIN_DEST = os.path.join("output_faces", "train", "fake")
VAL_DEST = os.path.join("output_faces", "val", "fake")

# Setup Device & MTCNN (Margin 80 matches your new model)
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(keep_all=True, device=device, margin=80, post_process=False)

def process_and_inject():
    if not os.path.exists(VIDEO_SOURCE):
        print(f"❌ Error: Folder {VIDEO_SOURCE} not found.")
        print("Please create 'fine_tune_data/fake' and put your video there.")
        return

    # Check output dirs exist
    if not os.path.exists(TRAIN_DEST):
        print(f"❌ Error: Main dataset not found at {TRAIN_DEST}")
        return

    print(f"[INFO] processing Hard Negatives from {VIDEO_SOURCE}...")
    
    videos = [f for f in os.listdir(VIDEO_SOURCE) if f.endswith(('.mp4', '.avi', '.mov'))]
    if not videos:
        print("❌ No videos found in fine_tune_data/fake/")
        return

    total_faces = 0
    
    for vid in videos:
        vid_path = os.path.join(VIDEO_SOURCE, vid)
        cap = cv2.VideoCapture(vid_path)
        frame_count = 0
        saved_count = 0
        
        print(f"  ├── Extracting: {vid}...")
        
        while True:
            ret, frame = cap.read()
            if not ret: break
            
            # AGGRESSIVE EXTRACTION: Take every 3rd frame (we want LOTS of examples of this failure)
            if frame_count % 3 == 0:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                boxes, _ = mtcnn.detect(frame_rgb)
                
                if boxes is not None:
                    for i, box in enumerate(boxes):
                        # Crop with margin logic
                        x1, y1, x2, y2 = [int(b) for b in box]
                        h, w, _ = frame_rgb.shape
                        x1 = max(0, x1); y1 = max(0, y1); x2 = min(w, x2); y2 = min(h, y2)
                        
                        face_crop = frame_rgb[y1:y2, x1:x2]
                        
                        if face_crop.size > 0:
                            # Filename marked as 'hardneg' so we can track it
                            filename = f"hardneg_{Path(vid).stem}_{frame_count}_{i}.jpg"
                            
                            # 90% go to Train, 10% to Val
                            if random.random() < 0.9:
                                save_path = os.path.join(TRAIN_DEST, filename)
                            else:
                                save_path = os.path.join(VAL_DEST, filename)
                                
                            face_bgr = cv2.cvtColor(face_crop, cv2.COLOR_RGB2BGR)
                            cv2.imwrite(save_path, face_bgr)
                            saved_count += 1
                            total_faces += 1
            frame_count += 1
        cap.release()
        print(f"      ✅ Added {saved_count} faces.")

    print(f"\n[DONE] Injected {total_faces} hard negative faces into the dataset.")

if __name__ == "__main__":
    process_and_inject()