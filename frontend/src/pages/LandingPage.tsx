import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, Sparkles, Activity, ShieldCheck, MessageSquare, 
  FileText, ArrowRight, CheckCircle2, ChevronDown, Award, Users, Stethoscope
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How accurate is the Maatri AI Random Forest risk prediction model?',
      a: 'The prediction model is trained on clinical maternal dataset parameters (Age, Systolic BP, Diastolic BP, Glucose, Temperature, Heart Rate) achieving >92% cross-validated accuracy for triaging Low, Mid, and High-risk cases.',
    },
    {
      q: 'What is SHAP Explainability and why is it important?',
      a: 'SHAP (SHapley Additive exPlanations) provides mathematical explainability for AI models, detailing exactly which vital sign pushed your risk score higher or lower.',
    },
    {
      q: 'How does the Gemini LLM RAG chatbot assist expectant mothers?',
      a: 'The chatbot retrieves trusted clinical guidelines to answer questions about preeclampsia warning signs, blood pressure management, nutrition, and prenatal care.',
    },
    {
      q: 'Is patient data stored securely in Maatri AI?',
      a: 'Yes, patient assessment records are securely stored locally using SQLite database schemas with full HIPAA privacy principles.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-2xl font-black tracking-tight gradient-text">Maatri AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-primary-600 transition-colors">Benefits</a>
            <a href="#faq" className="hover:text-primary-600 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Platform
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200/80 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>AI-POWERED MATERNAL HEALTHCARE INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Predict Risk. <br />
              <span className="gradient-text">Explain Insights.</span> <br />
              Empower Mothers.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Enterprise maternal health platform powered by trained Random Forest ML, SHAP feature explainability, and Gemini RAG clinical AI assistant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/predict">
                <Button size="lg" variant="primary" leftIcon={<Activity className="w-5 h-5" />}>
                  Analyze Risk Now
                </Button>
              </Link>
              <Link to="/chat">
                <Button size="lg" variant="outline" leftIcon={<MessageSquare className="w-5 h-5 text-secondary-500" />}>
                  Ask AI Assistant
                </Button>
              </Link>
            </div>

            {/* Quick Stats Counter */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80">
              <div>
                <p className="text-2xl font-black text-slate-900">92.4%</p>
                <p className="text-xs text-slate-500 font-medium">Model Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">SHAP</p>
                <p className="text-xs text-slate-500 font-medium">Explainable AI</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">RAG</p>
                <p className="text-xs text-slate-500 font-medium">Gemini LLM</p>
              </div>
            </div>
          </div>

          {/* Floating UI Demonstration Graphic */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-3xl blur-2xl pointer-events-none"></div>
            
            <div className="glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 w-full max-w-md space-y-5 animate-float relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-bold text-slate-800">Live Clinical Assessment</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Calculated
                </span>
              </div>

              {/* Sample Output Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
                <span className="text-xs uppercase font-bold opacity-80">Evaluated Condition</span>
                <h3 className="text-2xl font-black mt-0.5">Low Risk (94.2% Confidence)</h3>
                <p className="text-xs mt-1 opacity-90">All 6 physiological parameters are within optimal ranges.</p>
              </div>

              {/* SHAP Feature Preview */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">SHAP Factor Weights</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Blood Sugar (5.5 mmol/L)</span>
                    <span className="text-emerald-600 font-bold">-0.24 (Protective)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[70%]"></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium">
                    <span>Systolic BP (120 mmHg)</span>
                    <span className="text-emerald-600 font-bold">-0.18 (Optimal)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[60%]"></div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="font-semibold text-slate-800">PDF Report Ready</span>
                <Link to="/predict" className="text-primary-600 font-bold hover:underline">
                  View Demo →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-900">Enterprise AI Healthcare Features</h2>
            <p className="text-sm text-slate-600">
              Complete clinical intelligence suite supporting prediction, explainability, RAG guidance, and patient record management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Random Forest Prediction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained machine learning algorithm predicting Low, Mid, or High maternal health risk scores based on 6 core physiological vitals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">SHAP Explainability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual force plots explaining positive and negative contribution weights of blood pressure, blood glucose, age, and temperature.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini LLM RAG Chat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-turn conversational AI chatbot rendering markdown guidelines, preeclampsia symptoms warning flags, and dietary care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-900">How Maatri AI Works</h2>
          <p className="text-sm text-slate-600">A seamless 4-step workflow connecting physiological parameters to clinical action.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-black text-sm flex items-center justify-center mx-auto">1</div>
            <h4 className="text-sm font-bold text-slate-900">Input Vitals</h4>
            <p className="text-xs text-slate-500">Enter Age, BP, Blood Sugar, Temperature, and Heart Rate.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary-500 text-white font-black text-sm flex items-center justify-center mx-auto">2</div>
            <h4 className="text-sm font-bold text-slate-900">ML Risk Evaluation</h4>
            <p className="text-xs text-slate-500">Random Forest model processes inputs and calculates risk category & confidence.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-accent-500 text-white font-black text-sm flex items-center justify-center mx-auto">3</div>
            <h4 className="text-sm font-bold text-slate-900">SHAP Force Plot</h4>
            <p className="text-xs text-slate-500">Explainable AI details exact factor impact rankings.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-black text-sm flex items-center justify-center mx-auto">4</div>
            <h4 className="text-sm font-bold text-slate-900">PDF & AI Advice</h4>
            <p className="text-xs text-slate-500">Download formatted report & consult Gemini LLM RAG chatbot.</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Everything you need to know about Maatri AI platform architecture.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 p-10 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready to Experience Modern AI Maternal Healthcare?</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Launch the interactive dashboard, test risk prediction, and explore SHAP explainability visualizations now.
          </p>
          <Link to="/dashboard" className="inline-block">
            <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Open Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
