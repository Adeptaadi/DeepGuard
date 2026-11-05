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
        
        # Use modern non-leaking hooks
        if hasattr(self.target_layer, 'register_full_backward_hook'):
            self.bwd_handle = self.target_layer.register_full_backward_hook(self.save_gradient)
        else:
            self.bwd_handle = self.target_layer.register_backward_hook(self.save_gradient)
            
        self.fwd_handle = self.target_layer.register_forward_hook(self.save_activation)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        if grad_output and len(grad_output) > 0 and grad_output[0] is not None:
            self.gradients = grad_output[0].detach()

    def generate_heatmap(self, input_tensor, target_class_idx=None):
        self.model.eval()
        
        with torch.enable_grad():
            # Clone detached input so we don't retain prior graph
            inp = input_tensor.clone().detach().requires_grad_(True)
            output = self.model(inp)
            
            if target_class_idx is None:
                target_class_idx = output.argmax(dim=1).item()
            
            self.model.zero_grad(set_to_none=True)
            score = output[:, target_class_idx]
            score.backward()
            
            if self.gradients is None or self.activations is None:
                # Fallback to zero heatmap if gradient not hooked
                return np.zeros((299, 299), dtype=np.float32)
            
            # Global Average Pooling
            weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
            heatmap = torch.sum(weights * self.activations, dim=1, keepdim=True)
            
            # ReLU & Normalize
            heatmap = torch.nn.functional.relu(heatmap)
            max_val = torch.max(heatmap)
            if max_val > 0:
                heatmap = heatmap / (max_val + 1e-7)
                
            result = heatmap.squeeze().cpu().detach().numpy()

            # Immediate cleanup to release autograd graph from RAM
            self.activations = None
            self.gradients = None
            self.model.zero_grad(set_to_none=True)
            del inp, output, score, weights, heatmap
            
            return result

    def remove_hooks(self):
        try:
            self.fwd_handle.remove()
            self.bwd_handle.remove()
        except Exception:
            pass


def overlay_heatmap(pil_img, heatmap, alpha=0.4):
    """
    Overlays a heatmap on a PIL image.
    """
    if heatmap is None or heatmap.size == 0:
        return pil_img

    heatmap_resized = cv2.resize(heatmap, pil_img.size)
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    img_np = np.array(pil_img)
    overlay = cv2.addWeighted(img_np, 1 - alpha, heatmap_colored, alpha, 0)
    
    return Image.fromarray(overlay)
