<h1 align="center">🛡️ DeepGuard AI</h1>

<p align="center">
  <b>A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection</b><br/>
  <i>XceptionNet · EfficientNet-B0 · Grad-CAM · FastAPI · React</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Accuracy-96.25%25-brightgreen?style=for-the-badge" alt="Accuracy"/>
  <img src="https://img.shields.io/badge/AUC--ROC-0.99-blue?style=for-the-badge" alt="AUC-ROC"/>
  <img src="https://img.shields.io/badge/F1_Score-0.96-orange?style=for-the-badge" alt="F1 Score"/>
  <img src="https://img.shields.io/badge/Published-IEEE_ICCET_2026-red?style=for-the-badge&logo=ieee" alt="IEEE"/>
</p>

<p align="center">
  📄 <a href="https://ieeexplore.ieee.org/document/11581015"><b>Read the Published Paper → IEEE Xplore</b></a>
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Results](#-key-results)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Dataset & Data Pipeline](#-dataset--data-pipeline)
- [Model Architecture](#-model-architecture)
- [Training Methodology](#-training-methodology)
- [Inference Pipeline](#-inference-pipeline)
- [Explainability](#-explainability-grad-cam)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Limitations & Future Work](#-limitations--future-work)
- [Authors](#-authors)
- [Citation](#-citation)

---

## 🔍 About

DeepGuard AI is a **full-stack deepfake detection framework** that identifies manipulated facial images and videos using an ensemble of deep learning models. It detects a wide range of deepfake artifacts:

| Artifact Type | Description |
|---|---|
| Facial blending seams | Visible boundaries from face-swapping |
| Boundary distortions | Warping and geometric inconsistencies |
| Texture anomalies | Skin tone and high-frequency irregularities |
| Compression artifacts | Manipulation traces introduced during re-encoding |

> **Goal:** Achieve high detection accuracy while remaining deployable on **consumer-grade hardware** (no expensive cloud GPUs required).

---

## 📊 Key Results

| Metric | Value |
|---|---|
| **Accuracy** | **96.25%** |
| Precision | 94.8% |
| F1 Score | 0.96 |
| AUC-ROC | **0.99** |

### Ablation Study

| Configuration | Accuracy |
|---|---|
| EfficientNet-B0 alone | 93.2% |
| XceptionNet alone | 94.8% |
| **DeepGuard Ensemble** | **96.25%** ✅ |

> The ensemble consistently outperforms both individual architectures.

---

## 🏗️ System Architecture

```
Video / Image Input
        │
        ▼
  Frame Extraction  ──────────────────────────────────────────┐
        │                                                      │
        ▼                                               [Up to 60 frames
  MTCNN Face Detection                                   sampled evenly]
        │                                                      │
        ▼                                                      │
  Context-Aware Face Crop (margin = 80px)  ◄──────────────────┘
        │
        ▼
  Preprocessing  →  Resize 299×299  →  Normalize [-1, 1]
        │
        ▼
  Test-Time Augmentation (original + horizontal flip)
        │
        ├────────────────────┬──────────────────────┐
        ▼                    ▼                      │
  ┌─────────────┐    ┌──────────────────┐           │
  │ XceptionNet │    │ EfficientNet-B0  │           │
  │  (Spatial)  │    │   (Texture)      │           │
  └──────┬──────┘    └────────┬─────────┘           │
         │                   │                      │
         └─────────┬─────────┘                      │
                   ▼                                │
            Soft Voting Ensemble                    │
            P = (Pxception + Peff) / 2             │
                   │                                │
                   ▼                                │
            Video Statistics                        │
           (Fake Ratio · Streak)                    │
                   │                                │
                   ▼                                │
          Temporal Aggregation                      │
                   │                                │
                   ▼                                │
             Grad-CAM Heatmap  ◄────────────────────┘
                   │
                   ▼
            ✅ Final Verdict
```

---

## 🛠️ Technology Stack

| Layer | Tools |
|---|---|
| **Deep Learning** | PyTorch, CUDA, cuDNN, AMP |
| **Computer Vision** | OpenCV, MTCNN, facenet-pytorch, Pillow, NumPy |
| **Backend** | FastAPI, Uvicorn, Python |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Explainability** | Grad-CAM |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## 📦 Dataset & Data Pipeline

**Dataset:** [DeepFake Detection Challenge (DFDC)](https://ai.facebook.com/datasets/dfdc/)

The DFDC dataset contains thousands of real and manipulated videos including face-swapped, reenacted, and compressed internet-quality content.

### Pipeline Overview

```
Stage 1 ── Video Collection       (Real + Fake from DFDC)
   │
Stage 2 ── Face Extraction        (MTCNN, margin=80px)
   │
Stage 3 ── Video-Level Splitting  (prevents data leakage)
   │
Stage 4 ── Data Augmentation      (noise, jitter, flip, grayscale)
```

> ⚠️ **Why video-level splitting?** Random frame-level splits allow frames from the same video to appear in both training and validation sets, causing artificially inflated metrics. DeepGuard always keeps all frames from a single video in the same partition.

---

## 🧠 Model Architecture

### XceptionNet — *Spatial Artifact Detector*
- Uses **depthwise separable convolutions** for efficient feature extraction
- Best at detecting: face seams, blending boundaries, warping distortions

### EfficientNet-B0 — *Texture Artifact Detector*
- Lightweight architecture with a high accuracy-to-parameter ratio
- Best at detecting: skin texture anomalies, compression artifacts, high-frequency distortions

### Why Ensemble?

No single model captures all manipulation patterns. DeepGuard combines both via **Soft Voting**:

$$P_{final} = \frac{P_{Xception} + P_{EfficientNet}}{2}$$

This improves robustness, reduces variance, and raises detection accuracy.

---

## 🏋️ Training Methodology

### Stage 1 — Baseline Training

| Hyperparameter | Value |
|---|---|
| Optimizer | Adam |
| Learning Rate | 1e-4 |
| Batch Size | 24 |
| Input Size | 299 × 299 |
| Loss Function | Binary Cross-Entropy |

### Stage 2 — Hard Negative Mining

High-quality deepfakes often bypass baseline detectors. The solution:

1. Train baseline model
2. Evaluate on validation set
3. Identify misclassified fake samples
4. Add these **hard negatives** back to training data
5. Fine-tune both models

This significantly hardens decision boundaries against challenging manipulations.

### Test-Time Augmentation (TTA)

Each face is evaluated **twice** — once original, once horizontally flipped — and predictions are averaged. This reduces variance and improves stability.

---

## 🔬 Inference Pipeline

When a user uploads a file, the following stages execute in order:

| Step | Action |
|---|---|
| 1 | Decode video with OpenCV |
| 2 | Sample every 5th frame (max 60 frames) |
| 3 | Detect faces using MTCNN |
| 4 | Crop faces with 80px margin |
| 5 | Preprocess → resize, normalize |
| 6 | Apply Test-Time Augmentation |
| 7 | XceptionNet inference |
| 8 | EfficientNet-B0 inference |
| 9 | Soft-voting ensemble fusion |
| 10 | Compute fake ratio & longest fake streak |
| 11 | Temporal aggregation decision |
| 12 | Generate Grad-CAM heatmap |
| 13 | Return final verdict |

### Temporal Aggregation

Frame-level predictions can fluctuate due to noise. DeepGuard reasons at the **video level** using:

- **Fake Frame Ratio** — percentage of frames predicted as fake
- **Longest Fake Streak** — maximum consecutive fake predictions

This provides stability without the cost of RNNs or 3D CNNs.

---

## 🔍 Explainability: Grad-CAM

DeepGuard integrates **Gradient-weighted Class Activation Mapping (Grad-CAM)** to show *why* a prediction was made.

Highlighted regions typically include:
- 👁️ Eyes
- 👄 Mouth
- 🧑 Facial boundaries and blending regions

This builds user trust and generates forensic evidence for each prediction.

---

## 📂 Project Structure

```
DeepFakeDetector/
│
├── backend/
│   └── main.py               # FastAPI app with streaming progress endpoint
│
├── utils/
│   ├── face_detector.py      # Hybrid MTCNN face detection
│   ├── inference.py          # Dual-CNN ensemble + Grad-CAM
│   ├── model_utils.py        # Model loading helpers
│   └── preprocess.py         # Image preprocessing transforms
│
├── website/verify-deepfake/  # React + TypeScript frontend
│   └── src/
│       ├── components/       # UI components (FileUpload, Navigation, etc.)
│       ├── pages/            # Page views
│       └── lib/api.ts        # Backend communication + fallback logic
│
├── models/
│   ├── deepfake_detector_xception.pth
│   └── deepfake_detector_efficientnet.pth
│
├── train.py
├── train_efficientnet.py
├── finetune.py
├── render.yaml               # Render cloud deployment config
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- CUDA-compatible GPU (optional, CPU fallback available)

### 1. Clone the Repository

```bash
git clone https://github.com/Adeptaadi/DeepGuard.git
cd DeepGuard
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Backend

```bash
python -m uvicorn backend.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

### 4. Start the Frontend

```bash
cd website/verify-deepfake
npm install
npm run dev
```

Frontend runs at: `http://localhost:8080`

> 💡 The frontend automatically falls back to `http://127.0.0.1:8000` if the cloud backend is unavailable.

---

## ⚠️ Limitations & Future Work

### Current Limitations

- Requires successful face detection to function
- Audio deepfakes are not analyzed
- Adversarial attacks are not explicitly handled
- Primarily evaluated on the DFDC dataset
- Non-facial manipulations are not detected

### Future Directions

| Area | Description |
|---|---|
| Audio-Visual Detection | Fuse audio and visual streams |
| Vision Transformers | Experiment with ViT-based architectures |
| Frequency Domain | DCT/FFT-based artifact analysis |
| Adversarial Robustness | Harden against adversarial perturbations |
| Cross-Dataset Evaluation | Test generalization on FaceForensics++, Celeb-DF |
| Real-Time Streaming | Live video stream deepfake detection |

---

## 👥 Authors

| Name | Institution |
|---|---|
| Aditya Rana | Dept. of Computer Science & Engineering, VIT Pune |
| Nitish Sahu | Dept. of Computer Science & Engineering, VIT Pune |
| Manthan Sali | Dept. of Computer Science & Engineering, VIT Pune |
| Palash Sahuji | Dept. of Computer Science & Engineering, VIT Pune |

---

## 📖 Citation

If you use DeepGuard AI in your research, please cite:

```bibtex
@inproceedings{deepguard2026,
  title     = {DeepGuard: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection},
  author    = {Rana, Aditya and Sahu, Nitish and Sali, Manthan and Sahuji, Palash},
  booktitle = {Proceedings of the International Conference on Computer Engineering and Technology (ICCET)},
  year      = {2026},
  url       = {https://ieeexplore.ieee.org/document/11581015}
}
```

📄 **Published Paper:** [https://ieeexplore.ieee.org/document/11581015](https://ieeexplore.ieee.org/document/11581015)

---

## 📜 License

This project was developed for academic research, experimentation, and educational purposes.

---

<p align="center">Made with ❤️ at <b>Vishwakarma Institute of Technology, Pune</b></p>