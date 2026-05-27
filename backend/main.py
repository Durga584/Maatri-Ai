import os
import sys
import streamlit as st
import matplotlib.pyplot as plt
from dotenv import load_dotenv

# Ensure parent directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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
    /* Main Layout and Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    .main-title {
        background: linear-gradient(135deg, #FF758F 0%, #FF7EB3 50%, #7052FF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.8rem;
        font-weight: 700;
        margin-bottom: 0.2rem;
        text-align: center;
    }
    
    .subtitle {
        font-size: 1.1rem;
        color: #6c757d;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    /* Cards and Info Elements */
    .metric-card {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 1.2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        margin-bottom: 1rem;
    }
    
    .risk-high {
        background: linear-gradient(135deg, #FFF0F2 0%, #FFE3E6 100%);
        border: 1px solid #FFA8B3;
        border-radius: 12px;
        padding: 1.5rem;
        color: #721C24;
    }
    
    .risk-mid {
        background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
        border: 1px solid #FCD34D;
        border-radius: 12px;
        padding: 1.5rem;
        color: #92400E;
    }
    
    .risk-low {
        background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
        border: 1px solid #86EFAC;
        border-radius: 12px;
        padding: 1.5rem;
        color: #166534;
    }
    
    .section-header {
        font-size: 1.4rem;
        font-weight: 600;
        color: #2D3748;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 0.5rem;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .supplement-card {
        border-left: 4px solid #7052FF;
        background-color: #F8FAFC;
        padding: 0.8rem 1.2rem;
        border-radius: 0 8px 8px 0;
        margin-bottom: 0.8rem;
    }
</style>
""", unsafe_allow_html=True)

# Session state initialization
if 'reminders' not in st.session_state:
    st.session_state.reminders = [
        {"name": "Folic Acid", "timing": "Morning (8:00 AM)"},
        {"name": "Iron", "timing": "Afternoon (1:00 PM)"}
    ]

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# Header
st.markdown("<h1 class='main-title'>Maatri AI</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>LLM-Integrated Maternal Healthcare Intelligence System</p>", unsafe_allow_html=True)

# Sidebar Configuration
st.sidebar.header("🛠️ System Configuration")

# Load API Key automatically from environment variable
api_key = os.getenv("GEMINI_API_KEY")
chatbot_engine = None
summary_engine = None

if api_key:
    try:
        # Pass None so the classes load the key automatically from dotenv/os.getenv
        chatbot_engine = MaatriChatbot()
        summary_engine = MaatriSummaryGenerator()
        st.sidebar.success("✅ Gemini API Key loaded from environment.")
    except Exception as e:
        st.sidebar.error(f"Error configuring Gemini: {e}")
else:
    st.sidebar.error("⚠️ GEMINI_API_KEY is missing in your .env file. Chatbot and Summary generator are disabled.")

# Check for model existence
models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'models')
model_path = os.path.join(models_dir, 'best_model.joblib')
scaler_path = os.path.join(models_dir, 'preprocessor.joblib')
model_trained = os.path.exists(model_path) and os.path.exists(scaler_path)

st.sidebar.subheader("🤖 Model Status")
if model_trained:
    st.sidebar.info("Prediction model is trained and ready.")
    if st.sidebar.button("Retrain Model"):
        with st.spinner("Retraining model..."):
            try:
                # Ensure dataset exists
                csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'datasets', 'maternal_health_risk.csv')
                if not os.path.exists(csv_path):
                    download_dataset()
                best_name, _, _ = train_and_select_best_model()
                st.sidebar.success(f"Successfully retrained! Best model: {best_name}")
                st.rerun()
            except Exception as e:
                st.sidebar.error(f"Retraining failed: {e}")
else:
    st.sidebar.warning("Prediction model not found.")
    if st.sidebar.button("Train Model Now"):
        with st.spinner("Downloading dataset and training model..."):
            try:
                # Download dataset
                csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'datasets', 'maternal_health_risk.csv')
                if not os.path.exists(csv_path):
                    download_dataset()
                best_name, _, _ = train_and_select_best_model()
                st.sidebar.success(f"Trained! Best model: {best_name}")
                st.rerun()
            except Exception as e:
                st.sidebar.error(f"Training failed: {e}")

# Main Tabs
tab1, tab2, tab3 = st.tabs(["🤰 Risk Assessment & Explanations", "💊 Medication Reminders", "💬 conversational Assistant"])

# --- TAB 1: RISK ASSESSMENT & EXPLANATIONS ---
with tab1:
    if not model_trained:
        st.error("Please train the Machine Learning model in the sidebar before performing risk assessments.")
    else:
        st.subheader("Maternal Health Risk Predictor")
        
        # Clinical parameters input form
        col1, col2, col3 = st.columns(3)
        
        with col1:
            age = st.number_input("Age (years)", min_value=10, max_value=60, value=28, step=1)
            sys_bp = st.number_input("Systolic BP (mmHg)", min_value=70, max_value=200, value=120, step=1,
                                     help="Upper blood pressure number")
        with col2:
            sugar = st.number_input("Blood Sugar (mmol/L)", min_value=2.0, max_value=25.0, value=5.5, step=0.1,
                                    help="Molar blood glucose concentration. Normal fasting: < 5.6 mmol/L")
            dia_bp = st.number_input("Diastolic BP (mmHg)", min_value=40, max_value=120, value=80, step=1,
                                     help="Lower blood pressure number")
        with col3:
            temp = st.number_input("Body Temperature (°F)", min_value=95.0, max_value=106.0, value=98.6, step=0.1)
            hr = st.number_input("Heart Rate (bpm)", min_value=40, max_value=150, value=75, step=1)
            
        input_data = {
            'Age': age,
            'SystolicBP': sys_bp,
            'DiastolicBP': dia_bp,
            'BS': sugar,
            'BodyTemp': temp,
            'HeartRate': hr
        }
        
        if st.button("Perform AI Risk Prediction", type="primary"):
            st.session_state.prediction_data = None
            st.session_state.summary_report = None
            
            with st.spinner("Analyzing parameters..."):
                # Run prediction
                pred_result = predict_risk(input_data, models_dir)
                
                # Get recommendations
                recs_result = get_recommendations(pred_result['risk_category'], input_data)
                
                # SHAP explanation
                risk_mapping = {'Low Risk': 0, 'Mid Risk': 1, 'High Risk': 2}
                pred_idx = risk_mapping[pred_result['risk_category']]
                
                try:
                    explainer = MaatriSHAPExplainer(models_dir)
                    shap_explanation = explainer.explain_instance(input_data, pred_idx)
                    shap_fig = explainer.generate_explanation_plot(shap_explanation)
                except Exception as e:
                    shap_explanation = None
                    shap_fig = None
                    st.warning(f"Could not generate SHAP explanation: {e}")
                
                # Save to session state
                st.session_state.prediction_data = {
                    'input': input_data,
                    'pred': pred_result,
                    'recs': recs_result,
                    'shap': shap_explanation,
                    'shap_fig': shap_fig
                }
                
        # Display Prediction Results
        if 'prediction_data' in st.session_state and st.session_state.prediction_data:
            p_data = st.session_state.prediction_data
            pred_risk = p_data['pred']['risk_category']
            conf = p_data['pred']['confidence_score'] * 100
            
            st.markdown("<h3 class='section-header'>Prediction Result</h3>", unsafe_allow_html=True)
            
            # Stylized risk container
            if pred_risk == 'High Risk':
                st.markdown(f"""
                <div class='risk-high'>
                    <h3>🚨 Predicted Risk: {pred_risk}</h3>
                    <p><b>Model Confidence:</b> {conf:.1f}%</p>
                    <p><b>Analysis:</b> {p_data['pred']['heuristic_reason']}</p>
                </div>
                """, unsafe_allow_html=True)
            elif pred_risk == 'Mid Risk':
                st.markdown(f"""
                <div class='risk-mid'>
                    <h3>⚠️ Predicted Risk: {pred_risk}</h3>
                    <p><b>Model Confidence:</b> {conf:.1f}%</p>
                    <p><b>Analysis:</b> {p_data['pred']['heuristic_reason']}</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class='risk-low'>
                    <h3>✅ Predicted Risk: {pred_risk}</h3>
                    <p><b>Model Confidence:</b> {conf:.1f}%</p>
                    <p><b>Analysis:</b> {p_data['pred']['heuristic_reason']}</p>
                </div>
                """, unsafe_allow_html=True)
                
            col_results1, col_results2 = st.columns([5, 5])
            
            with col_results1:
                st.markdown("<h3 class='section-header'>Rule-Based Clinical Guidelines</h3>", unsafe_allow_html=True)
                
                if p_data['recs']['alerts']:
                    st.error("⚠️ Alerts:\n" + "\n".join([f"- {alert}" for alert in p_data['recs']['alerts']]))
                    
                st.markdown("### Actionable Recommendations:")
                for rec in p_data['recs']['recommendations']:
                    st.write(rec)
                    
            with col_results2:
                st.markdown("<h3 class='section-header'>Explainable AI (SHAP Plot)</h3>", unsafe_allow_html=True)
                if p_data['shap_fig']:
                    st.pyplot(p_data['shap_fig'])
                else:
                    st.write("SHAP explainer not available.")
                    
            # Natural-Language report generation section (hybrid reasoning)
            st.markdown("<h3 class='section-header'>📋 Generative AI Health Summary</h3>", unsafe_allow_html=True)
            
            if not api_key:
                st.warning("GEMINI_API_KEY is missing. Please configure it in your .env file to enable natural-language report summaries.")
            else:
                if st.button("Generate AI Health Summary"):
                    with st.spinner("Generating summary report via Gemini..."):
                        try:
                            summary = summary_engine.generate_health_summary(
                                p_data['pred'], p_data['shap'], p_data['recs']
                            )
                            st.session_state.summary_report = summary
                        except Exception as e:
                            st.error(f"Error generating summary: {e}")
                            
                if 'summary_report' in st.session_state and st.session_state.summary_report:
                    st.info("### Personalized Health Summary")
                    st.write(st.session_state.summary_report)

# --- TAB 2: MEDICATION REMINDERS ---
with tab2:
    st.subheader("Medication Reminders & Supplement Education")
    st.write("Keep track of your supplements and learn why they are important for your pregnancy.")
    
    col_rem1, col_rem2 = st.columns([4, 6])
    
    with col_rem1:
        st.markdown("#### Add Supplement/Medicine")
        med_name = st.text_input("Supplement Name", placeholder="e.g. Iron, Folic Acid, Calcium")
        med_time = st.text_input("Timing", placeholder="e.g. Morning after breakfast, 8:00 AM")
        
        if st.button("Add Reminder"):
            if med_name and med_time:
                st.session_state.reminders.append({"name": med_name, "timing": med_time})
                st.success(f"Added reminder for {med_name}!")
                st.rerun()
            else:
                st.error("Please fill in both name and timing.")
                
    with col_rem2:
        st.markdown("#### Active Reminders & Educational Importance")
        if not st.session_state.reminders:
            st.info("No medication reminders added yet.")
        else:
            for idx, rem in enumerate(st.session_state.reminders):
                importance_note = get_supplement_importance(rem['name'])
                
                # Layout reminder card
                with st.container():
                    st.markdown(f"""
                    <div class='supplement-card'>
                        <h4 style='margin: 0; color: #2D3748;'>💊 {rem['name']}</h4>
                        <p style='margin: 0.2rem 0; font-size: 0.95rem; color: #4A5568;'><b>Timing:</b> {rem['timing']}</p>
                        <p style='margin: 0; font-size: 0.9rem; color: #718096; font-style: italic;'><b>Importance:</b> {importance_note}</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    if st.button(f"Remove", key=f"del_{idx}"):
                        st.session_state.reminders.pop(idx)
                        st.rerun()

# --- TAB 3: CONVERSATIONAL ASSISTANT ---
with tab3:
    st.subheader("Conversational Pregnancy & Postpartum Assistant")
    st.write("Ask questions about nutrition, pregnancy doubts, symptom awareness, and postpartum recovery.")
    
    if not api_key:
        st.warning("GEMINI_API_KEY is missing. Please configure it in your .env file to enable the chatbot assistant.")
    else:
        # Display chat history
        for message in st.session_state.chat_history:
            if message["role"] == "user":
                with st.chat_message("user"):
                    st.write(message["text"])
            else:
                with st.chat_message("assistant", avatar="🤰"):
                    st.write(message["text"])
                    
        # Check for chat input (handles newer streamlit or falls back to text_input)
        user_query = None
        if hasattr(st, "chat_input"):
            user_query = st.chat_input("Ask Maatri AI...")
        else:
            user_query = st.text_input("Ask Maatri AI...", key="chat_query_txt")
            if st.button("Send", key="send_chat_btn"):
                pass
            else:
                user_query = None
                
        if user_query:
            # Display user message
            with st.chat_message("user"):
                st.write(user_query)
            
            # Save user message to history
            st.session_state.chat_history.append({"role": "user", "text": user_query})
            
            # Generate assistant response
            with st.spinner("Thinking..."):
                try:
                    response_text = chatbot_engine.generate_response(user_query, st.session_state.chat_history[:-1])
                    
                    # Display assistant response
                    with st.chat_message("assistant", avatar="🤰"):
                        st.write(response_text)
                        
                    # Save assistant response to history
                    st.session_state.chat_history.append({"role": "assistant", "text": response_text})
                    st.rerun()
                except Exception as e:
                    st.error(f"Error communicating with Gemini: {e}")

# Global Footer Disclaimer
st.markdown("---")
st.markdown(f"<div style='text-align: center; color: #E53E3E; font-size: 0.95rem; font-weight: bold;'>{DISCLAIMER}</div>", unsafe_allow_html=True)
