import streamlit as st
import tempfile
from PIL import Image
from utils.inference import predict_frame_tta, predict_video

st.set_page_config(page_title="Deepfake Detector", page_icon="🕵️‍♂️", layout="centered")

st.markdown("""
    <style>
    .success-box { border: 2px solid #28a745; padding: 15px; border-radius: 10px; background-color: #d4edda; color: #155724; }
    .warning-box { border: 2px solid #dc3545; padding: 15px; border-radius: 10px; background-color: #f8d7da; color: #721c24; }
    </style>
""", unsafe_allow_html=True)

st.title("🕵️‍♂️ Deepfake Detection System")
st.info("Upload media to detect manipulation artifacts.")

uploaded_file = st.file_uploader("Choose a file...", type=["jpg", "jpeg", "png", "mp4", "avi", "mov"])

if uploaded_file:
    file_type = uploaded_file.name.split('.')[-1].lower()
    
    if file_type in ['jpg', 'jpeg', 'png']:
        st.subheader("📸 Image Analysis")
        image = Image.open(uploaded_file).convert('RGB')
        st.image(image, caption="Uploaded Image", use_container_width=True)
        
        with st.spinner("Analyzing..."):
            label, confidence = predict_frame_tta(image)
        
        st.metric("Prediction", label, f"{confidence:.2f}%")
        if label == "FAKE":
            st.markdown(f'<div class="warning-box">⚠️ FAKE DETECTED</div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="success-box">✅ REAL FACE</div>', unsafe_allow_html=True)

    elif file_type in ['mp4', 'avi', 'mov']:
        st.subheader("🎥 Video Analysis")
        tfile = tempfile.NamedTemporaryFile(delete=False) 
        tfile.write(uploaded_file.read())
        st.video(tfile.name)
        
        if st.button("Analyze Video"):
            progress = st.progress(0)
            with st.spinner("Generating heatmaps (1 per second)..."):
                label, details = predict_video(tfile.name)
            progress.progress(100)
            
            # 1. Verdict
            st.divider()
            c1, c2, c3 = st.columns(3)
            c1.metric("Verdict", label)
            c2.metric("Fake Ratio", details['fake_ratio'])
            c3.metric("Max Streak", f"{details['max_consecutive_fakes']} frames")
            
            if label == "FAKE":
                st.error("🚨 DEEPFAKE DETECTED")
                
                # 2. Evidence Gallery (10 Frames)
                if details.get('evidence'):
                    st.write("### 🔍 Forensic Evidence (Second-by-Second)")
                    
                    # Split into rows of 5
                    evidence = details['evidence']
                    
                    # First Row (0-4s)
                    cols1 = st.columns(5)
                    for idx, item in enumerate(evidence[:5]):
                        with cols1[idx]:
                            st.image(item['frame'], caption=f"{item['time']} ({item['conf']:.0f}%)", use_container_width=True)
                    
                    # Second Row (5-9s)
                    if len(evidence) > 5:
                        cols2 = st.columns(5)
                        for idx, item in enumerate(evidence[5:]):
                            with cols2[idx]:
                                st.image(item['frame'], caption=f"{item['time']} ({item['conf']:.0f}%)", use_container_width=True)
            else:
                st.success("✅ REAL VIDEO")