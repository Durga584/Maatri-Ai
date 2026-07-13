import os
import sys

# Add project root directory to Python path
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

import streamlit as st
import matplotlib.pyplot as plt
from dotenv import load_dotenv

from database.database import init_db

init_db()

# Import local modules
from ml.risk_prediction.predict import predict_risk
from ml.risk_prediction.train_model import train_and_select_best_model
from ml.explainability.shap_explainer import MaatriSHAPExplainer
from ml.recommendation_engine.recommendations import get_recommendations, get_supplement_importance, DISCLAIMER
from llm.chatbot import MaatriChatbot
from llm.summary_generator import MaatriSummaryGenerator
from datasets.download_dataset import download_dataset

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Maatri AI — Maternal Healthcare Intelligence",
    page_icon="🤰",
    layout="wide"
)

# Custom CSS for premium styling
st.markdown("""
<style>
    /* Premium fonts and background */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', 'Inter', sans-serif;
    }
    
    /* Hide default Streamlit elements */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* App background and centering */
    .stApp {
        background-color: #0F172A;
        color: #F8FAFC;
    }
    
    .block-container {
        max-width: 950px !important;
        padding-top: 1.5rem !important;
        padding-bottom: 2.5rem !important;
        margin: 0 auto !important;
    }
    
    /* Subtle glassmorphic cards for layout columns */
    div[data-testid="column"], div[data-testid="stColumn"] {
        background: rgba(30, 41, 59, 0.45) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-radius: 16px !important;
        padding: 20px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
        transition: all 0.3s ease;
    }
    div[data-testid="column"]:hover, div[data-testid="stColumn"]:hover {
        border-color: rgba(255, 255, 255, 0.12) !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* Header section details */
    .header-container {
        text-align: center;
        margin-bottom: 1.5rem;
        animation: fadeIn 0.5s ease-out;
    }
    .logo-area {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 4px;
    }
    .logo-icon {
        font-size: 2.8rem;
        filter: drop-shadow(0 0 12px rgba(124, 58, 237, 0.5));
    }
    .main-title {
        background: linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #7C3AED 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.6rem;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0;
    }
    .subtitle {
        font-size: 1.05rem;
        color: #94A3B8;
        margin-top: 4px;
        font-weight: 400;
    }
    .header-accent {
        height: 3px;
        width: 60px;
        background: linear-gradient(90deg, #7C3AED 0%, #EC4899 100%);
        border-radius: 2px;
        margin: 8px auto 0 auto;
        box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
    }
    
    /* Custom Segmented Navigation Bar (styled horizontal st.radio) */
    div[data-testid="stRadio"] > label {
        display: none !important;
    }
    div[data-testid="stRadio"] div[role="radiogroup"] {
        display: flex;
        justify-content: center;
        background-color: rgba(30, 41, 59, 0.5);
        border-radius: 14px;
        padding: 5px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        gap: 6px;
        margin-bottom: 20px;
    }
    div[data-testid="stRadio"] div[role="radiogroup"] label {
        flex: 1;
        background-color: transparent !important;
        color: #94A3B8 !important;
        border: none !important;
        padding: 10px 14px !important;
        border-radius: 10px !important;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s ease;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.95rem;
    }
    div[data-testid="stRadio"] div[role="radiogroup"] label:hover {
        color: #F8FAFC !important;
        background-color: rgba(255, 255, 255, 0.02) !important;
    }
    div[data-testid="stRadio"] div[role="radiogroup"] label:has(input:checked),
    div[data-testid="stRadio"] div[role="radiogroup"] label[data-checked="true"] {
        background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%) !important;
        color: #F8FAFC !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3) !important;
    }
    
    /* Input section header */
    .input-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .input-icon {
        font-size: 1.15rem;
    }
    .input-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #F8FAFC;
    }
    
    /* Reduce vertical spacing */
    div.stVerticalBlock {
        gap: 0.75rem !important;
    }
    
    /* GLOBAL INPUT STYLING (High contrast white inputs) */
    label[data-testid="stWidgetLabel"] {
        color: #94A3B8 !important;
        font-size: 0.85rem !important;
        font-weight: 500 !important;
        margin-bottom: 2px !important;
    }
    div[data-baseweb="input"], div[data-baseweb="number-input"], div[data-baseweb="textarea"] {
        background-color: #FFFFFF !important;
        border: 1px solid rgba(124, 58, 237, 0.2) !important;
        border-radius: 10px !important;
        color: #000000 !important;
        transition: all 0.2s ease;
    }
    div[data-baseweb="input"]:focus-within, div[data-baseweb="number-input"]:focus-within, div[data-baseweb="textarea"]:focus-within {
        border-color: #7C3AED !important;
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2) !important;
    }
    div[data-baseweb="input"] input, div[data-baseweb="number-input"] input, textarea {
        color: #000000 !important;
        caret-color: #7C3AED !important;
        background-color: transparent !important;
        font-size: 0.95rem !important;
        font-weight: 500 !important;
    }
    ::placeholder {
        color: #94A3B8 !important;
        opacity: 0.85 !important;
    }
    :-ms-input-placeholder { color: #94A3B8 !important; }
    ::-ms-input-placeholder { color: #94A3B8 !important; }
    
    /* Dropdowns styling */
    div[data-baseweb="select"] {
        background-color: #1E293B !important;
    }
    div[data-baseweb="select"] span {
        color: #F8FAFC !important;
    }
    div[role="listbox"] {
        background-color: #1E293B !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    div[role="option"] {
        color: #F8FAFC !important;
        background-color: transparent !important;
        transition: background-color 0.2s ease;
    }
    div[role="option"]:hover, div[role="option"][aria-selected="true"] {
        background-color: #7C3AED !important;
        color: #F8FAFC !important;
    }
    
    /* Style all native primary buttons to be gradient and glow */
    div.stButton > button[kind="primary"] {
        background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%) !important;
        color: #F8FAFC !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        width: 100% !important;
    }
    div.stButton > button[kind="primary"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.6), 0 0 15px rgba(236, 72, 153, 0.5) !important;
    }
    div.stButton > button[kind="primary"]:active {
        transform: translateY(0px) !important;
    }
    
    /* Secondary buttons (standard buttons) */
    div.stButton > button {
        background-color: rgba(30, 41, 59, 0.4) !important;
        color: #F8FAFC !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 10px !important;
        padding: 8px 16px !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        width: 100% !important;
    }
    div.stButton > button:hover {
        background-color: rgba(30, 41, 59, 0.8) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
        color: #F8FAFC !important;
    }
    
    /* Compact Medical Summary Metric Cards */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
        margin-bottom: 20px;
        animation: fadeIn 0.4s ease-out;
    }
    .compact-metric-card {
        background: rgba(30, 41, 59, 0.5) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        border-radius: 12px !important;
        padding: 8px 10px !important;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    }
    .metric-label {
        font-size: 0.7rem;
        color: #94A3B8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }
    .metric-val {
        font-size: 0.95rem;
        font-weight: 700;
        color: #F8FAFC;
        margin-top: 3px;
    }
    
    /* Result card container */
    .risk-result-container {
        border-radius: 16px !important;
        padding: 20px !important;
        margin-bottom: 24px !important;
        border: 1px solid transparent !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
        animation: fadeIn 0.4s ease-out;
    }
    .risk-result-container.high {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.15) !important;
    }
    .risk-result-container.mid {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%) !important;
        border-color: rgba(245, 158, 11, 0.3) !important;
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.15) !important;
    }
    .risk-result-container.low {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%) !important;
        border-color: rgba(16, 185, 129, 0.3) !important;
        box-shadow: 0 0 25px rgba(16, 185, 129, 0.1) !important;
    }
    
    /* Clinical Guidelines Cards */
    .guideline-alert-box {
        background: rgba(239, 68, 68, 0.06) !important;
        border-left: 4px solid #EF4444 !important;
        border-radius: 4px 10px 10px 4px !important;
        padding: 10px 14px !important;
        margin-bottom: 12px !important;
        color: #FCA5A5 !important;
        font-size: 0.88rem !important;
    }
    .recommendation-item {
        background: rgba(255, 255, 255, 0.02) !important;
        border-radius: 8px !important;
        padding: 10px 12px !important;
        margin-bottom: 8px !important;
        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        font-size: 0.88rem !important;
        line-height: 1.4 !important;
        color: #E2E8F0 !important;
    }
    
    /* Expandable details styling */
    div[data-testid="stExpander"] {
        background: rgba(30, 41, 59, 0.4) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        margin-bottom: 12px !important;
    }
    div[data-testid="stExpander"] details summary {
        color: #F8FAFC !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
    }
    
    /* Medication Cards */
    .med-item-card {
        background: rgba(30, 41, 59, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        border-radius: 12px !important;
        padding: 14px 16px !important;
        margin-bottom: 12px !important;
        border-left: 4px solid #7C3AED !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
    }
    
    /* CHAT ASSISTANT CHATGPT BUBBLE STYLING */
    div[data-testid="stChatMessage"] {
        border-radius: 16px !important;
        padding: 14px 18px !important;
        margin-bottom: 16px !important;
        max-width: 80% !important;
        display: flex !important;
        gap: 12px !important;
        animation: fadeIn 0.3s ease-out !important;
    }
    
    /* User message styling: purple theme aligned right */
    div[data-testid="stChatMessage"]:not(:has(div[data-testid="stChatMessageAvatar"] img[alt="🤰"])):not(:has(div[data-testid="stChatMessageAvatar"]:contains("🤰"))) {
        background-color: rgba(124, 58, 237, 0.15) !important;
        border: 1px solid rgba(124, 58, 237, 0.3) !important;
        margin-left: auto !important;
        border-bottom-right-radius: 4px !important;
        flex-direction: row-reverse !important;
    }
    
    /* Assistant message styling: slate theme aligned left */
    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatar"] img[alt="🤰"]),
    div[data-testid="stChatMessage"]:has(div[data-testid="stChatMessageAvatar"]:contains("🤰")) {
        background-color: rgba(30, 41, 59, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        margin-right: auto !important;
        border-bottom-left-radius: 4px !important;
    }
    
    /* Chat message avatar formatting */
    div[data-testid="stChatMessageAvatar"] {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 1.15rem !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        background-color: #1E293B !important;
        overflow: hidden !important;
    }
    div[data-testid="stChatMessage"]:not(:has(div[data-testid="stChatMessageAvatar"] img[alt="🤰"])):not(:has(div[data-testid="stChatMessageAvatar"]:contains("🤰"))) div[data-testid="stChatMessageAvatar"] {
        background-color: #7C3AED !important;
        border-color: #EC4899 !important;
    }
    
    /* Chat input styling override */
    div[data-testid="stChatInput"] {
        background-color: #FFFFFF !important;
        border-radius: 12px !important;
        border: 1px solid rgba(124, 58, 237, 0.2) !important;
        padding: 4px !important;
        transition: border-color 0.2s ease;
    }
    div[data-testid="stChatInput"]:focus-within {
        border-color: #7C3AED !important;
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2) !important;
    }
    div[data-testid="stChatInput"] textarea {
        color: #000000 !important;
        background-color: transparent !important;
        caret-color: #7C3AED !important;
        font-weight: 500 !important;
    }
    
    /* Style spinner loading indicator */
    div[data-testid="stSpinner"] {
        background: rgba(30, 41, 59, 0.65) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        border-radius: 12px !important;
        padding: 10px 16px !important;
        color: #F8FAFC !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Empty-state UI */
    .empty-state-card {
        text-align: center;
        padding: 35px 20px;
        border: 2px dashed rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        color: #94A3B8;
        margin-bottom: 20px;
        background: rgba(30, 41, 59, 0.15);
    }
    .empty-state-icon {
        font-size: 2.8rem;
        margin-bottom: 10px;
        opacity: 0.7;
    }
    
    /* Fade-in animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
        animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Responsive layout tweaks */
    @media (max-width: 768px) {
        .block-container {
            max-width: 100% !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
        }
        .main-title {
            font-size: 2rem !important;
        }
        .metric-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
        }
        div[data-testid="column"] {
            min-width: 100% !important;
            margin-bottom: 12px !important;
        }
    }
</style>
""", unsafe_allow_html=True)

# Helper: Clinical summary fallback generator (when Gemini API is unavailable or limits reached)
def generate_clinical_summary_fallback(pred_result, input_data):
    risk_level = pred_result['risk_category']
    confidence = pred_result['confidence_score'] * 100
    reason = pred_result['heuristic_reason']
    
    # Custom physiological alarms
    alarms = []
    if input_data['SystolicBP'] > 130 or input_data['DiastolicBP'] > 85:
        alarms.append("⚠️ **Elevated Blood Pressure**: Please rest frequently on your left side, monitor blood pressure daily, and avoid high-sodium meals.")
    if input_data['BS'] > 7.0:
        alarms.append("⚠️ **Elevated Blood Sugar**: Ensure regular post-meal walking (10 minutes) and limit processed carbohydrates.")
    if input_data['BodyTemp'] > 100.4:
        alarms.append("⚠️ **Temperature Warning (Fever)**: Maintain hydration and consult your doctor to evaluate for infection.")
        
    alarm_content = "\n".join(alarms) if alarms else "✅ All physiological metrics are stable."
    
    fallback_summary = f"""
### 🩺 Personalized Maternal Health Summary (Clinical Guidance Mode)

Based on the clinical values entered, the prediction model determines a **{risk_level}** condition (Confidence: {confidence:.1f}%). 

#### 📈 Primary Risk Rationale:
*   {reason}

#### 🏥 Physiological Metric Alert Status:
{alarm_content}

#### 🥗 Practical Lifestyle Guidelines:
1.  **Hydration**: Drink 2.5 to 3 liters of water daily to support placental blood circulation and maintain amniotic fluid levels.
2.  **Dietary Support**: Prioritize fiber-rich green vegetables (source of Folic Acid), lean proteins, and iron-dense food items (spinach, beans).
3.  **Active Routine**: Perform lightweight exercises like gentle walking if cleared by your obstetrician.
4.  **Vital Monitoring**: Log your blood pressure and blood sugar values.

---
*The AI medical assistant is currently experiencing high demand. To ensure uninterrupted care, this summary is generated using local medical rule templates. Please consult your obstetrician for any medical concerns.*
"""
    return fallback_summary

# Helper: Chatbot fallback response generator
def get_chatbot_response_fallback(user_query):
    query_lower = user_query.lower()
    
    # Severe alert warning flags
    danger_keywords = ["bleeding", "severe headache", "blurry vision", "pain", "cramp", "swelling", "decreased movement", "fever"]
    if any(k in query_lower for k in danger_keywords):
        return """
🔴 **URGENT CLINICAL WARNING:**
The symptoms you described (bleeding, persistent headache, visual disturbances, severe abdominal pain, sudden swelling, or fever) are high-risk indicators that require immediate medical attention.

**Please contact your obstetrician or go to the nearest emergency department immediately.**

---
*Disclaimer: This information is educational and not a substitute for professional medical advice. Please consult your healthcare provider or obstetrician for any medical concerns.*
"""

    if "diet" in query_lower or "nutrition" in query_lower or "eat" in query_lower or "food" in query_lower:
        return """
🥗 **Nutritional Guidelines during Pregnancy:**
A balanced, nutrient-dense diet is essential:
1.  **Folic Acid**: Crucial for neural tube development. Found in dark leafy greens, citrus fruits, and legumes.
2.  **Iron**: Supports expanded blood volume. Take spinach, beans, or lean meats paired with Vitamin C (like citrus) to optimize absorption.
3.  **Calcium & Vitamin D**: Essential for baby's bone growth. Include yogurt, cheese, broccoli, and fortified plant milks.
4.  **Hydration**: Drink at least 8-10 glasses of water daily.

*Avoid raw seafood, unpasteurized dairy, and excess caffeine.*

---
*Disclaimer: This information is educational and not a substitute for professional medical advice. Please consult your healthcare provider or obstetrician for any medical concerns.*
"""
    elif "blood pressure" in query_lower or "bp" in query_lower or "preeclampsia" in query_lower:
        return """
🩺 **Blood Pressure Management:**
Maintaining target blood pressure (below 120/80 mmHg) is highly important.
*   **Preeclampsia Warning Signs**: Persistent headache, vision changes (flashes or blurry vision), right-sided upper abdominal pain, or sudden swelling in face and hands.
*   **Guidelines**: Rest regularly on your left side to improve placental blood flow, reduce sodium, and ensure consistent self-monitoring. Contact your obstetrician if blood pressure exceeds 140/90 mmHg.

---
*Disclaimer: This information is educational and not a substitute for professional medical advice. Please consult your healthcare provider or obstetrician for any medical concerns.*
"""
    elif "blood sugar" in query_lower or "diabetes" in query_lower or "glucose" in query_lower:
        return """
🩸 **Blood Sugar & Gestational Diabetes:**
Managing glucose supports a healthy pregnancy.
*   **Dietary Strategy**: Eat small, frequent meals containing complex carbs (oats, quinoa), fiber, and protein. Avoid sweet drinks and refined flour.
*   **Activity**: A 10-minute walk after meals helps muscle cells absorb glucose and regulates insulin levels.
*   **Targets**: Fasting blood sugar should typically be under 5.6 mmol/L, and 2-hour post-meal under 6.7 mmol/L.

---
*Disclaimer: This information is educational and not a substitute for professional medical advice. Please consult your healthcare provider or obstetrician for any medical concerns.*
"""
    else:
        return """
🤰 **Welcome to Maatri AI Support:**
I am here to support you with clinical educational guidelines on nutrition, prenatal hydration, vital signs monitoring, warning signs, and postpartum recovery.

Please feel free to ask questions like:
*   "What diet is recommended for high blood sugar?"
*   "How can I manage my blood pressure?"
*   "What are the warning signs of preeclampsia?"

*The AI medical assistant is currently experiencing high demand. To ensure continuous care, I am providing guidance using local medical rule templates.*

---
*Disclaimer: This information is educational and not a substitute for professional medical advice. Please consult your healthcare provider or obstetrician for any medical concerns.*
"""

# Session state initialization
if 'reminders' not in st.session_state:
    st.session_state.reminders = [
        {
            "name": "Folic Acid", 
            "timing": "Morning (8:00 AM)",
            "importance": "Supports early development of the baby's brain and spinal cord, significantly reducing the risk of neural tube defects (NTDs)."
        },
        {
            "name": "Iron", 
            "timing": "Afternoon (1:00 PM)",
            "importance": "Crucial for producing hemoglobin, which carries oxygen to your organs and your baby. Helps prevent iron-deficiency anemia, fatigue, and preterm birth."
        }
    ]

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# Header Section
st.markdown("""
<div class="header-container">
    <div class="logo-area">
        <span class="logo-icon">🤰</span>
        <h1 class="main-title">Maatri AI</h1>
    </div>
    <p class="subtitle">AI-Powered Maternal Healthcare Assistant</p>
    <div class="header-accent"></div>
</div>
""", unsafe_allow_html=True)

# Load API Key automatically from environment variable
api_key = os.getenv("GEMINI_API_KEY")

# Initialize chatbot and summary engines silently in session state (no sidebar display)
if 'chatbot_engine' not in st.session_state:
    st.session_state.chatbot_engine = None
    if api_key:
        try:
            st.session_state.chatbot_engine = MaatriChatbot()
        except Exception as e:
            print(f"Error initializing chatbot engine: {e}")

if 'summary_engine' not in st.session_state:
    st.session_state.summary_engine = None
    if api_key:
        try:
            st.session_state.summary_engine = MaatriSummaryGenerator()
        except Exception as e:
            print(f"Error initializing summary engine: {e}")

# Check for model existence
models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
model_path = os.path.join(models_dir, 'best_model.joblib')
scaler_path = os.path.join(models_dir, 'preprocessor.joblib')
model_trained = os.path.exists(model_path) and os.path.exists(scaler_path)

# Custom Top Segmented Navigation Menu (overrides default tabs)
navigation_options = ["🤰 Risk Assessment", "💊 Medications & Reminders", "💬 AI Chat Assistant"]
selected_page_label = st.radio(
    "Navigation",
    options=navigation_options,
    label_visibility="collapsed",
    horizontal=True
)

# Map selection to page key
if "Risk" in selected_page_label:
    current_page = "Assessment"
elif "Medications" in selected_page_label:
    current_page = "Medications"
else:
    current_page = "Chat"

# --- PAGE 1: RISK ASSESSMENT & EXPLANATIONS ---
if current_page == "Assessment":
    if not model_trained:
        # Styled warning card with inline action if prediction model is missing
        st.markdown("""
        <div class="empty-state-card fade-in" style="border-color: #EF4444; background: rgba(239, 68, 68, 0.05);">
            <div class="empty-state-icon">🚨</div>
            <h4 style="margin: 0; color: #F8FAFC;">Prediction Model Missing</h4>
            <p style="margin: 8px 0; font-size: 0.9rem; color: #94A3B8;">
                The core machine learning risk prediction model could not be located.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("Download Dataset & Train Model Now", type="primary"):
            with st.spinner("Downloading dataset and training model..."):
                try:
                    csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'datasets', 'maternal_health_risk.csv')
                    if not os.path.exists(csv_path):
                        download_dataset()
                    best_name, _, _ = train_and_select_best_model()
                    st.success(f"Model trained successfully! Best algorithm: {best_name}")
                    st.rerun()
                except Exception as e:
                    st.error(f"Training failed: {e}")
    else:
        # Grouped physiological parameter inputs in 3 structured columns
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("""
            <div class="input-header">
                <span class="input-icon">👤</span>
                <span class="input-title">Patient Info</span>
            </div>
            """, unsafe_allow_html=True)
            age = st.number_input("Age (years)", min_value=10, max_value=60, value=28, step=1)
            hr = st.number_input("Heart Rate (bpm)", min_value=40, max_value=150, value=75, step=1)
            
        with col2:
            st.markdown("""
            <div class="input-header">
                <span class="input-icon">🩺</span>
                <span class="input-title">Blood Pressure</span>
            </div>
            """, unsafe_allow_html=True)
            sys_bp = st.number_input("Systolic BP (mmHg)", min_value=70, max_value=200, value=120, step=1,
                                     help="Upper blood pressure number")
            dia_bp = st.number_input("Diastolic BP (mmHg)", min_value=40, max_value=120, value=80, step=1,
                                     help="Lower blood pressure number")
            
        with col3:
            st.markdown("""
            <div class="input-header">
                <span class="input-icon">🩸</span>
                <span class="input-title">Health Metrics</span>
            </div>
            """, unsafe_allow_html=True)
            sugar = st.number_input("Blood Sugar (mmol/L)", min_value=2.0, max_value=25.0, value=5.5, step=0.1,
                                    help="Molar blood glucose concentration. Normal fasting: < 5.6 mmol/L")
            temp = st.number_input("Body Temperature (°F)", min_value=95.0, max_value=106.0, value=98.6, step=0.1)
            
        input_data = {
            'Age': age,
            'SystolicBP': sys_bp,
            'DiastolicBP': dia_bp,
            'BS': sugar,
            'BodyTemp': temp,
            'HeartRate': hr
        }
        
        # Analyze button
        st.markdown('<div style="margin-top: 15px;">', unsafe_allow_html=True)
        if st.button("Analyze Maternal Health Risk", type="primary", use_container_width=True):
            st.session_state.prediction_data = None
            st.session_state.summary_report = None
            
            with st.spinner("Analyzing parameters and running medical intelligence models..."):
                # Run prediction
                pred_result = predict_risk(input_data, models_dir)
                
                # Get recommendations
                recs_result = get_recommendations(pred_result['risk_category'], input_data)
                
                # SHAP explanation
                risk_mapping = {'Low Risk': 0, 'Mid Risk': 1, 'High Risk': 2}
                pred_idx = risk_mapping[pred_result['risk_category']]
                
                # Load SHAP with try-except to handle exceptions and fallback
                try:
                    explainer = MaatriSHAPExplainer(models_dir)
                    shap_explanation = explainer.explain_instance(input_data, pred_idx)
                    shap_fig = explainer.generate_explanation_plot(shap_explanation)
                except Exception as e:
                    print(f"SHAP Explainer Pipeline Error: {e}")
                    shap_explanation = None
                    shap_fig = None
                
                # Save results to session state
                st.session_state.prediction_data = {
                    'input': input_data,
                    'pred': pred_result,
                    'recs': recs_result,
                    'shap': shap_explanation,
                    'shap_fig': shap_fig
                }
        st.markdown('</div>', unsafe_allow_html=True)
        
        st.write("") # Spacer

        # Display Prediction Results (or Empty State if not run yet)
        if 'prediction_data' in st.session_state and st.session_state.prediction_data:
            p_data = st.session_state.prediction_data
            pred_risk = p_data['pred']['risk_category']
            conf = p_data['pred']['confidence_score'] * 100
            heuristic_reason = p_data['pred']['heuristic_reason']
            
            # 1. Compact Medical Summary Metric Cards
            st.markdown(f"""
            <div class="metric-grid">
                <div class="compact-metric-card">
                    <div class="metric-label">Age</div>
                    <div class="metric-val">👤 {p_data['input']['Age']} yrs</div>
                </div>
                <div class="compact-metric-card">
                    <div class="metric-label">Systolic BP</div>
                    <div class="metric-val">🩺 {p_data['input']['SystolicBP']}</div>
                </div>
                <div class="compact-metric-card">
                    <div class="metric-label">Diastolic BP</div>
                    <div class="metric-val">🩺 {p_data['input']['DiastolicBP']}</div>
                </div>
                <div class="compact-metric-card">
                    <div class="metric-label">Blood Sugar</div>
                    <div class="metric-val">🩸 {p_data['input']['BS']}</div>
                </div>
                <div class="compact-metric-card">
                    <div class="metric-label">Temp</div>
                    <div class="metric-val">🌡️ {p_data['input']['BodyTemp']}°F</div>
                </div>
                <div class="compact-metric-card">
                    <div class="metric-label">Heart Rate</div>
                    <div class="metric-val">💓 {p_data['input']['HeartRate']}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # 2. Sleek risk card with colored container
            if pred_risk == 'High Risk':
                risk_class = 'high'
                risk_icon = '🚨'
            elif pred_risk == 'Mid Risk':
                risk_class = 'mid'
                risk_icon = '⚠️'
            else:
                risk_class = 'low'
                risk_icon = '✅'
                
            st.markdown(f"""
            <div class="risk-result-container {risk_class} fade-in">
                <h3 style="margin: 0; font-size: 1.4rem; display: flex; align-items: center; gap: 10px; color: #F8FAFC;">
                    <span>{risk_icon}</span> Predicted Risk Level: {pred_risk}
                </h3>
                <div style="font-size: 1rem; margin-top: 6px; font-weight: 600; opacity: 0.95;">
                    AI Confidence Score: {conf:.1f}%
                </div>
                <p style="margin: 8px 0 0 0; font-size: 0.95rem; opacity: 0.9; line-height: 1.5; color: #F8FAFC;">
                    <b>Primary Indicators:</b> {heuristic_reason}
                </p>
            </div>
            """, unsafe_allow_html=True)
            
            # 3. Recommendations and SHAP Split
            col_results1, col_results2 = st.columns([5, 5])
            
            with col_results1:
                st.markdown("""
                <div class="input-header">
                    <span class="input-icon">📋</span>
                    <span class="input-title">Clinical Guidelines</span>
                </div>
                """, unsafe_allow_html=True)
                
                # Rule-based Clinical Alerts
                if p_data['recs']['alerts']:
                    for alert in p_data['recs']['alerts']:
                        st.markdown(f"""
                        <div class="guideline-alert-box">
                            ⚠️ <b>Alert:</b> {alert}
                        </div>
                        """, unsafe_allow_html=True)
                
                # Recommendations items
                for rec in p_data['recs']['recommendations']:
                    clean_rec = rec.lstrip("- ").strip()
                    st.markdown(f"""
                    <div class="recommendation-item">
                        🔹 {clean_rec}
                    </div>
                    """, unsafe_allow_html=True)
                    
            with col_results2:
                st.markdown("""
                <div class="input-header">
                    <span class="input-icon">🔍</span>
                    <span class="input-title">AI Explainability (SHAP)</span>
                </div>
                """, unsafe_allow_html=True)
                
                with st.expander("Show AI Feature Influence Graph", expanded=True):
                    st.markdown("<p style='font-size: 0.85rem; color: #94A3B8; margin-bottom: 10px; font-style: italic;'>These factors contributed most strongly to the predicted maternal health risk.</p>", unsafe_allow_html=True)
                    if p_data['shap_fig']:
                        st.pyplot(p_data['shap_fig'], use_container_width=True)
                    else:
                        st.markdown("""
                        <div class="empty-state-card" style="padding: 24px; border-color: rgba(255, 255, 255, 0.05); margin-bottom: 0;">
                            <div style="font-size: 2rem; margin-bottom: 6px; opacity: 0.5;">🔍</div>
                            <h5 style="margin: 0; color: #F8FAFC;">Insights Temporarily Unavailable</h5>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #94A3B8;">
                                Explainable AI insights are temporarily unavailable for this prediction.
                            </p>
                        </div>
                        """, unsafe_allow_html=True)
            
            # 4. Generative AI Summary
            st.markdown("""
            <div class="input-header" style="margin-top: 15px;">
                <span class="input-icon">✨</span>
                <span class="input-title">Generative AI Clinical Summary</span>
            </div>
            """, unsafe_allow_html=True)
            
            if 'summary_report' not in st.session_state or not st.session_state.summary_report:
                col_sum_left, col_sum_btn, col_sum_right = st.columns([1, 2, 1])
                with col_sum_btn:
                    if st.button("✨ Generate AI Health Summary", type="primary", use_container_width=True):
                        with st.spinner("Gemini is reading SHAP outputs and generating details..."):
                            try:
                                # Validate summary engine
                                if st.session_state.summary_engine is None:
                                    raise ValueError("Summary engine not initialized.")
                                summary = st.session_state.summary_engine.generate_health_summary(
                                    p_data['pred'], p_data['shap'], p_data['recs']
                                )
                                # Catch default error warning inside response text
                                if "temporarily unavailable" in summary:
                                    raise ValueError("Gemini API key placeholder or rate limit encountered.")
                                st.session_state.summary_report = summary
                            except Exception as e:
                                print(f"Gemini API Summary Exception, using fallback: {e}")
                                # Apply clean healthcare fallback report
                                st.session_state.summary_report = generate_clinical_summary_fallback(p_data['pred'], p_data['input'])
                            st.rerun()
            else:
                # Render Markdown inside the custom container safely
                st.markdown("""
                <div class="custom-card fade-in" style="background: rgba(124, 58, 237, 0.05) !important; border-color: rgba(124, 58, 237, 0.2) !important; margin-bottom: 0px;">
                """, unsafe_allow_html=True)
                st.markdown(st.session_state.summary_report)
                st.markdown("</div>", unsafe_allow_html=True)
        else:
            # 5. Empty State UI before analysis is triggered
            st.markdown("""
            <div class="empty-state-card fade-in">
                <div class="empty-state-icon">🩺🤰</div>
                <h4 style="margin: 0; color: #F8FAFC;">No Risk Analysis Performed</h4>
                <p style="margin: 8px 0 0 0; font-size: 0.9rem; color: #94A3B8; max-width: 460px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                    Enter the physiological maternal parameters above and click "Analyze Maternal Health Risk". Clinical predictions, metric summaries, and Explainable AI insights will appear after risk analysis.
                </p>
            </div>
            """, unsafe_allow_html=True)

# --- PAGE 2: MEDICATION REMINDERS ---
elif current_page == "Medications":
    col_rem1, col_rem2 = st.columns([4, 6])
    
    with col_rem1:
        st.markdown("""
        <div class="input-header">
            <span class="input-icon">➕</span>
            <span class="input-title">Add Supplement</span>
        </div>
        """, unsafe_allow_html=True)
        
        med_name = st.text_input("Supplement Name", placeholder="e.g. Iron, Folic Acid, Calcium")
        med_time = st.text_input("Timing/Frequency", placeholder="e.g. Morning after breakfast, 8:00 AM")
        
        if st.button("Add Reminder", type="primary", use_container_width=True):
            if med_name and med_time:
                with st.spinner("Generating clinical supplement education note..."):
                    importance_note = get_supplement_importance(med_name)
                    # If API is missing/fails, get_supplement_importance handles it gracefully returning local clinical message
                st.session_state.reminders.append({
                    "name": med_name, 
                    "timing": med_time,
                    "importance": importance_note
                })
                st.success(f"Added reminder for {med_name}!")
                st.rerun()
            else:
                st.error("Please fill in both the supplement name and schedule timing.")
                
    with col_rem2:
        st.markdown("""
        <div class="input-header">
            <span class="input-icon">💊</span>
            <span class="input-title">Active Reminders & Education</span>
        </div>
        """, unsafe_allow_html=True)
        
        if not st.session_state.reminders:
            st.markdown("""
            <div class="empty-state-card fade-in" style="padding: 24px;">
                <div style="font-size: 2.2rem; margin-bottom: 6px; opacity: 0.5;">💊</div>
                <h5 style="margin:0; color: #F8FAFC;">No Reminders Scheduled</h5>
                <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #94A3B8; line-height: 1.4;">Add medicines or vitamins to build schedules and view educational summaries.</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            for idx, rem in enumerate(st.session_state.reminders):
                importance_note = rem.get('importance')
                if not importance_note:
                    importance_note = get_supplement_importance(rem['name'])
                    rem['importance'] = importance_note
                
                st.markdown(f"""
                <div class="med-item-card fade-in">
                    <h4 style="margin: 0; color: #F8FAFC; font-size: 1.05rem; display: flex; align-items: center; gap: 6px;">
                        <span>💊</span> {rem['name']}
                    </h4>
                    <p style="margin: 4px 0; font-size: 0.88rem; color: #EC4899; font-weight: 600;">
                        ⏰ Timing: {rem['timing']}
                    </p>
                    <p style="margin: 0; font-size: 0.85rem; color: #94A3B8; line-height: 1.4; font-style: italic;">
                        💡 Importance: {importance_note}
                    </p>
                </div>
                """, unsafe_allow_html=True)
                
                # Delete button
                if st.button("Remove Reminder", key=f"del_{idx}"):
                    st.session_state.reminders.pop(idx)
                    st.rerun()

# --- PAGE 3: AI CHAT ASSISTANT ---
else:
    st.markdown("""
    <div class="input-header">
        <span class="input-icon">💬</span>
        <span class="input-title">Maternal Healthcare AI Assistant</span>
    </div>
    """, unsafe_allow_html=True)
    
    # Display chat history utilizing Streamlit's native chat UI styled via CSS
    for message in st.session_state.chat_history:
        if message["role"] == "user":
            with st.chat_message("user"):
                st.markdown(message["text"])
        else:
            with st.chat_message("assistant", avatar="🤰"):
                st.markdown(message["text"])
                
    # Check for chat input
    user_query = st.chat_input("Ask Maatri AI clinical assistant...")
            
    if user_query:
        # Display user message instantly
        with st.chat_message("user"):
            st.markdown(user_query)
        
        # Save user message to history
        st.session_state.chat_history.append({"role": "user", "text": user_query})
        
        # Generate assistant response
        with st.spinner("Analyzing query..."):
            try:
                # Try calling Gemini Chatbot API
                if st.session_state.chatbot_engine is None or not api_key:
                    raise ValueError("Gemini API key is unconfigured or chatbot client is missing.")
                response_text = st.session_state.chatbot_engine.generate_response(user_query, st.session_state.chat_history[:-1])
                
                # If API response returned the default unavailable string, raise ValueError to trigger fallback
                if "temporarily unavailable" in response_text:
                    raise ValueError("Gemini API limits or auth issue.")
            except Exception as e:
                # Graceful fallback: local clinical rule-based chatbot generator
                print(f"Gemini Chatbot API failure, using fallback: {e}")
                response_text = get_chatbot_response_fallback(user_query)
                
            # Display assistant response
            with st.chat_message("assistant", avatar="🤰"):
                st.markdown(response_text)
                
            # Save assistant response to history
            st.session_state.chat_history.append({"role": "assistant", "text": response_text})
            st.rerun()

# Global Footer Disclaimer
st.markdown("---")
st.markdown(f"<div style='text-align: center; color: #EF4444; font-size: 0.85rem; font-weight: 500; max-width: 800px; margin: 0 auto; line-height: 1.4;'>{DISCLAIMER}</div>", unsafe_allow_html=True)
