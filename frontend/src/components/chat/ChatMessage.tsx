import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatTurn } from '../../types';
import { Heart, User, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: ChatTurn;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 group`}>
      {/* Avatar Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? 'bg-gradient-to-tr from-primary-600 to-indigo-600 text-white'
            : 'bg-gradient-to-tr from-slate-900 to-slate-800 text-white border border-slate-700'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Heart className="w-5 h-5 text-accent-400" />}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? 'bg-primary-600 text-white rounded-tr-none font-medium'
            : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none leading-relaxed'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary-600 prose-strong:text-slate-900 prose-ul:my-1 prose-li:my-0.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>
        )}

        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-slate-50 border border-slate-200"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
