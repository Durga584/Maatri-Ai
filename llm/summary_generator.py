import os
import google.generativeai as genai
from dotenv import load_dotenv
from llm.prompts import SUMMARY_GENERATOR_SYSTEM_PROMPT, SUMMARY_TEMPLATE

# Load environment variables from .env file
load_dotenv()

class MaatriSummaryGenerator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = None
        
        if self.api_key:
            self.configure_client()
            
    def configure_client(self, api_key=None):
        if api_key:
            self.api_key = api_key
            
        if not self.api_key:
            raise ValueError("Gemini API key is required to configure the summary generator.")
            
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=SUMMARY_GENERATOR_SYSTEM_PROMPT
        )
        
    def generate_health_summary(self, prediction_result, shap_explanation, recommendations_data):
        """
        prediction_result: dict from predict_risk
        shap_explanation: dict from explain_instance
        recommendations_data: dict from get_recommendations
        """
        if not self.model:
            raise RuntimeError("Summary generator model is not configured. Provide a valid Gemini API key.")
            
        # Format SHAP details for the prompt
        shap_contribs = shap_explanation['feature_contributions']
        shap_details_list = []
        for feat, val in sorted(shap_contribs.items(), key=lambda x: abs(x[1]), reverse=True):
            direction = "increases risk" if val >= 0 else "decreases risk"
            shap_details_list.append(f"  - {feat}: SHAP influence = {val:+.4f} ({direction})")
        shap_details = "\n".join(shap_details_list)
        
        # Format recommendations
        recs_list = recommendations_data['recommendations']
        recommendations = "\n".join(recs_list)
        
        # Fill template
        prompt = SUMMARY_TEMPLATE.format(
            risk_category=prediction_result['risk_category'],
            confidence=prediction_result['confidence_score'],
            heuristic_reason=prediction_result['heuristic_reason'],
            shap_details=shap_details,
            recommendations=recommendations
        )
        
        # Generate summary
        response = self.model.generate_content(prompt)
        return response.text
