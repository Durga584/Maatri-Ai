import React from 'react';
import { AssessmentRecord } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Download, Calendar, User, Activity, Heart, Flame, Scale } from 'lucide-react';
import { generatePredictionPDF } from '../../utils/pdfGenerator';

interface HistoryDetailModalProps {
  record: AssessmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ record, isOpen, onClose }) => {
  if (!record) return null;

  const handleDownload = () => {
    generatePredictionPDF({
      timestamp: record.timestamp,
      input_vitals: {
        Age: record.age,
        SystolicBP: record.systolic_bp,
        DiastolicBP: record.diastolic_bp,
        BS: record.bs,
        BodyTemp: record.body_temp,
        HeartRate: record.heart_rate,
      },
      risk_level: record.risk_level,
      confidence_score: record.confidence,
      risk_probabilities: {
        'Low Risk': record.risk_level === 'Low Risk' ? 0.9 : 0.1,
        'Mid Risk': record.risk_level === 'Mid Risk' ? 0.8 : 0.1,
        'High Risk': record.risk_level === 'High Risk' ? 0.95 : 0.05,
      },
      heuristic_reason: `Record #${record.id} historical vital values assessment.`,
      alerts: record.risk_level === 'High Risk' ? ['Elevated BP and/or glucose level logged.'] : [],
      recommendations: [
        'Maintain daily prenatal hydration (2.5L - 3.0L).',
        'Follow obstetrician recommended checkups.',
        'Log blood pressure readings twice daily.',
      ],
      shap_explanation: { base_value: 0.33, features: [] },
      clinical_summary: `Historical assessment record #${record.id}`,
      disclaimer: 'Disclaimer: Educational guidance only.',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assessment Record #${record.id}`} description={record.timestamp}>
      <div className="space-y-6">
        {/* Risk Badge Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Evaluated Condition</span>
            <Badge riskLevel={record.risk_level} size="lg" className="mt-1" />
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 block">AI Confidence Score</span>
            <span className="text-lg font-bold text-slate-900">{(record.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <User className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Age</span>
            <p className="text-sm font-bold text-slate-800">{record.age} yrs</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <Activity className="w-4 h-4 text-primary-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Systolic BP</span>
            <p className="text-sm font-bold text-slate-800">{record.systolic_bp} mmHg</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <Activity className="w-4 h-4 text-secondary-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Diastolic BP</span>
            <p className="text-sm font-bold text-slate-800">{record.diastolic_bp} mmHg</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <Scale className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Blood Sugar</span>
            <p className="text-sm font-bold text-slate-800">{record.bs} mmol/L</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <Flame className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Body Temp</span>
            <p className="text-sm font-bold text-slate-800">{record.body_temp} °F</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-center">
            <Heart className="w-4 h-4 text-accent-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">Heart Rate</span>
            <p className="text-sm font-bold text-slate-800">{record.heart_rate} bpm</p>
          </div>
        </div>

        {/* Export PDF Button */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Export PDF Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};
