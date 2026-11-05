import sys
import os
import argparse

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def train_efficientnet(data_dir: str = "output_faces", 
                       save_path: str = "models/deepfake_detector_efficientnet.pth",
                       model_name: str = "efficientnet_b0",
                       batch_size: int = 24, 
                       lr: float = 0.0001, 
                       epochs: int = 10):
    import copy
    from tqdm import tqdm
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from utils.model_utils import get_model
    from utils.preprocess import get_dataloaders

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    print(f"[INFO] Training {model_name} on Device: {device}")
    print(f"[INFO] Hyperparameters -> Epochs: {epochs}, Batch: {batch_size}, LR: {lr}")
    
    train_loader, val_loader = get_dataloaders(data_dir, batch_size=batch_size)
    dataloaders = {'train': train_loader, 'val': val_loader}
    
    model = get_model(model_name, num_classes=2)
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    scaler = torch.cuda.amp.GradScaler(enabled=(device.type == "cuda"))
    
    best_acc = 0.0
    best_model_wts = copy.deepcopy(model.state_dict())
    
    for epoch in range(epochs):
        print(f'\nEpoch {epoch+1}/{epochs}')
        print('-' * 25)
        
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
                inputs = inputs.to(device)
                labels = labels.to(device)
                
                optimizer.zero_grad()
                
                with torch.set_grad_enabled(phase == 'train'):
                    with torch.cuda.amp.autocast(enabled=(device.type == "cuda")):
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
                torch.save(best_model_wts, save_path)
                print(f"--> Best {model_name} saved to {save_path}! Acc: {best_acc:.4f}")
                
    print(f"\n[DONE] {model_name} Training Complete. Peak Validation Acc: {best_acc:.4f}")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Train EfficientNet Detector")
    parser.add_argument("--data-dir", "-d", type=str, default="output_faces", help="Path to cropped faces dataset")
    parser.add_argument("--save-path", "-s", type=str, default="models/deepfake_detector_efficientnet.pth", help="Checkpoint save destination")
    parser.add_argument("--model-name", "-m", type=str, default="efficientnet_b0", help="EfficientNet backbone")
    parser.add_argument("--batch-size", "-b", type=int, default=24, help="Batch size")
    parser.add_argument("--lr", type=float, default=0.0001, help="Learning rate")
    parser.add_argument("--epochs", "-e", type=int, default=10, help="Number of training epochs")
    args = parser.parse_args()
    
    train_efficientnet(args.data_dir, args.save_path, args.model_name, args.batch_size, args.lr, args.epochs)


if __name__ == "__main__":
    main()
