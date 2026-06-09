import os
import torch
from torch.utils.data import DataLoader
from torchvision import transforms, datasets
import random

# --- FIX FOR WINDOWS: Define the Noise Class explicitly ---
class AddGaussianNoise(object):
    """
    Adds Gaussian Noise to a tensor. 
    Defined as a class so Windows can pickle it for multi-processing.
    """
    def __init__(self, mean=0., std=0.05):
        self.std = std
        self.mean = mean
        
    def __call__(self, tensor):
        # Add noise and clamp to ensure valid image range
        return tensor + torch.randn(tensor.size()) * self.std + self.mean
    
    def __repr__(self):
        return self.__class__.__name__ + f'(mean={self.mean}, std={self.std})'

def get_dataloaders(data_dir, batch_size=24):
    """
    Revised Dataloaders with stronger augmentation.
    Windows-Safe version.
    """
    
    # Stronger Augmentation Strategy
    train_transform = transforms.Compose([
        transforms.Resize((299, 299)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(20),
        # Add Color Jitter (Lighting changes)
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        # Add Random Grayscale (10% chance)
        transforms.RandomGrayscale(p=0.1),
        
        transforms.ToTensor(),
        
        # FIX: Use the class instead of lambda
        AddGaussianNoise(0., 0.05),
        
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((299, 299)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])

    # Direct loading from the split folders
    train_dataset = datasets.ImageFolder(os.path.join(data_dir, 'train'), transform=train_transform)
    val_dataset = datasets.ImageFolder(os.path.join(data_dir, 'val'), transform=val_transform)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2, pin_memory=True)
    
    print(f"[INFO] Data Loaded: {len(train_dataset)} training, {len(val_dataset)} validation.")
    return train_loader, val_loader