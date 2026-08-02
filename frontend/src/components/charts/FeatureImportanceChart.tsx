import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SHAPFeatureImpact } from '../../types';

interface FeatureImportanceChartProps {
  features: SHAPFeatureImpact[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ features }) => {
  const data = features.map((f) => ({
    name: f.feature,
    value: parseFloat((f.shap_value || f.importance).toFixed(3)),
    direction: f.direction,
    rawVal: f.value,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} width={90} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              color: '#FFF',
              border: 'none',
              fontSize: '12px',
            }}
            formatter={(val: number, _, item) => [
              `SHAP Impact: ${val > 0 ? '+' : ''}${val} (${item.payload.direction === 'increases_risk' ? 'Increases Risk' : 'Lowers Risk'})`,
              `Feature Value: ${item.payload.rawVal}`,
            ]}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? '#F43F5E' : '#10B981'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
