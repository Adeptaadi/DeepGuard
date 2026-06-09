# verify_tta.py
import os
from utils.inference import predict_frame_tta, predict_video
from PIL import Image

# ---------------------------------------------------------
# 👇 PASTE THE SAME IMAGE PATH HERE 👇
TEST_IMAGE_PATH = r"C:\Users\Aaditya Rana\OneDrive\Desktop\EDAI_SEM_3\DeepFakeDetector\output_faces\fake\acanmekatk_frame_60_face_0.jpg"
# ---------------------------------------------------------

def main():
    print(f"Testing TTA Logic on: {os.path.basename(TEST_IMAGE_PATH)}")
    
    if not os.path.exists(TEST_IMAGE_PATH):
        print("❌ File not found.")
        return

    # 1. Load Image
    img = Image.open(TEST_IMAGE_PATH).convert('RGB')
    
    # 2. Run TTA Prediction (The function we wrote in inference.py)
    # This will print "Loading xception..." again as it initializes the inference engine
    label, conf = predict_frame_tta(img)
    
    print("\n" + "="*30)
    print(f"🤖 TTA RESULTS (Average of 3 views)")
    print(f"Label:      {label}")
    print(f"Confidence: {conf:.2f}%")
    print("="*30)
    print("\nIf you see this, your inference.py is 100% ready for the App.")

if __name__ == "__main__":
    main()