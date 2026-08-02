import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, MessageSquare, History, 
  BarChart3, FileText, Settings, User, Heart, Sparkles, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Risk Prediction', path: '/predict', icon: Activity, badge: 'AI' },
    { label: 'AI Chat Assistant', path: '/chat', icon: MessageSquare, badge: 'RAG' },
    { label: 'Prediction History', path: '/history', icon: History },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-secondary-100 text-secondary-700 group-aria-[current=page]:bg-white/20 group-aria-[current=page]:text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* AI Healthcare Feature Highlights Widget */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-secondary-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-secondary-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-secondary-400 animate-spin" />
            <span>SHAP Engine</span>
          </div>
          <h4 className="text-xs font-extrabold text-white leading-snug">Explainable AI Risk Factor Analysis</h4>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Real-time SHAP force plots show exact blood pressure & glucose contribution.
          </p>
          <NavLink
            to="/predict"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-secondary-300 hover:text-white transition-colors"
          >
            <span>Run Assessment</span>
            <ChevronRight className="w-3 h-3" />
          </NavLink>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="pt-4 border-t border-slate-200/60 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>FastAPI REST Connected</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">v1.0.0 • SQLite Ready</p>
      </div>
    </aside>
  );
};
