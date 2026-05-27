import os
import google.generativeai as genai
from dotenv import load_dotenv
from llm.prompts import CHATBOT_SYSTEM_PROMPT

# Load environment variables from .env file
load_dotenv()

class MaatriChatbot:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = None
        
        if self.api_key:
            self.configure_client()
            
    def configure_client(self, api_key=None):
        if api_key:
            self.api_key = api_key
            
        if not self.api_key:
            raise ValueError("Gemini API key is required to configure the chatbot.")
            
        genai.configure(api_key=self.api_key)
        # Using gemini-1.5-flash for fast and cost-effective responses
        self.model = genai.GenerativeModel(
            model_name='gemini-pro',
            system_instruction=CHATBOT_SYSTEM_PROMPT
        )
        
    def generate_response(self, user_message, chat_history=None):
        """
        Generate a response for the user message.
        chat_history: list of dicts like [{'role': 'user'/'model', 'text': '...'}]
        """
        if not self.model:
            raise RuntimeError("Chatbot model is not configured. Provide a valid Gemini API key.")
            
        # If history is provided, format it for Gemini's start_chat
        if chat_history:
            formatted_history = []
            for turn in chat_history:
                role = "user" if turn['role'] == 'user' else 'model'
                formatted_history.append({
                    'role': role,
                    'parts': [turn['text']]
                })
            
            chat = self.model.start_chat(history=formatted_history)
            response = chat.send_message(user_message)
            return response.text
        else:
            # Single-turn message
            response = self.model.generate_content(user_message)
            return response.text
