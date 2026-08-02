import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generatePredictionPDF } from '../utils/pdfGenerator';
import { FileText, Download, Printer, CheckCircle2, HeartPulse, Sparkles } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState(user?.name || 'Ananya Sharma');
  const [sysBp, setSysBp] = useState(120);
  const [diaBp, setDiaBp] = useState(80);
  const [sugar, setSugar] = useState(5.5);
  const [riskLevel, setRiskLevel] = useState<'Low Risk' | 'Mid Risk' | 'High Risk'>('Low Risk');

  const handleDownload = () => {
    generatePredictionPDF({
      timestamp: new Date().toISOString(),
      input_vitals: {
        Age: 28,
        SystolicBP: sysBp,
        DiastolicBP: diaBp,
        BS: sugar,
        BodyTemp: 98.6,
        HeartRate: 75,
      },
      risk_level: riskLevel,
      confidence_score: 0.94,
      risk_probabilities: { 'Low Risk': 0.94, 'Mid Risk': 0.04, 'High Risk': 0.02 },
      heuristic_reason: 'Generated via Maatri AI Report Engine.',
      alerts: riskLevel === 'High Risk' ? ['Elevated BP/Sugar alert logged.'] : [],
      recommendations: [
        'Maintain daily hydration target (2.5L to 3L).',
        'Follow obstetrician recommended antenatal checkups.',
        'Log blood pressure readings twice daily.',
      ],
      shap_explanation: { base_value: 0.33, features: [] },
      clinical_summary: 'Full Clinical Maternal Report',
      disclaimer: 'Disclaimer: Educational guidance only.',
    }, patientName);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-600" />
            Clinical PDF Report Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate, preview, and download formal maternal health clinical reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-4 h-4" />}>
            Print Page
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Interactive Report Document Preview */}
      <Card className="max-w-4xl mx-auto space-y-6 p-8 border border-slate-200/90 shadow-xl bg-white text-slate-900">
        {/* Header Document Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide">MAATRI AI CLINICAL REPORT</h2>
              <p className="text-xs opacity-80">Maternal Healthcare Intelligence Platform</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full border border-white/20">
            OFFICIAL REPORT
          </span>
        </div>

        {/* Patient Details Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase block">Patient Name</span>
            <span className="font-bold text-slate-900">{patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase block">Gestational Week</span>
            <span className="font-bold text-slate-900">Week {user?.gestational_week || 26}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase block">Report Date</span>
            <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold uppercase block">Physician</span>
            <span className="font-bold text-slate-900">{user?.obstetrician || 'Dr. Sunita Kapoor'}</span>
          </div>
        </div>

        {/* Vitals Summary Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900">1. Physiological Vitals Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold uppercase text-slate-600">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Measured Value</th>
                  <th className="p-3">Clinical Reference Range</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-semibold">Systolic BP</td>
                  <td className="p-3">{sysBp} mmHg</td>
                  <td className="p-3">70 - 130 mmHg</td>
                  <td className="p-3 text-emerald-600 font-bold">Optimal</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Diastolic BP</td>
                  <td className="p-3">{diaBp} mmHg</td>
                  <td className="p-3">40 - 85 mmHg</td>
                  <td className="p-3 text-emerald-600 font-bold">Optimal</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Blood Sugar (BS)</td>
                  <td className="p-3">{sugar} mmol/L</td>
                  <td className="p-3">&lt; 5.6 mmol/L (Fasting)</td>
                  <td className="p-3 text-emerald-600 font-bold">Normal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Evaluation Section */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">AI Evaluated Condition</span>
          <h4 className="text-lg font-black text-emerald-900">{riskLevel} (Confidence Score: 94.2%)</h4>
          <p className="text-xs text-emerald-800">All physiological parameters demonstrate low risk profile.</p>
        </div>

        {/* Recommendations */}
        <div className="space-y-2 text-xs">
          <h3 className="text-sm font-bold text-slate-900">2. Clinical Care Guidelines</h3>
          <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
            <li>Maintain 2.5L to 3.0L daily hydration to support amniotic fluid levels.</li>
            <li>Prioritize iron and folic-acid dense foods (spinach, beans, citrus).</li>
            <li>Log morning blood pressure readings and conduct regular checkups.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
