# DeepGuard AI — Complete 3-Minute PowerPoint Presentation Content

> **Total Duration:** Exactly 3 Minutes (180 Seconds | ~400–430 spoken words at 135–140 words/min)  
> **Presentation Title:** DeepGuard AI: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection  
> **Presenters:** Aditya Rana, Nitish Sahu, Manthan Sali, Palash Sahuji  
> **Affiliation:** Department of Computer Science and Engineering, Vishwakarma Institute of Technology (VIT), Pune

---

## ⏱️ 3-Minute Timing Breakdown

| Slide | Title | Duration | Timecode |
| :---: | :--- | :---: | :---: |
| **Slide 1** | Project Identity & Authors | 15s | `0:00 – 0:15` |
| **Slide 2** | Problem Statement & Threat Landscape | 25s | `0:15 – 0:40` |
| **Slide 3** | Proposed Methodology: Dual-CNN & 80px MTCNN | 30s | `0:40 – 1:10` |
| **Slide 4** | End-to-End System Architecture & Stack | 25s | `1:10 – 1:35` |
| **Slide 5** | Engineering Challenges & Solutions | 30s | `1:35 – 2:05` |
| **Slide 6** | Empirical Benchmarks & Ablation Study | 25s | `2:05 – 2:30` |
| **Slide 7** | Explainable AI (Grad-CAM) & Live Dashboard | 20s | `2:30 – 2:50` |
| **Slide 8** | Applications & Conclusion | 10s | `2:50 – 3:00` |

---

## 🖥️ Slide-by-Slide Content & Spoken Scripts

---

### Slide 1: Title & Project Identity
* **Timecode:** `0:00 – 0:15` (15 Seconds | ~35 words)
* **Visual Layout:** Dark cyber-theme background, glowing DeepGuard shield logo, clear author badges.

#### 📝 On-Screen Slide Content:
```text
DEEPGUARD AI
A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection

Authors:
• Aditya Rana  |  Nitish Sahu  |  Manthan Sali  |  Palash Sahuji

Department of Computer Science and Engineering
Vishwakarma Institute of Technology (VIT), Pune
Conference: ICCET 2026
```

#### 🎙️ Word-for-Word Speaker Script (15s):
> *"Good day everyone. Today we present **DeepGuard AI**—a lightweight, explainable, and production-ready deepfake video detection framework that unites spatial and texture convolutional neural networks for high-accuracy forensic media authentication."*

---

### Slide 2: Problem Statement & Motivation
* **Timecode:** `0:15 – 0:40` (25 Seconds | ~60 words)
* **Visual Layout:** Split-screen layout: Threat impact pillars on the left; Real vs. Face-swapped comparison on the right.

#### 📝 On-Screen Slide Content:
```text
The Proliferation of Synthetic Media:
• Generative Threat: Advancements in GANs, Autoencoders (DeepFaceLab), and Diffusion Models.
• Real-World Impact:
  - Identity Fraud & Social Engineering
  - Disinformation campaigns & Election Interference
  - Biometric authentication & Video KYC spoofing
• Core Detection Bottlenecks:
  - Aggressive internet compression obscuring visual traces.
  - High computational costs of 3D-CNNs and Vision Transformers.
  - Data leakage causing artificially inflated benchmark results.
```

#### 🎙️ Word-for-Word Speaker Script (25s):
> *"Hyper-realistic deepfakes are increasingly exploited for identity theft, financial fraud, and political disinformation. Conventional detection systems face severe hurdles: heavy internet compression destroys subtle facial cues, while state-of-the-art 3D networks require expensive server GPUs. DeepGuard was engineered to bridge this gap by delivering enterprise-grade accuracy directly on consumer hardware."*

---

### Slide 3: Proposed Methodology & Dual-CNN Fusion
* **Timecode:** `0:40 – 1:10` (30 Seconds | ~75 words)
* **Visual Layout:** Diagram comparing XceptionNet and EfficientNet-B0 branches fusing into soft-voting, with an 80px MTCNN crop illustration.
* **Image to insert:** Architecture Diagram / Margin Comparison.

#### 📝 On-Screen Slide Content:
```text
Dual-Stream Complementary Detection:

1. Context-Aware Face Extraction (MTCNN):
   • Expanded 80-pixel margin retains chin, forehead, ears, and blending seams.

2. Dual-CNN Inductive Biases:
   • XceptionNet (Spatial Stream):
     - Depthwise separable convolutions expose boundary warping & face-swap seams.
   • EfficientNet-B0 (Texture Stream):
     - Compound scaling captures micro-texture anomalies & compression noise patterns.

3. Soft-Voting Probability Fusion:
   • P_final = (P_spatial + P_texture) / 2
   • Eliminates individual model blind spots.
```

#### 🎙️ Word-for-Word Speaker Script (30s):
> *"Our methodology addresses manipulation across both spatial and frequency domains. We first extract faces using MTCNN with an expanded **80-pixel margin**, preserving the critical perimeter where face-swaps are pasted. Then, **XceptionNet** evaluates spatial boundary seams, while **EfficientNet-B0** inspects micro-texture irregularities and compression noise. Soft-voting fusion averages both probabilities, preventing false alarms and drastically improving generalization."*

---

### Slide 4: System Architecture & Technical Stack
* **Timecode:** `1:10 – 1:35` (25 Seconds | ~60 words)
* **Visual Layout:** 3-Column Architecture Matrix (PyTorch Engine $\rightarrow$ FastAPI Backend $\rightarrow$ React UI).
* **Image to insert:** [`Table1_Hyperparameters.png`](file:///C:/Users/Aaditya%20Rana/OneDrive/Desktop/SEM3/EDAI_SEM_3/DeepFakeDetector/Table1_Hyperparameters.png)

#### 📝 On-Screen Slide Content:
```text
Full-Stack Architecture & Implementation:

• Deep Learning Core (PyTorch 2.5 + CUDA 12.1):
  - Automatic Mixed Precision (AMP) 16-bit execution
  - Strong Augmentations: Gaussian Noise, Color Jitter, Random Rotation
  - Hardware: Optimized for NVIDIA RTX 4050 (6GB VRAM)

• Backend Engine (FastAPI & Uvicorn):
  - Async /analyze REST endpoint for video frame streams
  - Base64 Grad-CAM thermal heatmap generation

• Forensic Frontend (React + Vite + TypeScript + Tailwind):
  - Interactive drag-and-drop scanner dropzone
  - Second-by-second forensic evidence lightbox
```

#### 🎙️ Word-for-Word Speaker Script (25s):
> *"DeepGuard is architectured as an end-to-end full-stack system. The AI engine is built in PyTorch using Automatic Mixed Precision, fitting complete training and inference into a 6GB laptop GPU. It is served through an asynchronous FastAPI REST backend and connected to a modern React forensic dashboard for real-time video inspection."*

---

### Slide 5: Key Engineering Challenges & Solutions
* **Timecode:** `1:35 – 2:05` (30 Seconds | ~75 words)
* **Visual Layout:** 4-Box Challenge $\rightarrow$ Solution Matrix.
* **Image to insert:** [`Fig4_Training_Curves.png`](file:///C:/Users/Aaditya%20Rana/OneDrive/Desktop/SEM3/EDAI_SEM_3/DeepFakeDetector/Fig4_Training_Curves.png)

#### 📝 On-Screen Slide Content:
```text
Engineering Rigor & Breakthroughs:

1. Zero Data Leakage:
   • Challenge: Frame-level splitting inflates validation accuracy.
   • Solution: Strict Subject-Level and Video-Level dataset partitioning.

2. Hardware Optimization:
   • Challenge: Memory crashes on consumer 6GB VRAM GPUs.
   • Solution: Mixed-precision gradient scaling (AMP) + cuDNN deterministic mode.

3. Hard Negative Mining:
   • Challenge: High-quality deepfakes bypassing baseline detectors.
   • Solution: Dense extraction loop (every 3rd frame) to retrain weak decision boundaries.

4. Video Prediction Stability:
   • Challenge: Fluctuating single-frame predictions.
   • Solution: Lightweight Temporal Aggregation (Streak count + 30% Fake Ratio threshold).
```

#### 🎙️ Word-for-Word Speaker Script (30s):
> *"We resolved four major engineering hurdles: First, we eliminated **data leakage** through strict subject-level and video-level dataset partitioning. Second, we solved GPU memory constraints using mixed-precision scaling. Third, we implemented a **Hard Negative Mining** loop to retrain challenging misclassified samples. And fourth, we introduced **Temporal Streak Aggregation**, ensuring smooth, reliable video-level decisions without expensive 3D convolutions."*

---

### Slide 6: Experimental Benchmarks & Ablation Study
* **Timecode:** `2:05 – 2:30` (25 Seconds | ~60 words)
* **Visual Layout:** Side-by-side: Ablation Table + ROC Curve Plot.
* **Images to insert:** [`Table2_Ablation_Study.png`](file:///C:/Users/Aaditya%20Rana/OneDrive/Desktop/SEM3/EDAI_SEM_3/DeepFakeDetector/Table2_Ablation_Study.png) & [`Fig2_ROC_Curve.png`](file:///C:/Users/Aaditya%20Rana/OneDrive/Desktop/SEM3/EDAI_SEM_3/DeepFakeDetector/Fig2_ROC_Curve.png)

#### 📝 On-Screen Slide Content:
```text
Benchmark Results (DFDC Dataset):

| Model Architecture | Accuracy | AUC-ROC | Precision | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| EfficientNet-B0 (Texture) | 93.20% | 0.92 | 91.5% | 0.91 |
| XceptionNet (Spatial) | 94.80% | 0.94 | 93.1% | 0.93 |
| DeepGuard Ensemble (Ours) | 96.25% | 0.99 | 94.8% | 0.96 |

Key Insights:
• Ensemble achieves +1.45% accuracy gain over standalone XceptionNet.
• AUC-ROC of 0.99 demonstrates near-perfect discrimination between real and manipulated media.
• Rapid inference: ~18ms latency per frame (~55 FPS).
```

#### 🎙️ Word-for-Word Speaker Script (25s):
> *"Evaluated on the DeepFake Detection Challenge benchmark, our ablation study confirms that the Dual-CNN ensemble outperforms both standalone models, achieving **96.25% accuracy**, an **AUC-ROC of 0.99**, and an F1 score of 0.96. The system achieves an ultra-low inference latency of just 18 milliseconds per frame."*

---

### Slide 7: Explainable AI (Grad-CAM) & Live Dashboard
* **Timecode:** `2:30 – 2:50` (20 Seconds | ~50 words)
* **Visual Layout:** Grad-CAM heatmap visualization over face crop + Web UI Screenshot showing the verdict and evidence gallery.
* **Image to insert:** [`prediction_heatmap.jpg`](file:///C:/Users/Aaditya%20Rana/OneDrive/Desktop/SEM3/EDAI_SEM_3/DeepFakeDetector/prediction_heatmap.jpg)

#### 📝 On-Screen Slide Content:
```text
Explainability & Forensic Transparency:

• Grad-CAM Gradient Mapping:
  - Hooks registered on penultimate convolutional layers.
  - Generates second-by-second thermal activation maps.
  - Red / Yellow Hotspots: Reveal exact boundary seams, abnormal reflections & warping.

• Live Web Dashboard Features:
  - Drag-and-drop instant video scanner
  - Interactive Grad-CAM evidence lightbox modal
  - Exportable forensic verification report
```

#### 🎙️ Word-for-Word Speaker Script (20s):
> *"Digital forensics demands explainability. DeepGuard incorporates **Grad-CAM** to generate thermal heatmaps showing investigators exactly where manipulation was detected—such as seam blending or unnatural eye reflections. All evidence is interactively inspectable in our live web dashboard with one-click exportable reporting."*

---

### Slide 8: Applications & Conclusion
* **Timecode:** `2:50 – 3:00` (10 Seconds | ~25 words)
* **Visual Layout:** Three application pillars (Social Media, Forensics, Fintech) + Citation footer.

#### 📝 On-Screen Slide Content:
```text
Major Applications:
🛡️ Social Media Platforms — Automated synthetic misinformation & fake news moderation.
⚖️ Law Enforcement & Legal — Court-admissible forensic video verification.
🏦 Fintech & Banking — Anti-spoofing for video KYC & facial authentication.

Conclusion:
DeepGuard AI delivers an accurate (96.25%), lightweight, and explainable defense for the synthetic media era.

Paper: "DeepGuard: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection" (ICCET 2026)
```

#### 🎙️ Word-for-Word Speaker Script (10s):
> *"DeepGuard AI delivers a fast, explainable, and practical defense against generative deepfakes across social media, forensics, and biometric security. Thank you, and we welcome your questions!"*
