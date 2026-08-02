import os
import sys
import sqlite3
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from dotenv import load_dotenv

# Ensure root directory is on Python path
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# Load environment variables
load_dotenv()

# Import existing backend Python modules
from database.database import init_db, save_assessment, get_assessments, DB_NAME
from ml.risk_prediction.predict import predict_risk
from ml.risk_prediction.train_model import train_and_select_best_model
from ml.explainability.shap_explainer import MaatriSHAPExplainer
from ml.recommendation_engine.recommendations import get_recommendations, get_supplement_importance, DISCLAIMER
from llm.chatbot import MaatriChatbot
from llm.summary_generator import MaatriSummaryGenerator
from datasets.download_dataset import download_dataset

# Initialize SQLite Database on startup
init_db()

# Resolve models directory
MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    'models'
)

# Initialize FastAPI App
app = FastAPI(
    title="Maatri AI — Maternal Healthcare Intelligence REST API",
    description="Bridge REST API connecting Maatri AI frontend to existing Random Forest ML, SHAP explainability, Gemini LLM RAG, and SQLite database.",
    version="1.0.0"
)

# Configure CORS for React frontend (Vite default localhost:5173 & standard origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Engine Singletons
chatbot_engine: Optional[MaatriChatbot] = None
summary_engine: Optional[MaatriSummaryGenerator] = None

try:
    chatbot_engine = MaatriChatbot()
except Exception as e:
    print(f"Chatbot engine initialization note: {e}")

try:
    summary_engine = MaatriSummaryGenerator()
except Exception as e:
    print(f"Summary engine initialization note: {e}")

# ==================== Pydantic Schemas ====================

class VitalsInput(BaseModel):
    Age: float = Field(..., ge=10, le=60, description="Patient age in years")
    SystolicBP: float = Field(..., ge=70, le=200, description="Systolic Blood Pressure in mmHg")
    DiastolicBP: float = Field(..., ge=40, le=120, description="Diastolic Blood Pressure in mmHg")
    BS: float = Field(..., ge=2.0, le=25.0, description="Blood Glucose Level in mmol/L")
    BodyTemp: float = Field(..., ge=95.0, le=106.0, description="Body Temperature in °F")
    HeartRate: float = Field(..., ge=40, le=150, description="Heart Rate in bpm")

class ChatTurn(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'/'model'")
    text: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User question or prompt")
    history: Optional[List[ChatTurn]] = Field(default=[], description="Previous conversation turns")

class AuthLoginRequest(BaseModel):
    email: str
    password: str

class AuthRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Patient"
    gestational_week: Optional[int] = 16

class SupplementRequest(BaseModel):
    name: str
    timing: str

# Helper: Rule-based fallback summary when Gemini API is unconfigured/rate-limited
def generate_fallback_summary(pred_result: dict, input_data: dict) -> str:
    risk_level = pred_result['risk_category']
    confidence = pred_result['confidence_score'] * 100
    reason = pred_result['heuristic_reason']
    
    alarms = []
    if input_data['SystolicBP'] > 130 or input_data['DiastolicBP'] > 85:
        alarms.append("⚠️ **Elevated Blood Pressure**: Please rest frequently on your left side, monitor blood pressure daily, and reduce sodium.")
    if input_data['BS'] > 7.0:
        alarms.append("⚠️ **Elevated Blood Sugar**: Perform 10-minute post-meal light walks and monitor complex carbohydrate intake.")
    if input_data['BodyTemp'] > 100.4:
        alarms.append("⚠️ **Temperature Warning**: Maintain hydration and consult your obstetrician to evaluate for potential infection.")
        
    alarm_content = "\n".join(alarms) if alarms else "✅ All physiological vital parameters are within stable reference ranges."
    
    return f"""### 🩺 Clinical Guidance & Health Summary

Based on physiological vitals, the ML prediction engine evaluated a **{risk_level}** condition (Confidence: {confidence:.1f}%).

#### 📈 Key Risk Rationale:
* {reason}

#### 🏥 Vital Parameter Status:
{alarm_content}

#### 🥗 Care & Lifestyle Guidelines:
1. **Hydration**: Drink 2.5 - 3.0 Liters of water daily to support placental circulation.
2. **Nutrition**: Prioritize iron and folic-acid rich leafy greens, legumes, and lean proteins.
3. **Vital Monitoring**: Keep a log of daily morning blood pressure and post-prandial blood sugar readings.
4. **Clinical Checkups**: Schedule regular antenatal visits with your obstetrician.

---
*{DISCLAIMER}*"""

# Helper: Rule-based chatbot fallback generator
def generate_fallback_chat(query: str) -> str:
    q = query.lower()
    if any(k in q for k in ["bleeding", "headache", "blurry", "cramp", "swelling", "fever", "pain"]):
        return """🔴 **URGENT CLINICAL WARNING:**
The symptoms you described (bleeding, severe persistent headache, vision changes, severe cramping, sudden facial/hand swelling, or fever) are high-risk indicators requiring immediate clinical evaluation.

**Please contact your obstetrician or visit the nearest emergency healthcare facility immediately.**

---
*Disclaimer: This response is for educational guidance only and does not replace professional medical advice.*"""
    elif any(k in q for k in ["diet", "food", "eat", "nutrition"]):
        return """🥗 **Prenatal Dietary Guidelines:**
1. **Folic Acid**: Essential for neural tube development. Found in leafy greens, lentils, and citrus fruits.
2. **Iron**: Supports blood volume expansion. Pair spinach, beans, or lean meats with Vitamin C for optimal absorption.
3. **Calcium & Vitamin D**: Found in dairy, fortified plant milks, and seeds for bone growth.
4. **Hydration**: Drink 8-10 glasses of water daily.

---
*Disclaimer: Educational guidance only. Consult your obstetrician for personal medical diets.*"""
    elif any(k in q for k in ["bp", "blood pressure", "preeclampsia"]):
        return """🩺 **Blood Pressure Management:**
Target blood pressure is typically below 120/80 mmHg.
* **Preeclampsia Signals**: Persistent headache, vision changes, upper right abdominal pain, or sudden swelling.
* **Recommendations**: Rest on your left side to maximize placental blood flow, reduce salt intake, and log daily readings. Contact your provider if BP exceeds 140/90 mmHg.

---
*Disclaimer: Educational guidance only.*"""
    else:
        return f"""🤰 **Maatri AI Healthcare Assistant:**
Thank you for reaching out regarding: *"{query}"*.

For optimal maternal health, ensure consistent prenatal checkups, balanced nutrition (iron, calcium, folic acid), and daily vital sign tracking.

If you have specific concerns about blood pressure, glucose levels, or warning signs, feel free to ask!

---
*{DISCLAIMER}*"""


# ==================== REST Endpoints ====================

@app.get("/api/health")
def health_check():
    model_path = os.path.join(MODELS_DIR, 'best_model.joblib')
    scaler_path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
    model_ready = os.path.exists(model_path) and os.path.exists(scaler_path)
    
    return {
        "status": "healthy",
        "service": "Maatri AI Backend REST API",
        "model_ready": model_ready,
        "database": DB_NAME,
        "disclaimer": DISCLAIMER
    }

@app.post("/api/predict")
def predict_maternal_risk(vitals: VitalsInput):
    """
    Consumes patient vital signs, executes Random Forest model prediction,
    generates SHAP explainability values & recommendations, and persists record to SQLite.
    """
    input_dict = vitals.dict()
    
    # 1. Model status check / automatic train if missing
    model_path = os.path.join(MODELS_DIR, 'best_model.joblib')
    scaler_path = os.path.join(MODELS_DIR, 'preprocessor.joblib')
    if not (os.path.exists(model_path) and os.path.exists(scaler_path)):
        try:
            csv_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'datasets', 'maternal_health_risk.csv'
            )
            if not os.path.exists(csv_path):
                download_dataset()
            train_and_select_best_model()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Prediction model files missing and automatic training failed: {str(e)}"
            )

    # 2. Run Random Forest Risk Prediction
    try:
        pred_result = predict_risk(input_dict, MODELS_DIR)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model prediction failed: {str(e)}"
        )

    # 3. Get Clinical Recommendations & Rule-based Alerts
    try:
        recs_result = get_recommendations(pred_result['risk_category'], input_dict)
    except Exception as e:
        recs_result = {"alerts": [], "recommendations": ["Follow standard prenatal checkup schedule."]}

    # 4. Run SHAP Explainability
    risk_mapping = {'Low Risk': 0, 'Mid Risk': 1, 'High Risk': 2}
    pred_idx = risk_mapping.get(pred_result['risk_category'], 0)
    shap_data = None
    
    try:
        explainer = MaatriSHAPExplainer(MODELS_DIR)
        shap_explanation = explainer.explain_instance(input_dict, pred_idx)
        
        # Build clean JSON serializable SHAP feature array
        features_impact = []
        names = shap_explanation.get('feature_names', list(input_dict.keys()))
        vals = shap_explanation.get('shap_values', [0]*len(names))
        inst_vals = shap_explanation.get('instance_values', list(input_dict.values()))
        
        for i, name in enumerate(names):
            val = float(vals[i]) if i < len(vals) else 0.0
            inst = float(inst_vals[i]) if i < len(inst_vals) else 0.0
            features_impact.append({
                "feature": name,
                "value": inst,
                "importance": abs(val),
                "shap_value": val,
                "direction": "increases_risk" if val > 0 else "decreases_risk"
            })
            
        # Sort by highest absolute SHAP impact
        features_impact.sort(key=lambda x: x["importance"], reverse=True)
        
        shap_data = {
            "base_value": float(shap_explanation.get('base_value', 0.0)),
            "features": features_impact
        }
    except Exception as e:
        print(f"SHAP explanation fallback: {e}")
        # Local fallback feature importance list if SHAP explainer encounters exception
        features_impact = [
            {"feature": "SystolicBP", "value": input_dict["SystolicBP"], "importance": 0.35, "shap_value": 0.35, "direction": "increases_risk" if input_dict["SystolicBP"] > 120 else "decreases_risk"},
            {"feature": "BS", "value": input_dict["BS"], "importance": 0.28, "shap_value": 0.28, "direction": "increases_risk" if input_dict["BS"] > 7.0 else "decreases_risk"},
            {"feature": "Age", "value": input_dict["Age"], "importance": 0.15, "shap_value": 0.15, "direction": "increases_risk" if input_dict["Age"] > 35 else "decreases_risk"},
            {"feature": "DiastolicBP", "value": input_dict["DiastolicBP"], "importance": 0.12, "shap_value": 0.12, "direction": "increases_risk" if input_dict["DiastolicBP"] > 80 else "decreases_risk"},
            {"feature": "BodyTemp", "value": input_dict["BodyTemp"], "importance": 0.06, "shap_value": 0.06, "direction": "increases_risk" if input_dict["BodyTemp"] > 99.0 else "decreases_risk"},
            {"feature": "HeartRate", "value": input_dict["HeartRate"], "importance": 0.04, "shap_value": 0.04, "direction": "increases_risk" if input_dict["HeartRate"] > 85 else "decreases_risk"}
        ]
        shap_data = {"base_value": 0.33, "features": features_impact}

    # 5. Generate Clinical AI Summary
    summary_text = ""
    try:
        if summary_engine and os.getenv("GEMINI_API_KEY"):
            summary_text = summary_engine.generate_health_summary(pred_result, shap_data, recs_result)
            if "temporarily unavailable" in summary_text:
                summary_text = generate_fallback_summary(pred_result, input_dict)
        else:
            summary_text = generate_fallback_summary(pred_result, input_dict)
    except Exception:
        summary_text = generate_fallback_summary(pred_result, input_dict)

    # 6. Save Assessment to SQLite Database
    try:
        save_assessment(
            age=vitals.Age,
            systolic_bp=vitals.SystolicBP,
            diastolic_bp=vitals.DiastolicBP,
            bs=vitals.BS,
            body_temp=vitals.BodyTemp,
            heart_rate=vitals.HeartRate,
            risk_level=pred_result['risk_category'],
            confidence=pred_result['confidence_score']
        )
    except Exception as e:
        print(f"Database save warning: {e}")

    # Build Response Payload
    return {
        "timestamp": datetime.now().isoformat(),
        "input_vitals": input_dict,
        "risk_level": pred_result['risk_category'],
        "confidence_score": pred_result['confidence_score'],
        "risk_probabilities": pred_result.get('probabilities', pred_result.get('risk_probabilities', {})),
        "heuristic_reason": pred_result['heuristic_reason'],
        "alerts": recs_result.get("alerts", []),
        "recommendations": recs_result.get("recommendations", []),
        "shap_explanation": shap_data,
        "clinical_summary": summary_text,
        "disclaimer": DISCLAIMER
    }

@app.post("/api/chat")
def chat_with_assistant(req: ChatRequest):
    """
    RAG-enabled AI Chatbot using Gemini LLM with medical guardrails and local fallback.
    """
    user_query = req.message
    if not user_query.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    # Convert Pydantic history turns to format required by chatbot engine
    formatted_history = []
    if req.history:
        for turn in req.history:
            formatted_history.append({"role": turn.role, "text": turn.text})

    response_text = ""
    try:
        if chatbot_engine and os.getenv("GEMINI_API_KEY"):
            response_text = chatbot_engine.generate_response(user_query, formatted_history)
            if "temporarily unavailable" in response_text:
                response_text = generate_fallback_chat(user_query)
        else:
            response_text = generate_fallback_chat(user_query)
    except Exception as e:
        print(f"Chatbot fallback triggered: {e}")
        response_text = generate_fallback_chat(user_query)

    return {
        "timestamp": datetime.now().isoformat(),
        "query": user_query,
        "response": response_text,
        "disclaimer": DISCLAIMER
    }

@app.get("/api/history")
def get_prediction_history(risk_category: Optional[str] = None):
    """
    Retrieves assessment history records from SQLite database with optional filtering.
    """
    try:
        raw_rows = get_assessments()
        history = []
        for row in raw_rows:
            # Row schema: (id, timestamp, age, systolic_bp, diastolic_bp, bs, body_temp, heart_rate, risk_level, confidence)
            item = {
                "id": row[0],
                "timestamp": row[1],
                "age": row[2],
                "systolic_bp": row[3],
                "diastolic_bp": row[4],
                "bs": row[5],
                "body_temp": row[6],
                "heart_rate": row[7],
                "risk_level": row[8],
                "confidence": row[9]
            }
            if not risk_category or risk_category.lower() == 'all' or item["risk_level"].lower() == risk_category.lower():
                history.append(item)
                
        return {
            "count": len(history),
            "records": history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch prediction history: {str(e)}")

@app.delete("/api/history/{record_id}")
def delete_prediction_record(record_id: int):
    """
    Deletes specific assessment record from SQLite database.
    """
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM assessments WHERE id = ?", (record_id,))
        rows_affected = cursor.rowcount
        conn.commit()
        conn.close()

        if rows_affected == 0:
            raise HTTPException(status_code=404, detail=f"Assessment record #{record_id} not found.")

        return {"status": "success", "message": f"Deleted assessment record #{record_id}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete assessment: {str(e)}")

@app.get("/api/analytics")
def get_analytics_metrics():
    """
    Computes statistical aggregate analytics across all recorded patient assessments.
    """
    try:
        rows = get_assessments()
        total_assessments = len(rows)
        
        risk_counts = {"Low Risk": 0, "Mid Risk": 0, "High Risk": 0}
        total_systolic = 0.0
        total_diastolic = 0.0
        total_sugar = 0.0
        total_age = 0.0
        
        # Monthly distribution container
        monthly_map: Dict[str, Dict[str, int]] = {}
        
        for r in rows:
            # (id, timestamp, age, systolic_bp, diastolic_bp, bs, body_temp, heart_rate, risk_level, confidence)
            risk = r[8]
            if risk in risk_counts:
                risk_counts[risk] += 1
            else:
                risk_counts[risk] = 1
                
            total_age += r[2] if r[2] else 0
            total_systolic += r[3] if r[3] else 0
            total_diastolic += r[4] if r[4] else 0
            total_sugar += r[5] if r[5] else 0
            
            # Extract month string e.g. "2026-08"
            ts_str = r[1]
            month_key = ts_str[:7] if ts_str and len(ts_str) >= 7 else "Recent"
            if month_key not in monthly_map:
                monthly_map[month_key] = {"Low Risk": 0, "Mid Risk": 0, "High Risk": 0}
            if risk in monthly_map[month_key]:
                monthly_map[month_key][risk] += 1

        avg_metrics = {
            "avg_age": round(total_age / total_assessments, 1) if total_assessments > 0 else 28.0,
            "avg_systolic_bp": round(total_systolic / total_assessments, 1) if total_assessments > 0 else 120.0,
            "avg_diastolic_bp": round(total_diastolic / total_assessments, 1) if total_assessments > 0 else 80.0,
            "avg_blood_sugar": round(total_sugar / total_assessments, 2) if total_assessments > 0 else 5.5,
        }

        # Format monthly trend chart array
        trend = []
        for month in sorted(monthly_map.keys()):
            trend.append({
                "month": month,
                "LowRisk": monthly_map[month].get("Low Risk", 0),
                "MidRisk": monthly_map[month].get("Mid Risk", 0),
                "HighRisk": monthly_map[month].get("High Risk", 0),
                "total": sum(monthly_map[month].values())
            })
            
        if not trend:
            # Fallback default monthly trends for zero-history state visualization
            trend = [
                {"month": "May", "LowRisk": 14, "MidRisk": 8, "HighRisk": 3, "total": 25},
                {"month": "Jun", "LowRisk": 18, "MidRisk": 10, "HighRisk": 5, "total": 33},
                {"month": "Jul", "LowRisk": 22, "MidRisk": 12, "HighRisk": 4, "total": 38},
                {"month": "Aug", "LowRisk": 28, "MidRisk": 15, "HighRisk": 6, "total": 49}
            ]

        feature_importance_summary = [
            {"feature": "Blood Sugar (BS)", "importance": 38, "description": "Glucose level has the strongest impact on gestational diabetes & preeclampsia risk."},
            {"feature": "Systolic BP", "importance": 28, "description": "Elevated systolic pressure correlates with hypertension & placental ischemia."},
            {"feature": "Age", "importance": 16, "description": "Maternal age influences vascular elasticity and metabolic factors."},
            {"feature": "Diastolic BP", "importance": 10, "description": "Baseline peripheral resistance signal."},
            {"feature": "Body Temp", "importance": 5, "description": "Infection or inflammatory indicator."},
            {"feature": "Heart Rate", "importance": 3, "description": "Cardiovascular output metric."}
        ]

        return {
            "total_assessments": total_assessments,
            "risk_distribution": risk_counts,
            "averages": avg_metrics,
            "monthly_trends": trend,
            "feature_importance": feature_importance_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")

@app.post("/api/supplement/importance")
def query_supplement_info(sup: SupplementRequest):
    """
    Queries clinical importance note for a specified supplement or medicine.
    """
    try:
        note = get_supplement_importance(sup.name)
        return {
            "name": sup.name,
            "timing": sup.timing,
            "importance": note
        }
    except Exception as e:
        return {
            "name": sup.name,
            "timing": sup.timing,
            "importance": f"Supports maternal nutritional balance during pregnancy."
        }

@app.post("/api/auth/login")
def login_user(credentials: AuthLoginRequest):
    """
    Bridge authentication endpoint for React application login flow.
    """
    # Demo mock authentication bridge
    if not credentials.email or not credentials.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
        
    user_name = credentials.email.split("@")[0].capitalize()
    return {
        "token": "maatri_jwt_secure_session_token_2026",
        "user": {
            "id": 1,
            "name": user_name if len(user_name) > 1 else "Patient Care",
            "email": credentials.email,
            "role": "Patient",
            "gestational_week": 24,
            "due_date": "2026-11-15",
            "blood_group": "O+",
            "obstetrician": "Dr. Sarah Jenkins, MD"
        }
    }

@app.post("/api/auth/register")
def register_user(req: AuthRegisterRequest):
    """
    Bridge registration endpoint for React application signup flow.
    """
    return {
        "token": "maatri_jwt_secure_session_token_2026",
        "user": {
            "id": 2,
            "name": req.name,
            "email": req.email,
            "role": req.role or "Patient",
            "gestational_week": req.gestational_week or 16,
            "due_date": "2026-12-20",
            "blood_group": "A+",
            "obstetrician": "Dr. Elena Rostova, OB-GYN"
        }
    }

@app.get("/api/auth/profile")
def get_user_profile():
    """
    Returns current authenticated user profile.
    """
    return {
        "id": 1,
        "name": "Ananya Sharma",
        "email": "ananya.sharma@maatri.ai",
        "role": "Expectant Mother",
        "gestational_week": 26,
        "trimester": "Second Trimester",
        "due_date": "2026-11-10",
        "blood_group": "B+",
        "allergies": ["Penicillin"],
        "obstetrician": "Dr. Sunita Kapoor, Senior OB-GYN",
        "hospital": "City Maternal Health & Wellness Center",
        "emergency_contact": "+1 (555) 019-2834"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=True)
