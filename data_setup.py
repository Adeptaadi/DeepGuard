import os
import json
import shutil
from sklearn.model_selection import train_test_split

def secure_split(data_dir, train_ratio=0.8):
    # Check if directory exists
    if not os.path.exists(data_dir):
        print(f"❌ Error: The directory '{data_dir}' does not exist.")
        return

    metadata_path = os.path.join(data_dir, 'metadata.json')
    if not os.path.exists(metadata_path):
        print(f"❌ Error: metadata.json not found at {metadata_path}")
        return

    with open(metadata_path) as f:
        metadata = json.load(f)

    print(f"🔍 Found {len(metadata)} entries in metadata.json")

    # Grouping logic
    subjects = {}
    for video, info in metadata.items():
        root = info.get('original') if info.get('original') else video
        if root not in subjects:
            subjects[root] = []
        subjects[root].append(video)

    unique_roots = list(subjects.keys())
    print(f"👥 Identified {len(unique_roots)} unique subject groups.")

    train_roots, test_roots = train_test_split(unique_roots, train_size=train_ratio, random_state=42)

    move_count = 0
    missing_count = 0

    for split, roots in [('train', train_roots), ('test', test_roots)]:
        for root in roots:
            for video_file in subjects[root]:
                label = metadata[video_file]['label'].lower()
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

if __name__ == "__main__":
    # Ensure this points to your folder named 'data'
    secure_split('./data', train_ratio=0.8)
