import torch
import cv2
import os
import numpy as np
from PIL import Image
from torchvision import transforms
from utils.model_utils import get_model
from utils.visualize import GradCAM, overlay_heatmap

# --- CONFIG ---
DEVICE = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
MODEL_PATH = 'models/deepfake_detector_xception.pth'

# ---------------------------------------------------------
# 👇 PASTE THE PATH TO ONE OF YOUR FAKE IMAGES HERE 👇
# Example: r"C:\Users\Aaditya Rana\...\output_faces\fake\video_1_face_0.jpg"
TEST_IMAGE_PATH = r"C:\Users\Aaditya Rana\OneDrive\Desktop\EDAI_SEM_3\DeepFakeDetector\output_faces\fake\acanmekatk_frame_60_face_0.jpg"
# ---------------------------------------------------------

def main():
    print("\n[STEP 1] Checking Image Path...")
    if not os.path.exists(TEST_IMAGE_PATH):
        print(f"❌ ERROR: File not found at: {TEST_IMAGE_PATH}")
        print("Please update line 17 in test.py with a valid path.")
        return
    print(f"✅ Image found: {os.path.basename(TEST_IMAGE_PATH)}")

    print("\n[STEP 2] Loading Model...")
    # Load model architecture
    model = get_model('xception', num_classes=2, pretrained=False)
    
    # Load weights
    if os.path.exists(MODEL_PATH):
        state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
        model.load_state_dict(state_dict)
        print("✅ Model weights loaded successfully.")
    else:
        print(f"❌ ERROR: Model weights not found at {MODEL_PATH}")
        return
    
    model.to(DEVICE)
    model.eval()

    # --- SELECT TARGET LAYER FOR GRAD-CAM ---
    # Try 'act4' (common in timm xception), fallback to 'conv4'
    try:
        target_layer = model.act4
    except AttributeError:
        # Fallback for some timm versions
        target_layer = model.conv4
    
    print(f"✅ Target Layer identified: {target_layer}")

    print("\n[STEP 3] Running Prediction & GradCAM...")
    # 1. Load & Preprocess Image
    img_pil = Image.open(TEST_IMAGE_PATH).convert('RGB')
    
    preprocess = transforms.Compose([
        transforms.Resize((299, 299)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])
    input_tensor = preprocess(img_pil).unsqueeze(0).to(DEVICE)

    # 2. Initialize GradCAM
    cam = GradCAM(model, target_layer)

    # 3. Generate Heatmap
    # This will use the predicted class automatically
    heatmap = cam.generate_heatmap(input_tensor)
    
    # 4. Get Prediction Score
    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.nn.functional.softmax(output, dim=1)
        fake_prob = probs[0][1].item()
        
    label = "FAKE" if fake_prob > 0.5 else "REAL"
    confidence = fake_prob if label == "FAKE" else (1 - fake_prob)
    
    print(f"\n📢 PREDICTION RESULT: {label}")
    print(f"📊 Confidence: {confidence * 100:.2f}%")

    # 5. Save Visualization
    result_image = overlay_heatmap(img_pil, heatmap)
    save_path = "prediction_heatmap.jpg"
    result_image.save(save_path)
    
    print(f"\n✅ Visualization saved to: {os.path.abspath(save_path)}")
    print("Check this image to see 'why' the model made its decision.")
    
    # Clean up
    cam.remove_hooks()

if __name__ == "__main__":
    main()