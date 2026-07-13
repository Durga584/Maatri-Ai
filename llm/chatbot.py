import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from llm.prompts import CHATBOT_SYSTEM_PROMPT

# Load environment variables from .env file
load_dotenv()

class MaatriChatbot:
    """
    MaatriChatbot interfaces with the Google Gemini API using the latest google-genai SDK.
    It provides conversational capabilities with dynamic model selection and robust error fallbacks.
    """
    def __init__(self, api_key=None):
        # Allow loading key from parameter, falling back to GEMINI_API_KEY environment variable
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        self.model_name = "gemini-2.5-flash"  # Default stable model in 2026
        
        # Configure client if key is available
        if self.api_key:
            try:
                self.configure_client()
            except Exception as e:
                print(f"Error during chatbot client configuration: {e}")

    def configure_client(self, api_key=None):
        if api_key:
            self.api_key = api_key
            
        if not self.api_key:
            raise ValueError("Gemini API key is required to configure the chatbot.")
            
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
            print(f"Chatbot configured successfully using model: {self.model_name}")
        except Exception as err:
            # If listing models fails (e.g. network issue or invalid key at startup), 
            # we log it and fallback to the default stable model instead of crashing the app
            print(f"Warning: Failed to dynamically query models: {err}. Using default: {self.model_name}")

    def generate_response(self, user_message, chat_history=None):
        """
        Generate a response for the user message.
        chat_history: list of dicts like [{'role': 'user'/'model', 'text': '...'}]
        """
        # If client is not initialized, return the fallback warning
        if not self.client:
            print("Chatbot generate_response called, but client is not initialized.")
            return "AI assistant temporarily unavailable. Please try again later."
            
        try:
            # Convert simple chat history dict to types.Content structure required by google-genai
            formatted_history = []
            if chat_history:
                for turn in chat_history:
                    role = "user" if turn.get('role') == 'user' else 'model'
                    # Ensure text is not empty
                    text_content = turn.get('text', '')
                    if text_content:
                        formatted_history.append(
                            types.Content(
                                role=role,
                                parts=[types.Part(text=text_content)]
                            )
                        )
            
            # Start/resume multi-turn chat session with config (system instructions) and history
            chat = self.client.chats.create(
                model=self.model_name,
                history=formatted_history,
                config=types.GenerateContentConfig(
                     system_instruction=CHATBOT_SYSTEM_PROMPT,
                     temperature=0.2,
)
            )
            
            # Send current message to the session
            response = chat.send_message(user_message)
            print("FINISHED RESPONSE:")
            print(response.text)
            print("END OF RESPONSE")
            # Validate response and handle empty outputs
            if not response or not response.text:
                raise ValueError("Received empty or null response from Gemini API.")
                
            return response.text
            
        except Exception as e:
            # Catch API quota issues, invalid API key, network failures, etc.
            print(f"Gemini API Error in generate_response: {e}")
            return "AI assistant temporarily unavailable. Please try again later."


def generate_medicine_info(medicine_name, api_key=None):
    """
    Dynamically generates pregnancy/postpartum-aware educational information for a given medicine/supplement.
    Follows clinical safety constraints (no dosage, consult doctor, under 80 words).
    """
    # Load API key from parameter or environment variable
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        print("Warning: GEMINI_API_KEY is not set. Using fallback medicine message.")
        return "Please consult your doctor for information regarding this medicine."

    try:
        from google import genai
        from google.genai import types
        
        # Initialize client
        client = genai.Client(api_key=key)
        
        # Determine model dynamically or fallback to gemini-2.5-flash
        model_name = "gemini-2.5-flash"
        try:
            available_models = [m.name for m in client.models.list()]
            preferred_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"]
            for model in preferred_models:
                full_name = f"models/{model}" if not model.startswith("models/") else model
                if full_name in available_models:
                    model_name = model
                    break
        except Exception as list_err:
            print(f"Warning: Failed to list models in generate_medicine_info: {list_err}. Defaulting to gemini-2.5-flash.")

        # Construct safe, structured instructions
        prompt_system = (
            """System Role:
                You are "Maatri AI Medicine Explainer", an AI assistant that provides educational information about medicines for pregnant and postpartum women. Your responses are informational only and must never replace professional medical advice.

                For every medicine:
                - Explain its common medical use.
                - Mention pregnancy or postpartum relevance if known.
                - Briefly describe its general medical importance.

                Safety Requirements:
                - Maximum 80 words.
                - Use clear, non-technical language.
                - Never mention dosage, frequency, duration, or administration.
                - Never diagnose or prescribe.
                - Never recommend self-medication.
                - Never state that a medicine is "safe" or "unsafe" without appropriate qualification.
                - If evidence is limited or uncertain, acknowledge the uncertainty.
                - Always conclude with:
                "Consult your doctor or healthcare provider before taking this medicine, especially during pregnancy or while breastfeeding."

                Style:
                - Concise
                - Neutral
                - Evidence-based
                - Reassuring without giving false certainty
                - Pregnancy-aware
                - Single paragraph only """
        )

        response = client.models.generate_content(
            model=model_name,
            contents=f"Provide a brief overview for: {medicine_name}",
            config=types.GenerateContentConfig(
                system_instruction=prompt_system,
                temperature=0.2
            )
        )

        if not response or not response.text:
            raise ValueError("Received empty response from Gemini API.")

        return response.text.strip()

    except Exception as e:
        print(f"Gemini API Error in generate_medicine_info for '{medicine_name}': {e}")
        return "Please consult your doctor for information regarding this medicine."


