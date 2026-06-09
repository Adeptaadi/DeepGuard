import torch
import torch.nn as nn
import timm

def get_model(model_name='xception', num_classes=2, pretrained=True):
    """
    Loads a timm model and robustly modifies the classifier head 
    regardless of the architecture (EfficientNet, Xception, ResNet, etc.).
    """
    print(f"[INFO] Loading {model_name} (pretrained={pretrained})...")
    
    # Load model from timm library
    model = timm.create_model(model_name, pretrained=pretrained)
    
    # ROBUS HEAD REPLACEMENT
    # timm provides a standard method to reset the classifier head
    # This works for BOTH 'fc' (Xception) and 'classifier' (EfficientNet)
    model.reset_classifier(num_classes)
        
    return model