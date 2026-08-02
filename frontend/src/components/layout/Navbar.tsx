import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, Search, User, LogOut, Menu, X, 
  Activity, Sparkles, HeartPulse, ChevronDown, ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Area: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight gradient-text">Maatri AI</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-full border border-secondary-200/60 ml-2">
                Clinical Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center Area: Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search risk metrics, patient records, or AI guidance..."
              className="w-full bg-slate-100/70 hover:bg-slate-100 focus:bg-white border border-slate-200/70 focus:border-primary-400 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right Area: System Status, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick CTA */}
          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-primary-500/20 transition-all hover:scale-[1.02]"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Assess Risk</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Clinical Alerts</h4>
                  <span className="text-[10px] text-accent-600 font-semibold bg-accent-50 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="py-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <p className="font-semibold">✅ Vital Signs Monitor Active</p>
                    <p className="text-[11px] text-emerald-600 mt-0.5">All 6 clinical parameters calibrated with Random Forest ML engine.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                    <p className="font-semibold">✨ Gemini RAG Online</p>
                    <p className="text-[11px] text-indigo-600 mt-0.5">AI Chatbot initialized with maternal health guidelines.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user ? user.name : 'Mother Care'}</p>
                <p className="text-[10px] text-slate-500">Week {user?.gestational_week || 24} • Patient</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Ananya Sharma'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'patient@maatri.ai'}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-primary-500" />
                  <span>My Health Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-secondary-500" />
                  <span>Settings & Security</span>
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors mt-1 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
