import os
import sys
import argparse

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def test_tta(image_path: str):
    from PIL import Image
    from utils.inference import predict_frame_tta

    print(f"[TTA Verification] Testing image: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        return

    img = Image.open(image_path).convert('RGB')
    label, conf = predict_frame_tta(img)
    
    print("\n" + "=" * 40)
    print("🤖 TEST-TIME AUGMENTATION (TTA) RESULTS")
    print(f"Predicted Verdict: {label}")
    print(f"Confidence Score:  {conf:.2f}%")
    print("=" * 40)


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Test-Time Augmentation (TTA) Verification")
    parser.add_argument("--image", "-i", type=str, required=True, help="Path to input image")
    args = parser.parse_args()
    test_tta(args.image)


if __name__ == "__main__":
    main()
