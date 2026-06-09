import os
import shutil
import random
from tqdm import tqdm

# CONFIG
DATA_DIR = "output_faces"
TRAIN_RATIO = 0.8

def robust_split():
    # 1. Identify all unique source videos
    for category in ['real', 'fake']:
        source_dir = os.path.join(DATA_DIR, category)
        if not os.path.exists(source_dir):
            continue
            
        print(f"Processing {category}...")
        
        # Get all images
        images = [f for f in os.listdir(source_dir) if f.endswith('.jpg')]
        
        # Group by video prefix (assuming format: video_name_frame_x_face_y.jpg)
        # We split by the first part of the filename
        video_groups = {}
        for img in images:
            # logic: "video1_frame_0.jpg" -> "video1"
            video_id = "_".join(img.split('_')[:-4]) # Adjust based on your naming convention
            if video_id not in video_groups:
                video_groups[video_id] = []
            video_groups[video_id].append(img)
            
        video_ids = list(video_groups.keys())
        random.shuffle(video_ids)
        
        # 2. Split Video IDs (not images)
        split_idx = int(len(video_ids) * TRAIN_RATIO)
        train_videos = video_ids[:split_idx]
        val_videos = video_ids[split_idx:]
        
        # 3. Create clean folders
        train_dir = os.path.join(DATA_DIR, 'train', category)
        val_dir = os.path.join(DATA_DIR, 'val', category)
        os.makedirs(train_dir, exist_ok=True)
        os.makedirs(val_dir, exist_ok=True)
        
        # 4. Move files
        for vid in train_videos:
            for img in video_groups[vid]:
                shutil.move(os.path.join(source_dir, img), os.path.join(train_dir, img))
                
        for vid in val_videos:
            for img in video_groups[vid]:
                shutil.move(os.path.join(source_dir, img), os.path.join(val_dir, img))
                
        # Clean up empty source folder
        if not os.listdir(source_dir):
            os.rmdir(source_dir)

    print("✅ Split Complete. Check 'output_faces/train' and 'output_faces/val'.")

if __name__ == "__main__":
    robust_split()