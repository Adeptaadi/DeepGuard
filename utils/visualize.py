import torch
import cv2
import numpy as np
from PIL import Image

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.activations = None
        self.gradients = None
        
        # Hooks
        self.target_layer.register_forward_hook(self.save_activation)
        self.target_layer.register_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate_heatmap(self, input_tensor, target_class_idx=None):
        # 1. Forward
        self.model.eval()
        output = self.model(input_tensor)
        
        if target_class_idx is None:
            target_class_idx = output.argmax(dim=1).item()
        
        # 2. Backward
        self.model.zero_grad()
        score = output[:, target_class_idx]
        score.backward()
        
        # 3. Generate Map
        gradients = self.gradients
        activations = self.activations
        
        # Global Average Pooling
        weights = torch.mean(gradients, dim=[2, 3], keepdim=True)
        heatmap = torch.sum(weights * activations, dim=1, keepdim=True)
        
        # ReLU & Normalize
        heatmap = torch.nn.functional.relu(heatmap)
        heatmap = heatmap / (torch.max(heatmap) + 1e-7)
        
        return heatmap.squeeze().cpu().detach().numpy()

def overlay_heatmap(pil_img, heatmap, alpha=0.4):
    """
    Overlays a heatmap on a PIL image.
    """
    # Resize heatmap to image size
    heatmap = cv2.resize(heatmap, pil_img.size)
    
    # Colorize
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Blend
    img_np = np.array(pil_img)
    overlay = cv2.addWeighted(img_np, 1 - alpha, heatmap_colored, alpha, 0)
    
    return Image.fromarray(overlay)