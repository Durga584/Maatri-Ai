import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RiskCategory } from '../../types';

interface RiskDistributionChartProps {
  distribution: Record<RiskCategory, number>;
}

const COLORS = {
  'Low Risk': '#10B981', // Emerald
  'Mid Risk': '#F59E0B', // Amber
  'High Risk': '#F43F5E', // Rose
};

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ distribution }) => {
  const data = [
    { name: 'Low Risk', value: distribution['Low Risk'] || 0 },
    { name: 'Mid Risk', value: distribution['Mid Risk'] || 0 },
    { name: 'High Risk', value: distribution['High Risk'] || 0 },
  ];

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      {total === 0 ? (
        <div className="text-center text-slate-400 text-xs py-8">No assessment records to display distribution.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name as RiskCategory]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                color: '#FFF',
                border: 'none',
                fontSize: '12px',
              }}
              formatter={(val: number) => [`${val} assessments (${((val / total) * 100).toFixed(1)}%)`, 'Count']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
