import os
import sys
import argparse

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def evaluate_image(image_path: str, model_type: str = "xception", weights_path: str = None, output_path: str = "prediction_heatmap.jpg"):
    import torch
    from PIL import Image
    from torchvision import transforms
    from utils.model_utils import get_model
    from utils.visualize import GradCAM, overlay_heatmap

    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    if weights_path is None:
        weights_path = f"models/deepfake_detector_{model_type}.pth"

    print(f"\n[STEP 1] Checking Image Path: {image_path}")
    if not os.path.exists(image_path):
        print(f"❌ ERROR: File not found at: {image_path}")
        return
    print(f"✅ Image found: {os.path.basename(image_path)}")

    print(f"\n[STEP 2] Loading Model '{model_type}' on {device}...")
    model = get_model(model_type, num_classes=2, pretrained=False)
    
    if os.path.exists(weights_path):
        state_dict = torch.load(weights_path, map_location=device)
        model.load_state_dict(state_dict)
        print(f"✅ Model weights loaded successfully from: {weights_path}")
    else:
        print(f"❌ ERROR: Model weights not found at {weights_path}")
        return
    
    model.to(device)
    model.eval()

    # Identify target layer for Grad-CAM
    if hasattr(model, 'act4'):
        target_layer = model.act4
    elif hasattr(model, 'conv4'):
        target_layer = model.conv4
    elif hasattr(model, 'conv_head'):
        target_layer = model.conv_head
    else:
        conv_layers = [m for m in model.modules() if isinstance(m, torch.nn.Conv2d)]
        target_layer = conv_layers[-1] if conv_layers else model

    print(f"✅ Target Layer identified: {target_layer.__class__.__name__}")

    print("\n[STEP 3] Running Prediction & Grad-CAM Analysis...")
    img_pil = Image.open(image_path).convert('RGB')
    
    preprocess = transforms.Compose([
        transforms.Resize((299, 299)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])
    input_tensor = preprocess(img_pil).unsqueeze(0).to(device)

    cam = GradCAM(model, target_layer)
    heatmap = cam.generate_heatmap(input_tensor)
    
    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.nn.functional.softmax(output, dim=1)
        fake_prob = probs[0][1].item()
        
    label = "FAKE" if fake_prob > 0.5 else "REAL"
    confidence = fake_prob if label == "FAKE" else (1 - fake_prob)
    
    print("\n==========================================")
    print(f"📢 PREDICTION VERDICT:  {label}")
    print(f"📊 Model Confidence:    {confidence * 100:.2f}%")
    print(f"🧪 Fake Probability:    {fake_prob * 100:.2f}%")
    print("==========================================")

    result_image = overlay_heatmap(img_pil, heatmap)
    result_image.save(output_path)
    print(f"\n✅ Visual evidence saved to: {os.path.abspath(output_path)}")
    
    cam.remove_hooks()


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Image Evaluation & Grad-CAM Visualization")
    parser.add_argument("--image", "-i", type=str, required=True, help="Path to face image for evaluation")
    parser.add_argument("--model", "-m", type=str, default="xception", choices=["xception", "efficientnet_b0"], help="Model architecture")
    parser.add_argument("--weights", "-w", type=str, default=None, help="Custom weights file path")
    parser.add_argument("--output", "-o", type=str, default="prediction_heatmap.jpg", help="Output path for heatmap")
    
    args = parser.parse_args()
    evaluate_image(args.image, model_type=args.model, weights_path=args.weights, output_path=args.output)


if __name__ == "__main__":
    main()
