import React from 'react';
import { HeartPulse, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-primary-600" />
          <span className="font-bold text-slate-800">Maatri AI</span>
          <span>© 2026 Maternal Healthcare Intelligence Platform.</span>
        </div>

        <div className="flex items-center gap-2 text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 max-w-2xl text-center md:text-left">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span className="text-[11px] leading-tight">
            Medical Disclaimer: Educational & decision-support purposes only. Always consult a qualified obstetrician for diagnosis.
          </span>
        </div>
      </div>
    </footer>
  );
};
