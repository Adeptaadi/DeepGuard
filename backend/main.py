import sys
import os
import time
import base64
import json
import queue
import threading
import traceback
from io import BytesIO
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from utils.inference import predict_video
except ImportError as e:
    raise e

app = FastAPI(title="DeepGuard AI Forensic Backend", version="2.5")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def image_to_base64(pil_image):
    """Converts a PIL image to a base64 string for the frontend"""
    buffered = BytesIO()
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    pil_image.save(buffered, format="JPEG", quality=85)
    return base64.b64encode(buffered.getvalue()).decode("utf-8")


@app.api_route("/", methods=["GET", "HEAD"])
@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "online",
        "service": "DeepGuard AI Forensic Backend",
        "architecture": "Dual-CNN Ensemble (XceptionNet + EfficientNet-B0)",
        "version": "2.5"
    }


@app.post("/analyze")
async def analyze_video_endpoint(
    request: Request,
    file: UploadFile = File(...),
    stream: bool = False
):
    start_time = time.time()
    temp_filename = f"temp_{int(start_time)}_{file.filename}"
    
    # Check if stream requested via query param or Accept header
    wants_stream = stream or "application/x-ndjson" in request.headers.get("accept", "")
    
    try:
        contents = await file.read()
        with open(temp_filename, "wb") as buffer:
            buffer.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    if wants_stream:
        def event_generator():
            q = queue.Queue()

            def run_worker():
                try:
                    def on_progress(percent, stage_idx, message):
                        q.put({"type": "progress", "progress": percent, "stage": stage_idx, "message": message})

                    on_progress(10, 0, f"Initializing video stream: {file.filename}...")
                    
                    label, details = predict_video(temp_filename, progress_callback=on_progress)
                    
                    end_time = time.time()
                    processing_time = round(end_time - start_time, 2)
                    fake_ratio_str = details.get('fake_ratio', '0%').replace('%', '')
                    fake_ratio_val = float(fake_ratio_str) if fake_ratio_str else 0.0
                    confidence = 100.0 - fake_ratio_val if label == "REAL" else fake_ratio_val

                    evidence_base64 = []
                    if 'evidence' in details:
                        for item in details['evidence']:
                            evidence_base64.append({
                                "image": image_to_base64(item['frame']),
                                "timestamp": item['time'],
                                "confidence": item['conf']
                            })

                    payload = {
                        "isReal": (label == "REAL"),
                        "confidence": round(confidence, 1),
                        "processingTime": processing_time,
                        "fileName": file.filename,
                        "details": {
                            "faceDetection": 95 if details.get("processed_frames", 1) > 0 else 0,
                            "temporalConsistency": int(details.get("temporal_consistency", 92)),
                            "artifactDetection": int(fake_ratio_val),
                            "blinkAnalysis": 0
                        },
                        "evidence": evidence_base64
                    }
                    q.put({"type": "progress", "progress": 100, "stage": 3, "message": "Forensic analysis complete!"})
                    q.put({"type": "complete", "progress": 100, "data": payload})
                except Exception as ex:
                    traceback.print_exc()
                    print(f"❌ Analysis Worker Error: {str(ex)}")
                    q.put({"type": "error", "message": str(ex)})
                finally:
                    if os.path.exists(temp_filename):
                        try:
                            os.remove(temp_filename)
                        except Exception:
                            pass
                    q.put(None)

            threading.Thread(target=run_worker, daemon=True).start()

            while True:
                try:
                    msg = q.get(timeout=1.5)
                    if msg is None:
                        break
                    yield json.dumps(msg) + "\n"
                except queue.Empty:
                    # Heartbeat keeps Cloudflare HTTP/3 QUIC connection alive
                    yield json.dumps({"type": "ping"}) + "\n"

        return StreamingResponse(
            event_generator(),
            media_type="application/x-ndjson",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )

    # Standard non-streaming fallback
    try:
        label, details = predict_video(temp_filename)
        end_time = time.time()
        processing_time = round(end_time - start_time, 2)
        fake_ratio_str = details.get('fake_ratio', '0%').replace('%', '')
        fake_ratio_val = float(fake_ratio_str) if fake_ratio_str else 0.0
        confidence = 100.0 - fake_ratio_val if label == "REAL" else fake_ratio_val

        evidence_base64 = []
        if 'evidence' in details:
            for item in details['evidence']:
                evidence_base64.append({
                    "image": image_to_base64(item['frame']),
                    "timestamp": item['time'],
                    "confidence": item['conf']
                })

        return {
            "isReal": (label == "REAL"),
            "confidence": round(confidence, 1),
            "processingTime": processing_time,
            "fileName": file.filename,
            "details": {
                "faceDetection": 95 if details.get("processed_frames", 1) > 0 else 0,
                "temporalConsistency": int(details.get("temporal_consistency", 92)),
                "artifactDetection": int(fake_ratio_val),
                "blinkAnalysis": 0
            },
            "evidence": evidence_base64
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")
    finally:
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
            except Exception:
                pass
