import React, { useState } from 'react';
import { VitalsInputData, PredictionResult } from '../types';
import { predictionService } from '../services/predictionService';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { PredictionForm } from '../components/prediction/PredictionForm';
import { SHAPVisualization } from '../components/prediction/SHAPVisualization';
import { generatePredictionPDF } from '../utils/pdfGenerator';
import { Activity, Sparkles, AlertTriangle, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PredictionPage: React.FC = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handlePredict = async (vitals: VitalsInputData) => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await predictionService.predictRisk(vitals);
      setResult(data);
      showToast('Risk Analysis Complete', `Result: ${data.risk_level} (${(data.confidence_score * 100).toFixed(1)}% confidence)`, 'success');
    } catch (err) {
      showToast('Prediction Error', 'Failed to calculate maternal risk.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (result) {
      generatePredictionPDF(result);
      showToast('PDF Exported', 'Downloaded clinical PDF report.', 'info');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-600" />
          Maternal Health Risk Prediction Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter physiological parameters to run the trained Random Forest ML model, generate SHAP feature impact plots, and receive clinical guidelines.
        </p>
      </div>

      {/* Input Form Card */}
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Physiological Vitals Input</CardTitle>
        </CardHeader>
        <CardContent>
          <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Loading Indicator */}
      {isLoading && (
        <Card>
          <Loader text="Evaluating physiological vitals with Random Forest model & SHAP explainer..." size="lg" />
        </Card>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Main Risk Result Banner */}
          <div
            className={`p-6 rounded-3xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              result.risk_level === 'High Risk'
                ? 'bg-gradient-to-r from-rose-900 via-red-900 to-slate-900 text-white border-rose-700'
                : result.risk_level === 'Mid Risk'
                ? 'bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 text-white border-amber-700'
                : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-emerald-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge riskLevel={result.risk_level} size="lg" />
                <span className="text-xs font-bold opacity-80">AI Confidence: {(result.confidence_score * 100).toFixed(1)}%</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Maternal Condition: {result.risk_level}</h2>
              <p className="text-xs opacity-90 leading-relaxed max-w-2xl">{result.heuristic_reason}</p>
            </div>

            <Button variant="outline" size="md" onClick={handleDownloadPDF} className="bg-white/10 hover:bg-white/20 text-white border-white/20 shrink-0" leftIcon={<Download className="w-4 h-4" />}>
              Download PDF Report
            </Button>
          </div>

          {/* Probability Breakdown Bar */}
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>ML Category Probabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800">Low Risk</span>
                  <p className="text-lg font-black text-emerald-900">{((result.risk_probabilities['Low Risk'] || 0) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold text-amber-800">Mid Risk</span>
                  <p className="text-lg font-black text-amber-900">{((result.risk_probabilities['Mid Risk'] || 0) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-800">High Risk</span>
                  <p className="text-lg font-black text-rose-900">{((result.risk_probabilities['High Risk'] || 0) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Alerts & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts */}
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle className="text-rose-700">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Clinical Parameter Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {result.alerts && result.alerts.length > 0 ? (
                  result.alerts.map((alert, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-semibold flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{alert}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>All physiological vitals are within normal reference ranges.</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle>
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  Clinical Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0 mt-1.5"></div>
                    <span>{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* SHAP Visualization Component */}
          <Card>
            <CardContent>
              <SHAPVisualization shapData={result.shap_explanation} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
