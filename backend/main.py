import sys
import os
import shutil
import time
import base64
from io import BytesIO
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

try:
    from utils.inference import predict_video
except ImportError as e:
    raise e

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def image_to_base64(pil_image):
    """Converts a PIL image to a base64 string for the frontend"""
    buffered = BytesIO()
    # Convert to RGB to ensure compatibility
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    pil_image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

@app.post("/analyze")
async def analyze_video_endpoint(file: UploadFile = File(...)):
    start_time = time.time()
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Run AI
        label, details = predict_video(temp_filename)
        
        # Calculate Metrics
        end_time = time.time()
        processing_time = round(end_time - start_time, 2)
        fake_ratio_val = float(details['fake_ratio'].replace('%', ''))
        confidence = 100.0 - fake_ratio_val if label == "REAL" else fake_ratio_val

        # Process Evidence Images (Heatmaps) for Frontend
        evidence_base64 = []
        if 'evidence' in details:
            for item in details['evidence']:
                # item['frame'] is a PIL Image (the heatmap)
                # item['time'] is the timestamp string
                # item['conf'] is the confidence float
                evidence_base64.append({
                    "image": image_to_base64(item['frame']),
                    "timestamp": item['time'],
                    "confidence": item['conf']
                })

        return {
            "isReal": (label == "REAL"),
            "confidence": round(confidence,1),
            "processingTime": processing_time,
            "fileName": file.filename,
            "details": {
            "faceDetection": 95,
            "temporalConsistency": int(details.get("temporal_consistency", 92)),
            "artifactDetection": int(fake_ratio_val),
            "blinkAnalysis": 0
            },
            "evidence": evidence_base64 # <--- Sending the images here
        }

    except Exception as e:
        print(f"❌ API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)