# DeepGuard AI — PowerPoint Presentation Deck

> **Presentation Title:** DeepGuard AI: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection  
> **Authors:** Aditya Rana, Nitish Sahu, Manthan Sali, Palash Sahuji  
> **Affiliation:** Department of Computer Science & Engineering, Vishwakarma Institute of Technology (VIT), Pune  
> **Total Slides:** 8 Slides (~2.5 to 3 Minutes)

---

## 📑 Slide Deck Overview

```mermaid
flowchart LR
    S1[Slide 1: Title & Introduction] --> S2[Slide 2: Problem & Motivation]
    S2 --> S3[Slide 3: Proposed Methodology]
    S3 --> S4[Slide 4: System Architecture & Stack]
    S4 --> S5[Slide 5: Key Challenges & Solutions]
    S5 --> S6[Slide 6: Empirical Results & Ablation]
    S6 --> S7[Slide 7: Explainability & Live UI]
    S7 --> S8[Slide 8: Applications & Conclusion]
```

---

## Slide 1: Title & Project Identity

### 🎨 Visual Layout
- **Theme:** Dark navy background with cyan glowing accent lines and the DeepGuard AI shield icon.
- **Top Badge:** `Research Presentation • ICCET 2026`
- **Main Heading:** Bold high-contrast typography.

### 📝 On-Screen Content
```text
DEEPGUARD AI
A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection

Presented by:
• Aditya Rana (12340001)
• Nitish Sahu (12340002)
• Manthan Sali (12340003)
• Palash Sahuji (12340004)

Department of Computer Science and Engineering
Vishwakarma Institute of Technology (VIT), Pune
```

### 🎙️ Speaker Notes (15–20s)
> *"Good morning/afternoon everyone. Today we present DeepGuard AI—a robust, lightweight, and explainable deepfake video detection framework that combines spatial and texture convolutional neural networks for real-world deployment."*

---

## Slide 2: Problem Statement & Motivation

### 🎨 Visual Layout
- **Two-Column Split Layout:**
  - **Left:** The Problem & Threat Matrix (Identity theft, disinformation, biometric spoofing).
  - **Right:** Visual comparison box: Real face vs. GAN-generated face-swap with subtle blending flaws.

### 📝 On-Screen Content
```text
The Challenge of Synthetic Media:
• Rapid Proliferation: Advancements in GANs, Diffusion Models & Autoencoders (DeepFaceLab).
• Threats:
  - Identity Fraud & Social Engineering
  - Disinformation campaigns & Media Manipulation
  - Biometric authentication & KYC bypass
• Detection Obstacles:
  - Aggressive internet compression obscuring artifacts.
  - Generalization gap across unseen generators.
  - High computational costs of 3D-CNNs and Vision Transformers.
```

### 🎙️ Speaker Notes (20–25s)
> *"Hyper-realistic deepfakes have made visual verification nearly impossible for the human eye. While generative models are advancing rapidly, existing detection tools often suffer from high compute requirements or fail under heavy compression. DeepGuard was developed to address these gaps with high accuracy and practical efficiency."*

---

## Slide 3: Proposed Methodology & Dual-CNN Concept

### 🎨 Visual Layout
- **Center Flowchart Diagram:** Raw Video $\rightarrow$ MTCNN (80px Margin) $\rightarrow$ Dual Streams (Xception + EfficientNet) $\rightarrow$ Soft-Voting Ensemble.
- **Side-by-Side Highlight Cards:** Spatial Stream vs. Texture Stream.

### 📝 On-Screen Content
```text
Core Methodology — Complementary Dual-Stream Detection:

1. Context-Aware Face Extraction (MTCNN):
   • Expanded margin = 80px to capture chin, forehead, ears & boundary seams.

2. Dual-CNN Inductive Biases:
   • XceptionNet (Spatial Stream):
     - Uses depthwise separable convolutions to catch boundary warping & facial blending seams.
   • EfficientNet-B0 (Texture Stream):
     - Uses compound scaling to capture micro-texture frequency & compression noise anomalies.

3. Ensemble Soft-Voting Fusion:
   • Final Probability = (P_Xception + P_EfficientNet) / 2
   • Eliminates single-model blind spots.
```

### 🎙️ Speaker Notes (25–30s)
> *"Our core insight is that deepfakes exhibit two distinct types of artifacts: spatial boundary seams and frequency-level texture noise. By combining XceptionNet for spatial analysis and EfficientNet-B0 for texture analysis with an 80-pixel MTCNN crop margin, DeepGuard captures both artifact domains simultaneously."*

---

## Slide 4: System Architecture & Technical Stack

### 🎨 Visual Layout
- **Three Tier Architecture Card Layout:**
  - Column 1: Deep Learning Engine
  - Column 2: Backend API Pipeline
  - Column 3: Forensic UI Frontend

### 📝 On-Screen Content
```text
End-to-End System Architecture:

• Machine Learning Engine (PyTorch):
  - TIMM model backbones (Xception + EfficientNet-B0)
  - Automatic Mixed Precision (AMP) via torch.cuda.amp
  - Data Augmentation: Gaussian Noise, Color Jitter, Rotation

• Backend Service (FastAPI & Uvicorn):
  - Asynchronous /analyze REST endpoint
  - Dynamic frame sampling (every 5th frame)
  - Base64 Grad-CAM thermal heatmap encoding

• User Interface (React + Vite + Tailwind):
  - Modern drag-and-drop forensic dropzone
  - Second-by-second Grad-CAM evidence gallery
  - Printable / Exportable forensic verification dossier
```

### 🎙️ Speaker Notes (20–25s)
> *"Architecturally, the project is a full-stack forensic system. The core PyTorch engine runs on CUDA with Automatic Mixed Precision, served via a FastAPI REST backend. The React frontend provides investigators with real-time video analysis and an interactive evidence gallery."*

---

## Slide 5: Key Engineering Challenges & Solutions

### 🎨 Visual Layout
- **4-Grid Matrix of Challenge $\rightarrow$ Solution:** Highlighting the rigorous engineering decisions made in the project.

### 📝 On-Screen Content
```text
Engineering Challenges Solved:

1. Dataset Leakage:
   • Challenge: Frame-level splitting causes artificially inflated accuracy.
   • Solution: Strict Subject-Level (data_setup.py) and Video-Level (split_data_correctly.py) dataset partitioning.

2. Hardware & Memory Constraints:
   • Challenge: Limited 6GB VRAM on consumer laptops (RTX 4050).
   • Solution: PyTorch AMP (16-bit float) and cuDNN deterministic execution.

3. High-Quality Deepfakes:
   • Challenge: High-resolution samples bypassing baseline models.
   • Solution: Hard Negative Mining loop (prepare_finetune.py) to retrain weak boundaries.

4. Temporal Video Jitter:
   • Challenge: Fluctuating single-frame predictions.
   • Solution: Lightweight Temporal Aggregation (Fake Ratio > 30% + Consecutive Streak threshold).
```

### 🎙️ Speaker Notes (25–30s)
> *"We solved four critical engineering hurdles: We prevented data leakage through video-level grouping; enabled training on consumer GPUs using PyTorch AMP; created a Hard Negative Mining pipeline for stubborn deepfakes; and implemented lightweight temporal streak aggregation for stable video predictions."*

---

## Slide 6: Experimental Benchmarks & Ablation Study

### 🎨 Visual Layout
- **Left:** Benchmark Metrics Badges + `Table2_Ablation_Study.png` (or table).
- **Right:** Visual plots (`Fig2_ROC_Curve.png` & `Fig1_Confusion_Matrix.png`).

### 📝 On-Screen Content
```text
Evaluation on DeepFake Detection Challenge (DFDC) Dataset:

| Model Architecture | Accuracy | AUC-ROC | Precision | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| EfficientNet-B0 (Texture) | 93.20% | 0.92 | 91.5% | 0.91 |
| XceptionNet (Spatial) | 94.80% | 0.94 | 93.1% | 0.93 |
| DeepGuard Ensemble (Ours) | 96.25% | 0.99 | 94.8% | 0.96 |

Key Observations:
• Ensemble achieves a +1.45% accuracy gain over standalone XceptionNet.
• AUC-ROC of 0.99 confirms exceptional true-positive to false-positive discrimination.
• Average inference latency: ~18ms per frame on NVIDIA RTX 4050.
```

### 🎙️ Speaker Notes (20–25s)
> *"On the DFDC benchmark, our ablation study proves that the Dual-CNN ensemble outperforms both individual models, achieving 96.25% accuracy and an AUC-ROC of 0.99 with an inference latency of just 18 milliseconds per frame."*

---

## Slide 7: Explainable AI (XAI) & Live Dashboard

### 🎨 Visual Layout
- **Split Screen:**
  - **Left:** Grad-CAM Thermal Activation Map on face crop with seam highlight.
  - **Right:** Screenshot of the DeepGuard AI Web Dashboard showing the verdict and evidence gallery.

### 📝 On-Screen Content
```text
Explainable AI (Grad-CAM) & Forensic Workflow:

• Gradient-Weighted Class Activation Mapping:
  - Hooks registered on penultimate convolutional layer.
  - Generates second-by-second visual heatmaps for flagged frames.
  - Thermal Hotspots (Red/Yellow): Expose blending seams, abnormal eye reflections & warping.

• Interactive Forensic Dashboard:
  - Automated drag-and-drop video decoding
  - Verdict Billboard: Real-time confidence score & risk level
  - Evidence Lightbox: Click-to-inspect thermal maps
  - One-Click Forensic PDF / Report Export
```

### 🎙️ Speaker Notes (20–25s)
> *"Explainability is essential for digital forensics. DeepGuard integrates Grad-CAM to show investigators exactly why a video was flagged, highlighting artificial blending seams. All evidence is viewable in our interactive web dashboard."*

---

## Slide 8: Application Areas & Conclusion

### 🎨 Visual Layout
- **Three Pillar Graphic:** Social Media Platforms, Law Enforcement / Legal, Financial KYC.
- **Bottom Banner:** Publication citation and repository link.

### 📝 On-Screen Content
```text
Major Application Areas:
1. Social Media Integrity:
   - Automated screening for synthetic misinformation and fake news.
2. Legal Forensics & Law Enforcement:
   - Verifiable video authentication and chain-of-custody evidence.
3. Fintech & Biometric Security:
   - Anti-spoofing layer for video KYC and facial authentication.

Conclusion:
DeepGuard AI delivers a fast, accurate (96.25%), explainable, and consumer-hardware-friendly deepfake detection framework.

Paper: "DeepGuard: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection" (ICCET 2026)
```

### 🎙️ Speaker Notes (15–20s)
> *"In conclusion, DeepGuard AI provides a practical, explainable, and computationally efficient shield against synthetic media threats across social platforms, forensics, and biometric security. Thank you, and we welcome any questions!"*
