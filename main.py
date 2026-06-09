    # main.py
import os
import json
from pathlib import Path
from utils.face_extractor import process_video, process_image

def main():
    """
    Main function to orchestrate the face extraction process from the dataset.
    Reads metadata to correctly label and save extracted faces.
    """
    print("🚀 Starting Deepfake Photo and Video Detection System - Data Preparation Phase")
    print("----------------------------------------------------------------------")
    
    # Define primary directories
    base_data_dir = Path("data")
    base_output_dir = Path("output_faces")
    
    # Create output directories if they don't exist
    real_output_dir = base_output_dir / "real"
    fake_output_dir = base_output_dir / "fake"
    
    real_output_dir.mkdir(parents=True, exist_ok=True)
    fake_output_dir.mkdir(parents=True, exist_ok=True)
    
    # Path to the metadata file
    metadata_path = base_data_dir / "metadata.json"
    
    if not metadata_path.exists():
        print(f"Error: metadata.json not found at {metadata_path}. Please place it in the data/ directory.")
        return

    # Load the metadata
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
        
    # Process each video based on its label
    print("📋 Processing videos based on metadata...")
    total_videos = len(metadata)
    processed_count = 0
    
    for video_filename, info in metadata.items():
        label = info.get("label")
        if label:
            label = label.lower()
            
            # Determine the correct output directory based on the label
            output_dir = real_output_dir if label == "real" else fake_output_dir
            
            # Construct the full path to the video file
            video_path = base_data_dir / video_filename
            
            if video_path.exists():
                print(f"🎬 [{processed_count + 1}/{total_videos}] Processing {video_filename}...")
                
                # Use the face_extractor function you already have
                # We can adjust the skip_frames parameter here for efficiency
                process_video(str(video_path), str(output_dir), skip_frames=10)
                
            else:
                print(f"⚠️ Warning: Video file {video_filename} not found at {video_path}. Skipping.")
        
        processed_count += 1

    print("\n✅ Face extraction completed for the entire dataset.")
    print(f"Extracted faces are saved to:\n- {real_output_dir}\n- {fake_output_dir}")
    print("You are now ready for Phase 3: Preprocessing.")

if __name__ == '__main__':
    main()






    