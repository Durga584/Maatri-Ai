import React from 'react';
import { SHAPExplanationData } from '../../types';
import { FeatureImportanceChart } from '../charts/FeatureImportanceChart';
import { ShieldAlert, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface SHAPVisualizationProps {
  shapData: SHAPExplanationData;
}

export const SHAPVisualization: React.FC<SHAPVisualizationProps> = ({ shapData }) => {
  if (!shapData || !shapData.features) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-600" />
            Explainable AI (SHAP) Feature Force Analysis
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Quantifies how each patient vital sign pushed the Random Forest ML prediction towards higher or lower risk.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
          Base Value: {shapData.base_value.toFixed(2)}
        </span>
      </div>

      {/* SHAP Chart */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
        <FeatureImportanceChart features={shapData.features} />
      </div>

      {/* Feature Impact List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shapData.features.map((feat, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
              feat.direction === 'increases_risk'
                ? 'bg-rose-50/50 border-rose-200/80 text-rose-950'
                : 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                feat.direction === 'increases_risk' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {feat.direction === 'increases_risk' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{feat.feature}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 border text-slate-700">
                  Value: {feat.value}
                </span>
              </div>
              <p className="text-[11px] mt-1 opacity-90 leading-tight">
                {feat.direction === 'increases_risk'
                  ? `Pushes prediction towards higher maternal risk by +${Math.abs(feat.shap_value).toFixed(2)} points.`
                  : `Provides protective effect, lowering predicted risk by -${Math.abs(feat.shap_value).toFixed(2)} points.`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
