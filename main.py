"""
DeepGuard AI - Unified Command Line Interface
==============================================
A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection.
Published at IEEE ICCET 2026.
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path


def run_predict(file_path: str):
    from PIL import Image
    from utils.inference import predict_frame_tta, predict_video
    
    target = Path(file_path)
    if not target.exists():
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)

    ext = target.suffix.lower()
    print("=" * 60)
    print("🛡️  DeepGuard AI - Forensic Media Analysis")
    print(f"Target: {target.name}")
    print("=" * 60)

    if ext in [".jpg", ".jpeg", ".png", ".webp"]:
        img = Image.open(target).convert("RGB")
        label, conf = predict_frame_tta(img)
        print(f"\n📢 Verdict:    {label}")
        print(f"📊 Confidence: {conf:.2f}%")
    elif ext in [".mp4", ".avi", ".mov", ".mkv", ".webm"]:
        print("[*] Running full video pipeline (Dual-CNN Ensemble + Temporal Aggregation)...")
        label, details = predict_video(str(target))
        print(f"\n📢 Verdict:         {label}")
        print(f"📊 Fake Ratio:      {details.get('fake_ratio', 'N/A')}")
        print(f"🔥 Max Streak:      {details.get('max_consecutive_fakes', 0)} consecutive frames")
        if details.get("evidence"):
            print(f"🔍 Forensic Frames: {len(details['evidence'])} key frames analyzed")
    else:
        print(f"❌ Unsupported format: {ext}. Supported: mp4, avi, mov, mkv, webm, jpg, jpeg, png, webp")


def run_server(host: str = "127.0.0.1", port: int = 8000, reload: bool = True):
    print(f"🚀 Starting DeepGuard FastAPI backend at http://{host}:{port} ...")
    import uvicorn
    uvicorn.run("backend.main:app", host=host, port=port, reload=reload)


def run_demo():
    print("✨ Launching Streamlit Interactive Web Demo...")
    subprocess.run([sys.executable, "-m", "streamlit", "run", "app.py"])


def main():
    parser = argparse.ArgumentParser(
        description="DeepGuard AI - Dual-CNN Deepfake Detection Framework",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py --predict "sample.mp4"
  python main.py --server --port 8000
  python main.py --demo
        """
    )
    
    parser.add_argument("--predict", "-p", type=str, metavar="FILE", help="Run inference on an image or video file")
    parser.add_argument("--server", "-s", action="store_true", help="Start the FastAPI backend service")
    parser.add_argument("--demo", "-d", action="store_true", help="Launch the local Streamlit web application")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Server host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Server port (default: 8000)")
    
    args = parser.parse_args()

    if args.predict:
        run_predict(args.predict)
    elif args.server:
        run_server(host=args.host, port=args.port)
    elif args.demo:
        run_demo()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
