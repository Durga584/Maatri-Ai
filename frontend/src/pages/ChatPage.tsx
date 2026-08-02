import React, { useState, useRef, useEffect } from 'react';
import { ChatTurn } from '../types';
import { chatService } from '../services/chatService';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { 
  MessageSquare, Plus, Trash2, Sparkles, Heart, ShieldAlert, Bot
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      role: 'assistant',
      text: '### 🤰 Hello! I am Maatri AI Maternal Clinical Assistant.\n\nI can answer questions regarding:\n* **Blood Pressure Management** & Preeclampsia warnings\n* **Gestational Diabetes & Glucose Nutrition**\n* **Prenatal Hydration & Supplements** (Folic Acid, Iron, Calcium)\n\nHow can I support your pregnancy wellness today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userTurn: ChatTurn = {
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userTurn]);
    setIsLoading(true);

    try {
      const res = await chatService.sendMessage(text, messages);
      const assistantTurn: ChatTurn = {
        role: 'assistant',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantTurn]);
    } catch (err) {
      showToast('Chat Assistant Error', 'Could not retrieve AI response.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: '### 🤰 New Conversation Started\nAsk any question regarding maternal vitals, diet, or pregnancy guidelines.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Threads List */}
      <div className="hidden md:flex flex-col w-64 glass-card rounded-2xl p-4 border border-slate-200/80 shrink-0">
        <Button
          variant="primary"
          size="sm"
          onClick={handleNewChat}
          className="w-full mb-4"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Conversation
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">Recent Threads</p>
          <button className="w-full text-left p-2.5 rounded-xl bg-primary-50 text-primary-900 border border-primary-100 font-medium flex items-center gap-2 truncate">
            <MessageSquare className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate">Current Consultation</span>
          </button>
          <button className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 truncate transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Blood Pressure & Preeclampsia</span>
          </button>
          <button className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2 truncate transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Gestational Nutrition</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="w-full text-rose-600 hover:bg-rose-50 text-xs"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear History
          </Button>
        </div>
      </div>

      {/* Main Chat Interface Window */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl border border-slate-200/80 overflow-hidden shadow-xl">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-secondary-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Gemini RAG AI Healthcare Assistant
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h3>
              <p className="text-[11px] text-slate-500">Retrieval-Augmented Generation • Clinical Guidelines Mode</p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={handleNewChat} className="md:hidden">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 animate-pulse p-3 rounded-2xl bg-white border border-slate-100 max-w-xs">
              <Sparkles className="w-4 h-4 text-primary-600 animate-spin" />
              <span>Gemini is reading clinical documents & generating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
