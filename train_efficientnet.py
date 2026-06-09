import torch
import torch.nn as nn
import torch.optim as optim
import os
import copy
from tqdm import tqdm

# Import utils
from utils.model_utils import get_model
from utils.preprocess import get_dataloaders

# --- CONFIGURATION ---
DATA_DIR = "output_faces" 
# CRITICAL: Different save path so we don't overwrite Xception
MODEL_SAVE_PATH = "models/deepfake_detector_efficientnet.pth"
MODEL_NAME = "efficientnet_b0"

# EfficientNet is lighter, so we can often use a slightly larger batch size
# But let's stick to 24 to be safe on your 6GB VRAM
BATCH_SIZE = 24       
LEARNING_RATE = 0.0001
EPOCHS = 10
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def train_model():
    # 1. Setup
    if not os.path.exists("models"):
        os.makedirs("models")
        
    print(f"[INFO] Training {MODEL_NAME} on Device: {DEVICE}")
    
    # 2. Data
    # We use the EXACT SAME data loaders as Xception
    train_loader, val_loader = get_dataloaders(DATA_DIR, batch_size=BATCH_SIZE)
    dataloaders = {'train': train_loader, 'val': val_loader}
    
    # 3. Model
    model = get_model(MODEL_NAME, num_classes=2)
    model = model.to(DEVICE)
    
    # 4. Optimization
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    # Mixed Precision Scaler
    scaler = torch.cuda.amp.GradScaler()
    
    best_acc = 0.0
    best_model_wts = copy.deepcopy(model.state_dict())
    
    # 5. Training Loop
    for epoch in range(EPOCHS):
        print(f'\nEpoch {epoch+1}/{EPOCHS}')
        print('-' * 10)
        
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()
                
            running_loss = 0.0
            running_corrects = 0
            total_samples = 0
            
            pbar = tqdm(dataloaders[phase], desc=phase)
            
            for inputs, labels in pbar:
                inputs = inputs.to(DEVICE)
                labels = labels.to(DEVICE)
                
                optimizer.zero_grad()
                
                with torch.set_grad_enabled(phase == 'train'):
                    with torch.cuda.amp.autocast():
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)
                        
                    if phase == 'train':
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()
                
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
                total_samples += inputs.size(0)
                
                pbar.set_postfix({'loss': loss.item()})

            epoch_loss = running_loss / total_samples
            epoch_acc = running_corrects.double() / total_samples
            
            print(f'{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')
            
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                torch.save(best_model_wts, MODEL_SAVE_PATH)
                print(f"--> New Best Model Saved! Acc: {best_acc:.4f}")
                
    print(f"Training Complete. Best Acc: {best_acc:.4f}")

if __name__ == "__main__":
    train_model()