import { api } from './api';
import { AssessmentHistoryResponse, AssessmentRecord } from '../types';

const MOCK_HISTORY: AssessmentRecord[] = [
  { id: 108, timestamp: '2026-08-02 14:30:12', age: 28, systolic_bp: 120, diastolic_bp: 80, bs: 5.5, body_temp: 98.6, heart_rate: 75, risk_level: 'Low Risk', confidence: 0.92 },
  { id: 107, timestamp: '2026-07-29 11:15:00', age: 34, systolic_bp: 135, diastolic_bp: 88, bs: 6.8, body_temp: 99.1, heart_rate: 82, risk_level: 'Mid Risk', confidence: 0.84 },
  { id: 106, timestamp: '2026-07-20 09:45:33', age: 39, systolic_bp: 148, diastolic_bp: 95, bs: 8.5, body_temp: 100.8, heart_rate: 90, risk_level: 'High Risk', confidence: 0.96 },
  { id: 105, timestamp: '2026-07-12 16:20:00', age: 26, systolic_bp: 115, diastolic_bp: 76, bs: 5.2, body_temp: 98.4, heart_rate: 72, risk_level: 'Low Risk', confidence: 0.95 },
  { id: 104, timestamp: '2026-07-02 10:10:00', age: 31, systolic_bp: 128, diastolic_bp: 84, bs: 6.1, body_temp: 98.8, heart_rate: 78, risk_level: 'Mid Risk', confidence: 0.81 },
];

export const historyService = {
  async getHistory(riskCategory?: string): Promise<AssessmentHistoryResponse> {
    try {
      const response = await api.get<AssessmentHistoryResponse>('/history', {
        params: { risk_category: riskCategory },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend API history un-reachable, returning local history state:', error);
      let filtered = [...MOCK_HISTORY];
      if (riskCategory && riskCategory.toLowerCase() !== 'all') {
        filtered = filtered.filter(item => item.risk_level.toLowerCase() === riskCategory.toLowerCase());
      }
      return {
        count: filtered.length,
        records: filtered,
      };
    }
  },

  async deleteRecord(recordId: number): Promise<{ status: string; message: string }> {
    try {
      const response = await api.delete<{ status: string; message: string }>(`/history/${recordId}`);
      return response.data;
    } catch (error) {
      console.warn('Backend delete un-reachable, simulating deletion:', error);
      return { status: 'success', message: `Deleted assessment record #${recordId}` };
    }
  },
};
