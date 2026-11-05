import os
import sys
import json
import argparse
from pathlib import Path

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.face_extractor import process_video, process_image


def extract_faces_from_dataset(data_dir: str = "data", output_dir: str = "output_faces", skip_frames: int = 10):
    print("🚀 DeepGuard AI - Dataset Face Extraction Pipeline")
    print("----------------------------------------------------------------------")
    
    base_data_dir = Path(data_dir)
    base_output_dir = Path(output_dir)
    
    real_output_dir = base_output_dir / "real"
    fake_output_dir = base_output_dir / "fake"
    
    real_output_dir.mkdir(parents=True, exist_ok=True)
    fake_output_dir.mkdir(parents=True, exist_ok=True)
    
    metadata_path = base_data_dir / "metadata.json"
    
    if not metadata_path.exists():
        print(f"❌ Error: metadata.json not found at {metadata_path}. Please place it in {base_data_dir}/.")
        return

    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
        
    print(f"📋 Found {len(metadata)} entries in metadata.json")
    total_videos = len(metadata)
    processed_count = 0
    
    for video_filename, info in metadata.items():
        label = info.get("label")
        if label:
            label = label.lower()
            target_dir = real_output_dir if label == "real" else fake_output_dir
            video_path = base_data_dir / video_filename
            
            if video_path.exists():
                print(f"🎬 [{processed_count + 1}/{total_videos}] Processing {video_filename} ({label})...")
                process_video(str(video_path), str(target_dir), skip_frames=skip_frames)
            else:
                print(f"⚠️ Warning: Video file not found: {video_path}")
        processed_count += 1

    print("\n✅ Face extraction completed successfully.")
    print(f"Saved real faces to: {real_output_dir}")
    print(f"Saved fake faces to: {fake_output_dir}")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Face Extraction from Dataset")
    parser.add_argument("--data-dir", "-d", type=str, default="data", help="Directory containing raw videos and metadata.json")
    parser.add_argument("--output-dir", "-o", type=str, default="output_faces", help="Output directory for cropped faces")
    parser.add_argument("--skip-frames", "-s", type=int, default=10, help="Interval of frames to sample")
    args = parser.parse_args()
    
    extract_faces_from_dataset(args.data_dir, args.output_dir, args.skip_frames)


if __name__ == '__main__':
    main()
