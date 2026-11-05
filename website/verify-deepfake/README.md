# DeepGuard AI — Web Application

> Modern, forensic-grade React interface for deepfake video and image detection.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, this application provides a web experience for analyzing media against the DeepGuard AI detection engine.

---

## ✨ Features

- **Drag-and-Drop Forensic Upload**: Supports video (`.mp4`, `.avi`, `.mov`, `.webm`, `.mkv`) and image (`.jpg`, `.jpeg`, `.png`) formats.
- **Real-Time Streaming Progress**: Monotonic live progress mapping connected to FastAPI's server-sent stream (Frame Decode ➔ Face Alignment ➔ Dual-CNN Ensemble ➔ Grad-CAM Synthesis).
- **Explainable Visual Evidence**: Frame-by-frame Grad-CAM attention heatmaps highlighting facial manipulation seams, eyes, mouth, and boundary anomalies.
- **Dual-Endpoint Resilience**: Automatically probes and streams from the production cloud backend (`https://deepguard-backend-ug4e.onrender.com`), with automatic instant fallback to local development server (`http://127.0.0.1:8000`).
- **Instant Backend Warmup**: Pings the Render backend on website launch to eliminate cold-start delay for users.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

The web application will be live at `http://localhost:8080`.

### 3. Build for Production

```bash
npm run build
```

Production assets are compiled into the `dist/` directory, optimized for deployment on Vercel, Netlify, or static hosting.

---

## ⚙️ Environment Configuration

Configure custom API endpoints by setting the environment variable in `.env`:

```env
VITE_API_URL=https://your-backend-domain.com
```

If not provided, the frontend automatically falls back to:
1. `https://deepguard-backend-ug4e.onrender.com` (Cloud Instance)
2. `http://127.0.0.1:8000` (Local Development)

---

## 🏛️ Project Architecture

```
src/
├── components/
│   ├── FileUpload.tsx         # Drag & drop upload, monotonic streaming progress
│   ├── AnalysisResults.tsx    # Forensic verdict, metric dials, Grad-CAM gallery
│   ├── Navigation.tsx         # Top bar with real-time backend connection status
│   ├── Hero.tsx               # Header hero section
│   ├── HowItWorks.tsx         # Step-by-step pipeline explainer
│   └── ui/                    # Reusable shadcn/ui primitives
├── lib/
│   ├── api.ts                 # Resilient fallback fetch & NDJSON streaming client
│   └── utils.ts               # Style and class merging utilities
├── pages/
│   ├── Index.tsx              # Main dashboard with auto-warmup trigger
│   └── NotFound.tsx           # 404 handler
├── App.tsx                    # Root application component
└── main.tsx                   # React DOM entrypoint
```
