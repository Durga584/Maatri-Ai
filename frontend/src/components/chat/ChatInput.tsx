import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const SUGGESTED_PROMPTS = [
  'What is normal blood pressure during 2nd trimester?',
  'Recommended diet for elevated blood sugar in pregnancy',
  'What are warning signs of preeclampsia?',
  'Safe prenatal supplements & folic acid dosage',
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggested Prompts Pill List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary-500" />
          Suggested:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(prompt)}
            disabled={isLoading}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100/80 hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200/80 hover:border-primary-200 transition-all shrink-0 whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Maatri AI clinical assistant about symptoms, diet, vitals, or care..."
          disabled={isLoading}
          className="w-full bg-white border border-slate-300 focus:border-primary-500 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
