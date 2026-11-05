import sys
import os
import argparse

# Ensure repo root is in python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def finetune_single_model(model_name: str, 
                          weight_path: str, 
                          data_dir: str = "output_faces",
                          batch_size: int = 16, 
                          lr: float = 0.0002, 
                          epochs: int = 4):
    import gc
    from tqdm import tqdm
    import torch
    import torch.nn as nn
    import torch.optim as optim
    from utils.model_utils import get_model
    from utils.preprocess import get_dataloaders

    device = torch.device("cuda" if torch.cuda.is_available() else 'cpu')
    print(f"\n[INFO] Fine-Tuning {model_name} on {device} (Hard Negative Mining)...")
    
    torch.cuda.empty_cache()
    gc.collect()
    
    train_loader, val_loader = get_dataloaders(data_dir, batch_size=batch_size)
    dataloaders = {'train': train_loader, 'val': val_loader}
    
    model = get_model(model_name, num_classes=2, pretrained=False)
    if os.path.exists(weight_path):
        model.load_state_dict(torch.load(weight_path, map_location=device))
        print(f"✅ Loaded base weights from {weight_path}")
    else:
        print(f"❌ Error: Weights not found at {weight_path}")
        return

    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    scaler = torch.cuda.amp.GradScaler(enabled=(device.type == "cuda"))
    
    for epoch in range(epochs):
        print(f'Epoch {epoch+1}/{epochs} [{model_name}]')
        
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()
            
            running_loss = 0.0
            running_corrects = 0
            total_samples = 0
            
            pbar = tqdm(dataloaders[phase], desc=phase, leave=False)
            
            for inputs, labels in pbar:
                inputs, labels = inputs.to(device), labels.to(device)
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
            
            epoch_loss = running_loss / total_samples
            epoch_acc = running_corrects.double() / total_samples
            print(f'  {phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

    torch.save(model.state_dict(), weight_path)
    print(f"✅ Successfully fine-tuned and updated weights at {weight_path}")


def main():
    parser = argparse.ArgumentParser(description="DeepGuard AI - Hard Negative Mining Fine-Tuner")
    parser.add_argument("--model", "-m", type=str, default="efficientnet_b0", choices=["xception", "efficientnet_b0"], help="Model backbone")
    parser.add_argument("--weights", "-w", type=str, default="models/deepfake_detector_efficientnet.pth", help="Checkpoint path")
    parser.add_argument("--data-dir", "-d", type=str, default="output_faces", help="Dataset directory")
    parser.add_argument("--batch-size", "-b", type=int, default=16, help="Batch size")
    parser.add_argument("--lr", type=float, default=0.0002, help="Learning rate")
    parser.add_argument("--epochs", "-e", type=int, default=4, help="Fine-tuning epochs")
    args = parser.parse_args()
    
    finetune_single_model(args.model, args.weights, args.data_dir, args.batch_size, args.lr, args.epochs)


if __name__ == "__main__":
    main()
