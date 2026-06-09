import os
import cv2
import json
import torch
from pathlib import Path
from facenet_pytorch import MTCNN

# --- CONFIGURATION ---
# Adjust these paths if your data is somewhere else
DATA_ROOT = os.path.join(os.getcwd(), 'data') 
METADATA_PATH = os.path.join(DATA_ROOT, 'metadata.json')
OUTPUT_ROOT = os.path.join(os.getcwd(), 'output_faces')

# Check Device
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print(f'[INFO] Running on device: {device}')

# Initialize MTCNN (Margin 80 for wide crop)
mtcnn = MTCNN(keep_all=True, device=device, margin=80, post_process=False)

def load_metadata():
    if not os.path.exists(METADATA_PATH):
        print(f"❌ ERROR: metadata.json not found at {METADATA_PATH}")
        print("Please ensure your 'data' folder contains the videos AND metadata.json")
        return None
    
    print(f"[INFO] Loading metadata from {METADATA_PATH}...")
    with open(METADATA_PATH, 'r') as f:
        data = json.load(f)
    print(f"[INFO] Found labels for {len(data)} videos.")
    return data

def process_video(video_path, label, output_dir, skip_frames=10):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return

    frame_count = 0
    face_count = 0
    video_name = Path(video_path).stem

    while True:
        ret, frame = cap.read()
        if not ret: break

        if frame_count % skip_frames == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Detect
            boxes, _ = mtcnn.detect(frame_rgb)

            if boxes is not None:
                for i, box in enumerate(boxes):
                    # Manual Crop with Margin 80 logic is handled by MTCNN detection coordinates
                    # But we need to integerize and clamp them to image bounds
                    x1, y1, x2, y2 = [int(b) for b in box]
                    
                    h, w, _ = frame_rgb.shape
                    x1 = max(0, x1); y1 = max(0, y1)
                    x2 = min(w, x2); y2 = min(h, y2)
                    
                    face_crop = frame_rgb[y1:y2, x1:x2]
                    
                    if face_crop.size > 0:
                        # Save logic
                        out_filename = f'{video_name}_frame_{frame_count}_face_{i}.jpg'
                        out_path = os.path.join(output_dir, out_filename)
                        
                        face_bgr = cv2.cvtColor(face_crop, cv2.COLOR_RGB2BGR)
                        cv2.imwrite(out_path, face_bgr)
                        face_count += 1
        frame_count += 1
    
    cap.release()
    # Optional: Print progress every video
    # print(f"  Processed {video_name} ({label}): Saved {face_count} faces.")

def main():
    # 1. Load Labels
    metadata = load_metadata()
    if metadata is None: return

    # 2. Setup Output Dirs
    real_dir = os.path.join(OUTPUT_ROOT, 'real')
    fake_dir = os.path.join(OUTPUT_ROOT, 'fake')
    os.makedirs(real_dir, exist_ok=True)
    os.makedirs(fake_dir, exist_ok=True)

    # 3. Scan Data Directory
    video_files = [f for f in os.listdir(DATA_ROOT) if f.endswith(('.mp4', '.avi', '.mov'))]
    print(f"[INFO] Found {len(video_files)} videos in {DATA_ROOT}")

    if len(video_files) == 0:
        print("⚠️ No videos found! Check if they are inside the 'data' folder.")
        return

    print("[INFO] Starting Extraction (This may take a while)...")
    
    for vid_file in video_files:
        if vid_file in metadata:
            label = metadata[vid_file]['label'] # 'REAL' or 'FAKE'
            full_path = os.path.join(DATA_ROOT, vid_file)
            
            if label == 'FAKE':
                process_video(full_path, label, fake_dir)
            elif label == 'REAL':
                process_video(full_path, label, real_dir)
        else:
            print(f"⚠️ Skipping {vid_file} (No metadata found)")

    print("\n✅ Extraction Complete!")
    print(f"Check {OUTPUT_ROOT} for results.")

if __name__ == '__main__':
    main()