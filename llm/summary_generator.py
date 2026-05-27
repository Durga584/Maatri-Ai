import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from llm.prompts import SUMMARY_GENERATOR_SYSTEM_PROMPT, SUMMARY_TEMPLATE

# Load environment variables from .env file
load_dotenv()

class MaatriSummaryGenerator:
    """
    MaatriSummaryGenerator utilizes Google's Gemini LLM to create cohesive,
    patient-friendly, natural-language health summaries from clinical ML inputs, SHAP data, and recommendations.
    """
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        self.model_name = "gemini-2.5-flash"  # Default stable model in 2026
        
        if self.api_key:
            try:
                self.configure_client()
            except Exception as e:
                print(f"Error during summary generator configuration: {e}")
            
    def configure_client(self, api_key=None):
        if api_key:
            self.api_key = api_key
            
        if not self.api_key:
            raise ValueError("Gemini API key is required to configure the summary generator.")
            
        # Initialize the GenAI Client
        self.client = genai.Client(api_key=self.api_key)
        
        # Dynamic model selection: query available models and pick the best matching Flash model
        try:
            available_models = [m.name for m in self.client.models.list()]
            preferred_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]
            
            selected = None
            for model in preferred_models:
                full_name = f"models/{model}" if not model.startswith("models/") else model
                if full_name in available_models:
                    selected = model
                    break
            
            if selected:
                self.model_name = selected
            else:
                # Fallback to any model with 'flash' in its name
                flash_models = [name.replace("models/", "") for name in available_models if "flash" in name.lower()]
                if flash_models:
                    self.model_name = flash_models[0]
            print(f"Summary Generator configured successfully using model: {self.model_name}")
        except Exception as err:
            # Fallback gracefully to default model if listing fails during startup
            print(f"Warning: Failed to dynamically query models for summary generator: {err}. Using default: {self.model_name}")
        
    def generate_health_summary(self, prediction_result, shap_explanation, recommendations_data):
        """
        prediction_result: dict from predict_risk
        shap_explanation: dict from explain_instance
        recommendations_data: dict from get_recommendations
        """
        if not self.client:
            print("Summary Generator called, but client is not initialized.")
            return "AI assistant temporarily unavailable. Please try again later."
            
        try:
            # Format SHAP details for the prompt
            shap_details = "No SHAP feature details available."
            if shap_explanation and 'feature_contributions' in shap_explanation:
                shap_contribs = shap_explanation['feature_contributions']
                shap_details_list = []
                for feat, val in sorted(shap_contribs.items(), key=lambda x: abs(x[1]), reverse=True):
                    direction = "increases risk" if val >= 0 else "decreases risk"
                    shap_details_list.append(f"  - {feat}: SHAP influence = {val:+.4f} ({direction})")
                shap_details = "\n".join(shap_details_list)
            
            # Format recommendations
            recommendations = "No specific guidelines available."
            if recommendations_data and 'recommendations' in recommendations_data:
                recs_list = recommendations_data['recommendations']
                recommendations = "\n".join(recs_list)
            
            # Fill template
            prompt = SUMMARY_TEMPLATE.format(
                risk_category=prediction_result.get('risk_category', 'Unknown'),
                confidence=prediction_result.get('confidence_score', 0.0),
                heuristic_reason=prediction_result.get('heuristic_reason', 'No heuristic explanation available.'),
                shap_details=shap_details,
                recommendations=recommendations
            )
            
            # Generate summary content using the client
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SUMMARY_GENERATOR_SYSTEM_PROMPT
                )
            )
            
            # Validate response and handle empty responses
            if not response or not response.text:
                raise ValueError("Received empty or null response from Gemini API.")
                
            return response.text
            
        except Exception as e:
            # Handle invalid key, network down, rate limit, etc.
            print(f"Gemini API Error in generate_health_summary: {e}")
            return "AI assistant temporarily unavailable. Please try again later."

