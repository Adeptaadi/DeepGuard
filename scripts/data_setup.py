import os
import sys
import json
import shutil
import argparse
from sklearn.model_selection import train_test_split

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def secure_split(data_dir: str = "data", train_ratio: float = 0.8):
    if not os.path.exists(data_dir):
        print(f"❌ Error: Directory '{data_dir}' does not exist.")
        return

    metadata_path = os.path.join(data_dir, 'metadata.json')
    if not os.path.exists(metadata_path):
        print(f"❌ Error: metadata.json not found at '{metadata_path}'")
        return

    with open(metadata_path) as f:
        metadata = json.load(f)

    print(f"🔍 Found {len(metadata)} entries in metadata.json")

    subjects = {}
    for video, info in metadata.items():
        root = info.get('original') if info.get('original') else video
        subjects.setdefault(root, []).append(video)

    unique_roots = list(subjects.keys())
    print(f"👥 Identified {len(unique_roots)} unique subject groups.")

    train_roots, test_roots = train_test_split(unique_roots, train_size=train_ratio, random_state=42)

    move_count = 0
    missing_count = 0

    for split, roots in [('train', train_roots), ('test', test_roots)]:
        for root in roots:
            for video_file in subjects[root]:
                label = metadata[video_file].get('label', 'unknown').lower()
                dest_dir = os.path.join(data_dir, split, label)
                os.makedirs(dest_dir, exist_ok=True)
                
                src = os.path.join(data_dir, video_file)
                if os.path.exists(src):
                    shutil.move(src, os.path.join(dest_dir, video_file))
                    move_count += 1
                else:
                    missing_count += 1

    print(f"✅ Reorganization Complete!")
    print(f"📦 Files Moved: {move_count}")
    print(f"⚠️ Files Missing on Disk: {missing_count}")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Raw Dataset Organizer")
    parser.add_argument("--data-dir", "-d", type=str, default="data", help="Directory containing raw videos and metadata.json")
    parser.add_argument("--train-ratio", "-r", type=float, default=0.8, help="Train ratio (default: 0.8)")
    args = parser.parse_args()
    
    secure_split(args.data_dir, args.train_ratio)


if __name__ == "__main__":
    main()
