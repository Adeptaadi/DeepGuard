import torch
import torch.nn as nn
import torch.optim as optim
import os
import gc
from tqdm import tqdm
from utils.model_utils import get_model
from utils.preprocess import get_dataloaders

# --- CONFIG ---
DATA_DIR = "output_faces"
BATCH_SIZE = 16  # LOWERED slightly to prevent VRAM crashes
LEARNING_RATE = 0.0002 
EPOCHS = 4 

DEVICE = torch.device("cuda" if torch.cuda.is_available() else 'cpu')

# STABILITY FIX: Disable cuDNN benchmarking to prevent stream mismatch
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True

# UPDATE: Commented out Xception because it is ALREADY DONE
MODELS_TO_UPDATE = [
    # ('xception', 'models/deepfake_detector_xception.pth'), # <--- SKIP THIS
    ('efficientnet_b0', 'models/deepfake_detector_efficientnet.pth') # <--- RUN THIS
]

def finetune_single_model(model_name, weight_path):
    print(f"\n[INFO] Fine-Tuning {model_name}...")
    
    # 1. Aggressive Cleanup (The Fix for Stream Mismatch)
    torch.cuda.empty_cache()
    gc.collect()
    
    # 2. Load Data
    train_loader, val_loader = get_dataloaders(DATA_DIR, batch_size=BATCH_SIZE)
    dataloaders = {'train': train_loader, 'val': val_loader}
    
    # 3. Load Existing Weights
    model = get_model(model_name, num_classes=2, pretrained=False)
    if os.path.exists(weight_path):
        model.load_state_dict(torch.load(weight_path))
        print(f"✅ Loaded existing weights from {weight_path}")
    else:
        print(f"❌ Error: Weights not found for {model_name}")
        return

    model = model.to(DEVICE)
    
    # 4. Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scaler = torch.cuda.amp.GradScaler()
    
    # 5. Training Loop
    for epoch in range(EPOCHS):
        print(f'Epoch {epoch+1}/{EPOCHS} [{model_name}]')
        
        for phase in ['train', 'val']:
            if phase == 'train': model.train()
            else: model.eval()
            
            running_loss = 0.0
            running_corrects = 0
            total_samples = 0
            
            pbar = tqdm(dataloaders[phase], desc=phase, leave=False)
            
            for inputs, labels in pbar:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
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
            
            epoch_loss = running_loss / total_samples
            epoch_acc = running_corrects.double() / total_samples
            print(f'  {phase} Acc: {epoch_acc:.4f}')

    # Save
    torch.save(model.state_dict(), weight_path)
    print(f"✅ Updated {weight_path}")

def main():
    # Run loop
    for name, path in MODELS_TO_UPDATE:
        finetune_single_model(name, path)

if __name__ == "__main__":
    main()