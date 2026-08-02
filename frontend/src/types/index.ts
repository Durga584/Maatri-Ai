export type RiskCategory = 'Low Risk' | 'Mid Risk' | 'High Risk';

export interface VitalsInputData {
  Age: number;
  SystolicBP: number;
  DiastolicBP: number;
  BS: number;
  BodyTemp: number;
  HeartRate: number;
}

export interface SHAPFeatureImpact {
  feature: string;
  value: number;
  importance: number;
  shap_value: number;
  direction: 'increases_risk' | 'decreases_risk';
}

export interface SHAPExplanationData {
  base_value: number;
  features: SHAPFeatureImpact[];
}

export interface RiskProbabilities {
  'Low Risk': number;
  'Mid Risk': number;
  'High Risk': number;
}

export interface PredictionResult {
  timestamp: string;
  input_vitals: VitalsInputData;
  risk_level: RiskCategory;
  confidence_score: number;
  risk_probabilities: RiskProbabilities;
  heuristic_reason: string;
  alerts: string[];
  recommendations: string[];
  shap_explanation: SHAPExplanationData;
  clinical_summary: string;
  disclaimer: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant' | 'model';
  text: string;
  timestamp?: string;
}

export interface ChatResponsePayload {
  timestamp: string;
  query: string;
  response: string;
  disclaimer: string;
}

export interface AssessmentRecord {
  id: number;
  timestamp: string;
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  bs: number;
  body_temp: number;
  heart_rate: number;
  risk_level: RiskCategory;
  confidence: number;
}

export interface AssessmentHistoryResponse {
  count: number;
  records: AssessmentRecord[];
}

export interface MonthlyTrend {
  month: string;
  LowRisk: number;
  MidRisk: number;
  HighRisk: number;
  total: number;
}

export interface FeatureImportanceSummary {
  feature: string;
  importance: number;
  description: string;
}

export interface AnalyticsData {
  total_assessments: number;
  risk_distribution: Record<RiskCategory, number>;
  averages: {
    avg_age: number;
    avg_systolic_bp: number;
    avg_diastolic_bp: number;
    avg_blood_sugar: number;
  };
  monthly_trends: MonthlyTrend[];
  feature_importance: FeatureImportanceSummary[];
}

export interface SupplementReminder {
  id?: string;
  name: string;
  timing: string;
  importance?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  gestational_week: number;
  trimester?: string;
  due_date?: string;
  blood_group?: string;
  allergies?: string[];
  obstetrician?: string;
  hospital?: string;
  emergency_contact?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
