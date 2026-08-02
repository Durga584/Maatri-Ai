import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyTrend } from '../../types';

interface PredictionTrendsChartProps {
  trends: MonthlyTrend[];
}

export const PredictionTrendsChart: React.FC<PredictionTrendsChartProps> = ({ trends }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lowRiskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="midRiskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="highRiskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              color: '#FFF',
              border: 'none',
              fontSize: '12px',
            }}
          />
          <Area type="monotone" dataKey="LowRisk" name="Low Risk" stroke="#10B981" fillOpacity={1} fill="url(#lowRiskGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="MidRisk" name="Mid Risk" stroke="#F59E0B" fillOpacity={1} fill="url(#midRiskGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="HighRisk" name="High Risk" stroke="#F43F5E" fillOpacity={1} fill="url(#highRiskGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
