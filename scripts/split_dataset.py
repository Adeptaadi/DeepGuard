import os
import sys
import shutil
import random
import argparse
from tqdm import tqdm

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def video_level_split(data_dir: str = "output_faces", train_ratio: float = 0.8):
    """
    Performs video-level splitting across classes to prevent data leakage.
    Ensures all frames belonging to the same source video reside solely in train or val.
    """
    print(f"🔒 Running Leak-Free Video-Level Split on: {data_dir} (Train Ratio: {train_ratio})")
    
    for category in ['real', 'fake']:
        source_dir = os.path.join(data_dir, category)
        if not os.path.exists(source_dir):
            continue
            
        print(f"  ├── Processing '{category}'...")
        images = [f for f in os.listdir(source_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        # Group by video ID prefix
        video_groups = {}
        for img in images:
            tokens = img.split('_')
            # Extract video base name by stripping frame and face suffixes
            video_id = "_".join(tokens[:-4]) if len(tokens) >= 5 else tokens[0]
            video_groups.setdefault(video_id, []).append(img)
            
        video_ids = list(video_groups.keys())
        random.shuffle(video_ids)
        
        split_idx = int(len(video_ids) * train_ratio)
        train_videos = video_ids[:split_idx]
        val_videos = video_ids[split_idx:]
        
        train_dir = os.path.join(data_dir, 'train', category)
        val_dir = os.path.join(data_dir, 'val', category)
        os.makedirs(train_dir, exist_ok=True)
        os.makedirs(val_dir, exist_ok=True)
        
        for vid in train_videos:
            for img in video_groups[vid]:
                shutil.move(os.path.join(source_dir, img), os.path.join(train_dir, img))
                
        for vid in val_videos:
            for img in video_groups[vid]:
                shutil.move(os.path.join(source_dir, img), os.path.join(val_dir, img))
                
        if os.path.exists(source_dir) and not os.listdir(source_dir):
            os.rmdir(source_dir)

    print(f"✅ Video-level split complete! Partitions saved in '{data_dir}/train' and '{data_dir}/val'.")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Leak-Free Video Level Dataset Split")
    parser.add_argument("--data-dir", "-d", type=str, default="output_faces", help="Directory of face frames")
    parser.add_argument("--train-ratio", "-r", type=float, default=0.8, help="Train ratio (default: 0.8)")
    args = parser.parse_args()
    
    video_level_split(args.data_dir, args.train_ratio)


if __name__ == "__main__":
    main()
