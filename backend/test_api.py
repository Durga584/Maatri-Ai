import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.api import app

client = TestClient(app)

def test_fastapi_endpoints():
    print("=== Testing FastAPI REST Endpoints ===")
    
    # 1. Health Check
    res = client.get("/api/health")
    print("1. /api/health Status:", res.status_code, "Payload:", res.json()["service"])
    assert res.status_code == 200

    # 2. Risk Prediction
    vitals_payload = {
        "Age": 28,
        "SystolicBP": 120,
        "DiastolicBP": 80,
        "BS": 5.5,
        "BodyTemp": 98.6,
        "HeartRate": 75
    }
    res = client.post("/api/predict", json=vitals_payload)
    print("2. /api/predict Status:", res.status_code)
    pred_data = res.json()
    print("   Risk Level:", pred_data["risk_level"], "| Confidence:", pred_data["confidence_score"])
    print("   SHAP Features Count:", len(pred_data["shap_explanation"]["features"]))
    assert res.status_code == 200

    # 3. AI Chatbot
    chat_payload = {
        "message": "What is normal blood pressure during pregnancy?",
        "history": []
    }
    res = client.post("/api/chat", json=chat_payload)
    print("3. /api/chat Status:", res.status_code)
    chat_data = res.json()
    print("   Response Preview:", chat_data["response"][:80], "...")
    assert res.status_code == 200

    # 4. History
    res = client.get("/api/history")
    print("4. /api/history Status:", res.status_code, "| Total Records:", res.json()["count"])
    assert res.status_code == 200

    # 5. Analytics
    res = client.get("/api/analytics")
    print("5. /api/analytics Status:", res.status_code, "| Averages:", res.json()["averages"])
    assert res.status_code == 200

    # 6. Auth Profile
    res = client.get("/api/auth/profile")
    print("6. /api/auth/profile Status:", res.status_code, "| User:", res.json()["name"])
    assert res.status_code == 200

    print("=== ALL FASTAPI REST ENDPOINTS PASSED CLEANLY! ===")

if __name__ == "__main__":
    test_fastapi_endpoints()
