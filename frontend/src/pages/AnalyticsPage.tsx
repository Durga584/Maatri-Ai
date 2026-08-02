import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { PredictionTrendsChart } from '../components/charts/PredictionTrendsChart';
import { BarChart3, Activity, Sparkles, Scale, HeartPulse, User } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getAnalytics()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <Card>
        <Loader text="Computing statistical clinical analytics..." />
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          Maternal Healthcare Intelligence Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Population health analytics, monthly trends, and SHAP aggregate feature importance rankings.
        </p>
      </div>

      {/* Metric Averages Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Average Age</span>
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{data.averages.avg_age} <span className="text-xs font-normal text-slate-500">yrs</span></p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Systolic BP</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{data.averages.avg_systolic_bp} <span className="text-xs font-normal text-slate-500">mmHg</span></p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Diastolic BP</span>
            <HeartPulse className="w-4 h-4 text-secondary-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{data.averages.avg_diastolic_bp} <span className="text-xs font-normal text-slate-500">mmHg</span></p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Avg Blood Sugar</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{data.averages.avg_blood_sugar} <span className="text-xs font-normal text-slate-500">mmol/L</span></p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <CardTitle>
              <Activity className="w-5 h-5 text-primary-600" />
              Monthly Assessment Volume & Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionTrendsChart trends={data.monthly_trends} />
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>
              <Sparkles className="w-5 h-5 text-secondary-500" />
              Risk Distribution Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart distribution={data.risk_distribution} />
          </CardContent>
        </Card>
      </div>

      {/* Feature Importance Table */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle>
            <Sparkles className="w-5 h-5 text-primary-600" />
            SHAP Aggregate Feature Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.feature_importance.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.feature}</span>
                  <span className="font-mono font-bold text-primary-600">Weight: {item.importance}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-500 h-full rounded-full" style={{ width: `${item.importance * 2}%` }} />
                </div>
                <p className="text-[11px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
