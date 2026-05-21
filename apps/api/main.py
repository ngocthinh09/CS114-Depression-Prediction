import sys
import os
import pandas as pd
import joblib

pd.set_option('future.no_silent_downcasting', True)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import AssessmentRequest

ml_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml'))
if ml_path not in sys.path:
    sys.path.append(ml_path)

try:
    model = joblib.load(os.path.join(ml_path, 'models', 'model_xgboost.joblib'))
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading models: {e}")
    model = None

app = FastAPI(title="MindfulCheck API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "MindfulCheck API is running"}

@app.post("/predict")
def predict_depression(data: AssessmentRequest):
    if model is None:
        return {"status": "error", "message": "ML Model not loaded."}
    
    data_dict = data.model_dump(by_alias=True)
    df = pd.DataFrame([data_dict])
    
    try:
        prediction = int(model.predict(df)[0])
        probabilities = model.predict_proba(df)[0]
    except Exception as e:
        return {"status": "error", "message": f"Prediction failed: {e}"}
    
    if prediction == 0:
        risk_level = "Healthy"
        confidence = float(probabilities[0])
        summary = "Based on your responses, your mental health appears to be in a good state."
        recommendation = "Keep up your healthy habits!"
    else:
        confidence = float(probabilities[1])
        if confidence >= 0.8:
            risk_level = "Severe"
            summary = "Based on your responses, you are experiencing significant stress or depression."
            recommendation = "We strongly recommend reaching out to a professional counselor or therapist immediately."
        else:
            risk_level = "Attention"
            summary = "Based on your responses, you might be experiencing moderate stress or depressive symptoms."
            recommendation = "Consider speaking with a counselor and evaluating your current work/study balance."

    return {
        "status": "success",
        "prediction": {
            "risk_level": risk_level,
            "confidence": round(confidence, 2),
            "summary": summary,
            "recommendation": recommendation
        }
    }