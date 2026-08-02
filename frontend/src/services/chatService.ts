import { api } from './api';
import { ChatTurn, ChatResponsePayload } from '../types';

export const chatService = {
  async sendMessage(message: string, history: ChatTurn[] = []): Promise<ChatResponsePayload> {
    try {
      const response = await api.post<ChatResponsePayload>('/chat', { message, history });
      return response.data;
    } catch (error) {
      console.warn('Backend API un-reachable for chat, using client fallback:', error);
      
      const lower = message.toLowerCase();
      let reply = '';

      if (lower.includes('bp') || lower.includes('blood pressure')) {
        reply = `### 🩺 Blood Pressure Guidelines\n* **Target Range**: Maintain Systolic < 120 mmHg and Diastolic < 80 mmHg.\n* **Warning Flags**: Persistent headaches, visual flashes, or right-upper quadrant abdominal pain.\n* **Action Plan**: Rest on your left side to enhance uteroplacental blood flow and log BP twice daily.`;
      } else if (lower.includes('sugar') || lower.includes('diabetes') || lower.includes('diet')) {
        reply = `### 🥗 Gestational Nutrition & Sugar Care\n1. **Complex Carbs**: Choose oats, quinoa, and whole grains.\n2. **Post-Meal Walk**: A 10 to 15-minute gentle walk reduces postprandial glucose spikes.\n3. **Folic Acid & Iron**: Consume spinach, lentils, and citrus fruits daily.`;
      } else {
        reply = `### 🤰 Maatri AI Clinical Assistant\nThank you for reaching out regarding: *"${message}"*.\n\nEnsure regular antenatal checkups, maintain 2.5L-3L hydration daily, and track your vital signs. If you experience severe cramping or bleeding, seek immediate emergency medical care.\n\n--- \n*Educational guidance only.*`;
      }

      return {
        timestamp: new Date().toISOString(),
        query: message,
        response: reply,
        disclaimer: 'Disclaimer: Educational guidance only.',
      };
    }
  },
};
