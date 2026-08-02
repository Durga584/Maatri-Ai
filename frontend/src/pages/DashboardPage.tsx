import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { historyService } from '../services/historyService';
import { analyticsService } from '../services/analyticsService';
import { AssessmentRecord, AnalyticsData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { PredictionTrendsChart } from '../components/charts/PredictionTrendsChart';
import { 
  Activity, HeartPulse, Sparkles, MessageSquare, FileText, 
  History, ArrowRight, ShieldAlert, Plus, Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, analRes] = await Promise.all([
          historyService.getHistory(),
          analyticsService.getAnalytics(),
        ]);
        setHistory(histRes.records);
        setAnalytics(analRes);
      } catch (err) {
        console.error('Dashboard data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestRecord = history.length > 0 ? history[0] : null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestational Care • Week {user?.gestational_week || 26}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.name || 'Ananya'}</h1>
          <p className="text-xs text-slate-300">Your AI maternal health monitoring engine is active and ready.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/predict">
            <Button variant="secondary" size="md" leftIcon={<Activity className="w-4 h-4" />}>
              New Prediction
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="accent" size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Vital Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Latest Risk Assessment</span>
            <Activity className="w-4 h-4 text-primary-600" />
          </div>
          {latestRecord ? (
            <div>
              <Badge riskLevel={latestRecord.risk_level} size="lg" className="mt-1" />
              <p className="text-xs text-slate-500 mt-2 font-medium">Confidence: {(latestRecord.confidence * 100).toFixed(1)}%</p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-400">No predictions yet</p>
          )}
        </Card>

        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Systolic / Diastolic BP</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {latestRecord ? `${latestRecord.systolic_bp} / ${latestRecord.diastolic_bp}` : '120 / 80'}{' '}
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </p>
          <Progress value={latestRecord && latestRecord.systolic_bp > 130 ? 80 : 45} color={latestRecord && latestRecord.systolic_bp > 130 ? 'rose' : 'emerald'} height="sm" />
        </Card>

        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Blood Glucose (BS)</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {latestRecord ? latestRecord.bs : '5.5'}{' '}
            <span className="text-xs font-semibold text-slate-500">mmol/L</span>
          </p>
          <Progress value={latestRecord && latestRecord.bs > 7.0 ? 85 : 40} color={latestRecord && latestRecord.bs > 7.0 ? 'amber' : 'emerald'} height="sm" />
        </Card>

        <Card hoverable className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Assessments</span>
            <History className="w-4 h-4 text-secondary-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{analytics?.total_assessments || history.length || 0}</p>
          <p className="text-xs text-emerald-600 font-bold">SQLite Persisted</p>
        </Card>
      </div>

      {/* Main Grid: Charts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Prediction Trends */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle>
              <Activity className="w-5 h-5 text-primary-600" />
              Maternal Risk Assessment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.monthly_trends && <PredictionTrendsChart trends={analytics.monthly_trends} />}
          </CardContent>
        </Card>

        {/* Right Col: Risk Distribution Donut */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>
              <Sparkles className="w-5 h-5 text-secondary-500" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.risk_distribution && <RiskDistributionChart distribution={analytics.risk_distribution} />}
          </CardContent>
        </Card>
      </div>

      {/* AI Clinical Insights & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Suggestions Box */}
        <Card className="lg:col-span-1 space-y-4 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-emerald-50/40 border-indigo-200/60">
          <CardHeader>
            <CardTitle className="text-indigo-900">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
              Personalized AI Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <p className="font-bold text-slate-900">💧 Prenatal Hydration Target</p>
              <p className="text-slate-600">Drink at least 2.5 Liters of water daily to maintain optimal amniotic fluid levels.</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-sm space-y-1">
              <p className="font-bold text-slate-900">🥗 Post-Meal Glucose Control</p>
              <p className="text-slate-600">Perform a gentle 10-minute walk after meals to reduce postprandial blood sugar spikes.</p>
            </div>

            <Link to="/chat" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1">
              <span>Ask Gemini RAG Chatbot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent History Table Preview */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle>
              <History className="w-5 h-5 text-slate-700" />
              Recent Patient Predictions
            </CardTitle>
            <Link to="/history" className="text-xs font-bold text-primary-600 hover:underline">
              View All History →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Vitals (BP / BS)</th>
                    <th className="px-3 py-2">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {history.slice(0, 4).map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2 font-mono font-bold">#{rec.id}</td>
                      <td className="px-3 py-2 text-slate-600">{rec.timestamp}</td>
                      <td className="px-3 py-2 text-slate-700">BP {rec.systolic_bp}/{rec.diastolic_bp} • BS {rec.bs}</td>
                      <td className="px-3 py-2">
                        <Badge riskLevel={rec.risk_level} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
