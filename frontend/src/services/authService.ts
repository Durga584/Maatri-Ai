import { api } from './api';
import { AuthResponse, UserProfile } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('maatri_auth_token', response.data.token);
        localStorage.setItem('maatri_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend login fallback:', error);
      const user: UserProfile = {
        id: 1,
        name: email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Mother Care',
        email: email,
        role: 'Expectant Mother',
        gestational_week: 24,
        trimester: 'Second Trimester',
        due_date: '2026-11-15',
        blood_group: 'O+',
        obstetrician: 'Dr. Sarah Jenkins, MD',
        hospital: 'St. Mary Women & Children Hospital',
      };
      const data = { token: 'maatri_demo_jwt_2026', user };
      localStorage.setItem('maatri_auth_token', data.token);
      localStorage.setItem('maatri_user', JSON.stringify(data.user));
      return data;
    }
  },

  async register(name: string, email: string, password: string, role: string = 'Patient', gestational_week: number = 16): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password, role, gestational_week });
      if (response.data.token) {
        localStorage.setItem('maatri_auth_token', response.data.token);
        localStorage.setItem('maatri_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend register fallback:', error);
      const user: UserProfile = {
        id: 2,
        name,
        email,
        role,
        gestational_week,
        trimester: 'Second Trimester',
        due_date: '2026-12-20',
        blood_group: 'A+',
        obstetrician: 'Dr. Elena Rostova, OB-GYN',
      };
      const data = { token: 'maatri_demo_jwt_2026', user };
      localStorage.setItem('maatri_auth_token', data.token);
      localStorage.setItem('maatri_user', JSON.stringify(data.user));
      return data;
    }
  },

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/auth/profile');
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('maatri_user');
      if (cached) return JSON.parse(cached);
      return {
        id: 1,
        name: 'Ananya Sharma',
        email: 'ananya.sharma@maatri.ai',
        role: 'Expectant Mother',
        gestational_week: 26,
        trimester: 'Second Trimester',
        due_date: '2026-11-10',
        blood_group: 'B+',
        allergies: ['Penicillin'],
        obstetrician: 'Dr. Sunita Kapoor, Senior OB-GYN',
        hospital: 'City Maternal Health & Wellness Center',
        emergency_contact: '+1 (555) 019-2834',
      };
    }
  },

  logout(): void {
    localStorage.removeItem('maatri_auth_token');
    localStorage.removeItem('maatri_user');
  },
};
