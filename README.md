# DeepGuard AI

> A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection

DeepGuard AI is a full-stack deepfake detection framework designed to identify manipulated facial images and videos using a combination of computer vision, deep learning, ensemble learning, temporal aggregation, and explainable AI techniques. The system combines XceptionNet and EfficientNet-B0 to detect a wide range of deepfake artifacts including facial blending inconsistencies, boundary distortions, texture anomalies, and compression-induced manipulations.

Developed as a research-oriented project, DeepGuard aims to achieve high detection accuracy while remaining computationally efficient and deployable on consumer-grade hardware.

---

# Authors

- Aditya Rana
- Nitish Sahu
- Manthan Sali
- Palash Sahuji

Department of Computer Science and Engineering

Vishwakarma Institute of Technology (VIT), Pune

---

# Abstract

The rapid advancement of generative artificial intelligence has enabled the creation of highly realistic deepfakes capable of manipulating facial appearance, expressions, and identity. While such technologies have legitimate applications in media generation and entertainment, they also pose serious risks including misinformation, identity theft, political manipulation, and social engineering attacks.

DeepGuard AI presents a lightweight dual-CNN ensemble framework for deepfake video detection. The system combines XceptionNet and EfficientNet-B0 to capture complementary spatial and texture-based artifacts commonly introduced during deepfake generation. To improve robustness, the framework incorporates Hard Negative Mining and Temporal Aggregation techniques. Furthermore, Grad-CAM explainability is integrated to provide visual evidence supporting model decisions.

The proposed framework achieves high detection accuracy while remaining deployable on consumer-grade hardware, making it suitable for practical real-world applications.

---

# Motivation

Deepfake technology has evolved rapidly in recent years due to advancements in:

- Generative Adversarial Networks (GANs)
- Autoencoders
- Diffusion Models
- Facial Reenactment Systems

Modern deepfake generators can produce highly convincing videos that are often indistinguishable from authentic media.

These manipulated videos pose significant threats:

### Identity Fraud

Malicious actors can impersonate individuals for financial or legal exploitation.

### Misinformation

Fabricated videos can be used to spread false narratives and influence public opinion.

### Social Engineering

Deepfake videos can enhance phishing and impersonation attacks.

### Loss of Digital Trust

The inability to verify media authenticity undermines confidence in digital communication.

The primary goal of DeepGuard is to develop an accurate, explainable, and efficient deepfake detection framework capable of operating under practical hardware constraints.

---

# Research Objectives

The project was designed around the following objectives:

1. Develop a robust deepfake detection framework.
2. Improve detection of high-quality manipulations.
3. Minimize false positives and false negatives.
4. Provide explainable predictions through visual evidence.
5. Maintain computational efficiency.
6. Enable deployment on consumer-grade hardware.

---

# Key Contributions

### Dual-CNN Ensemble Architecture

Combines XceptionNet and EfficientNet-B0 to leverage complementary feature representations.

### Hard Negative Mining

Improves model robustness by retraining on difficult misclassified samples.

### Lightweight Temporal Aggregation

Provides video-level consistency without expensive temporal networks.

### Explainable AI

Grad-CAM heatmaps identify regions contributing most strongly to model predictions.

### Consumer Hardware Optimization

Designed and optimized for NVIDIA RTX 4050 Laptop GPU (6GB VRAM).

---

# Challenges in Deepfake Detection

Deepfake detection presents several unique challenges:

### Compression Artifacts

Most online videos undergo aggressive compression that can obscure manipulation traces.

### Generalization

Models must perform well across unseen identities and manipulation techniques.

### Dataset Leakage

Random frame-level splitting can lead to artificially inflated validation performance.

### Temporal Variability

Deepfake artifacts may only appear intermittently across video frames.

### Computational Constraints

Many state-of-the-art approaches require expensive GPU resources.

DeepGuard addresses these challenges through careful dataset preparation, ensemble learning, temporal aggregation, and hardware-aware optimization.

---

# System Architecture

```text
Video/Image Input
        │
        ▼
Frame Extraction
        │
        ▼
MTCNN Face Detection
        │
        ▼
Context-Aware Face Crop
        │
        ▼
Preprocessing
        │
        ▼
Test-Time Augmentation
        │
        ▼
 ┌──────────────┐
 │ XceptionNet  │
 └──────────────┘
        │
        ▼
 ┌──────────────┐
 │ EfficientNet │
 └──────────────┘
        │
        ▼
 Ensemble Fusion
        │
        ▼
 Video Statistics
        │
        ▼
 Temporal Aggregation
        │
        ▼
 Decision Engine
        │
        ▼
 Grad-CAM
        │
        ▼
 Final Verdict
```

---

# Technology Stack

## Deep Learning

- PyTorch
- CUDA
- cuDNN
- Automatic Mixed Precision (AMP)

## Computer Vision

- OpenCV
- MTCNN
- facenet-pytorch
- Pillow
- NumPy

## Backend

- FastAPI
- Uvicorn
- Python

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

## Explainability

- Grad-CAM

---

# Dataset

## DeepFake Detection Challenge (DFDC)

DeepGuard was trained using the DFDC dataset.

Characteristics:

- Real videos
- Face-swapped videos
- Facial reenactment videos
- Compressed internet-quality videos

The dataset contains thousands of manipulated and authentic videos suitable for large-scale deepfake research.

---

# Data Preparation Pipeline

## Stage 1 – Video Collection

Raw videos are obtained from DFDC.

Videos are categorized into:

- Real
- Fake

based on provided metadata.

---

## Stage 2 – Face Extraction

DeepGuard uses MTCNN to detect faces within each frame.

Configuration:

```python
margin = 80
```

The enlarged crop includes:

- Chin
- Forehead
- Ears
- Face boundaries

This helps expose blending artifacts frequently missed by tighter crops.

---

## Stage 3 – Video-Level Splitting

Instead of random frame splitting, DeepGuard performs:

### Video-Level Split

All frames from a video belong to only one dataset partition.

Benefits:

- Prevents data leakage
- Improves generalization
- Produces realistic evaluation metrics

---

## Stage 4 – Data Augmentation

Training data is augmented using:

- Gaussian Noise
- Color Jitter
- Random Grayscale
- Horizontal Flip

Purpose:

- Improve robustness
- Simulate internet-quality videos
- Prevent overfitting

---

# Preprocessing Pipeline

Each detected face undergoes:

### Resize

```text
299 × 299
```

### RGB Conversion

Ensures consistent color representation.

### Tensor Conversion

Converts images into PyTorch tensors.

### Normalization

```python
mean = [0.5, 0.5, 0.5]
std  = [0.5, 0.5, 0.5]
```

Output range:

```text
[-1, 1]
```

This matches the normalization scheme used during training.

---

# Model Architecture

## XceptionNet

### Purpose

Detect spatial manipulation artifacts.

### Detects

- Face seams
- Blending boundaries
- Warping distortions
- Geometric inconsistencies

### Advantages

- Depthwise separable convolutions
- Lower parameter count
- Excellent performance on deepfake datasets

### Role

Acts as the Spatial Artifact Detector.

---

## EfficientNet-B0

### Purpose

Detect texture-based anomalies.

### Detects

- Skin texture inconsistencies
- Compression artifacts
- High-frequency distortions
- Fine-grained manipulation traces

### Advantages

- Lightweight architecture
- High accuracy-to-parameter ratio
- Efficient inference

### Role

Acts as the Texture Artifact Detector.

---

# Why Ensemble Learning?

No single model captures all manipulation patterns.

XceptionNet excels at:

- Spatial inconsistencies
- Boundary errors

EfficientNet excels at:

- Texture irregularities
- Compression artifacts

DeepGuard combines both models using Soft Voting:

```math
Pfinal = (Pxception + PefficientNet) / 2
```

Benefits:

- Improved robustness
- Better generalization
- Reduced variance
- Higher detection accuracy

---

# Training Methodology

## Stage 1 – Baseline Training

Both models are trained independently.

### Hyperparameters

| Parameter | Value |
|------------|------------|
| Optimizer | Adam |
| Learning Rate | 1e-4 |
| Batch Size | 24 |
| Input Size | 299×299 |
| Loss Function | Binary Cross Entropy |

---

## Stage 2 – Hard Negative Mining

High-quality deepfakes frequently bypass baseline detectors.

To address this:

1. Train baseline model
2. Evaluate validation set
3. Identify misclassified fake samples
4. Extract difficult examples
5. Add hard negatives to training data
6. Fine-tune models

Benefits:

- Stronger decision boundaries
- Improved robustness
- Better detection of challenging manipulations

---

# Test-Time Augmentation (TTA)

During inference, each face is evaluated twice:

1. Original image
2. Horizontally flipped image

The predictions are averaged.

Benefits:

- Reduced prediction variance
- Improved stability
- Better generalization

---

# Inference Pipeline

When a user uploads a video:

1. Video is decoded using OpenCV.
2. Frames are extracted.
3. Every 5th frame is sampled.
4. MTCNN detects faces.
5. Faces are cropped.
6. Preprocessing is applied.
7. Test-Time Augmentation is performed.
8. XceptionNet generates predictions.
9. EfficientNet generates predictions.
10. Ensemble fusion combines outputs.
11. Video-level statistics are computed.
12. Temporal aggregation is applied.
13. Grad-CAM heatmaps are generated.
14. Final verdict is returned.

---

# Temporal Aggregation

Frame-level predictions can fluctuate due to noise.

DeepGuard performs video-level reasoning using:

### Fake Frame Ratio

Percentage of analyzed frames predicted as fake.

### Longest Fake Streak

Maximum consecutive sequence of fake predictions.

Decision is based on both metrics.

Advantages:

- Improved stability
- Reduced false alarms
- Lightweight alternative to RNNs and 3D CNNs

---

# Explainable AI

DeepGuard integrates Grad-CAM to improve transparency.

Grad-CAM highlights regions contributing most strongly to predictions.

Examples:

- Eyes
- Mouth
- Facial boundaries
- Blending regions

Benefits:

- Transparency
- User trust
- Forensic evidence generation
- Explainable predictions

---

# Experimental Results

| Metric | Value |
|----------|----------|
| Accuracy | 96.25% |
| Precision | 94.8% |
| F1 Score | 0.96 |
| AUC-ROC | 0.99 |

---

# Ablation Study

| Model | Accuracy |
|----------|----------|
| EfficientNet-B0 | 93.2% |
| XceptionNet | 94.8% |
| DeepGuard Ensemble | 96.25% |

Observation:

The ensemble consistently outperforms both individual architectures.

---

# Engineering Challenges

## CUDA Memory Constraints

Problem:

RTX 4050 limited to 6 GB VRAM.

Solution:

Automatic Mixed Precision Training.

---

## Data Leakage

Problem:

Random frame splitting caused unrealistic validation performance.

Solution:

Video-level dataset splitting.

---

## Face Cropping Blind Spots

Problem:

Small crops hid manipulation boundaries.

Solution:

Margin increased to 80 pixels.

---

## High-Quality Deepfakes

Problem:

Certain manipulations bypassed baseline detectors.

Solution:

Hard Negative Mining.

---

# Lessons Learned

- Data quality is more important than model complexity.
- Preventing data leakage is critical.
- Explainability increases trust in AI systems.
- Ensemble learning improves robustness.
- Hard negative mining significantly improves difficult-case performance.
- Real-world deployment requires balancing accuracy and efficiency.

---

# Project Structure

```text
DeepfakeDetector/

├── backend/
│   └── main.py

├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts

├── models/
│   ├── deepfake_detector_xception.pth
│   └── deepfake_detector_efficientnet.pth

├── utils/
│   ├── face_extractor.py
│   ├── inference.py
│   ├── model_utils.py
│   ├── preprocess.py
│   └── visualize.py

├── train.py
├── train_efficientnet.py
├── finetune.py
├── prepare_finetune.py
├── split_data_correctly.py
└── requirements.txt
```

---

# Running the Project

## Backend

```bash
python -m uvicorn backend.main:app --reload
```

Server:

```text
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:8080
```

---

# Current Limitations

- Dependent on successful face detection
- Audio deepfakes are not analyzed
- Adversarial attacks are not explicitly handled
- Performance evaluated primarily on DFDC
- Does not analyze non-facial manipulations

---

# Future Work

- Audio-Visual Deepfake Detection
- Vision Transformers (ViT)
- Frequency Domain Analysis
- Adversarial Robustness
- Cross-Dataset Evaluation
- Cloud Deployment
- Real-Time Streaming Detection

---

# License

This project was developed for academic research, experimentation, and educational purposes.

---

# Citation

If you use DeepGuard AI in academic work, please cite:

DeepGuard: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection.

ICCET 2026.