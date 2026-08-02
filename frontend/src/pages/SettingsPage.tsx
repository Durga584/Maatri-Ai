import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Settings, Bell, Globe, Moon, Sun, ShieldCheck, Save, Palette } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState('en');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [bpThreshold, setBpThreshold] = useState(135);
  const [sugarThreshold, setSugarThreshold] = useState(7.0);
  const { showToast } = useToast();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Application preferences updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-600" />
          Application Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize UI theme, clinical alert thresholds, notifications, and language.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* Appearance Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>
              <Palette className="w-5 h-5 text-primary-600" />
              Theme & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-xl border text-center transition-all ${
                  themeMode === 'light'
                    ? 'bg-primary-50 border-primary-500 text-primary-900 font-bold ring-2 ring-primary-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                <span className="text-xs">Light Theme (Default)</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-4 rounded-xl border text-center transition-all ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-white font-bold ring-2 ring-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('system')}
                className={`p-4 rounded-xl border text-center transition-all ${
                  themeMode === 'system'
                    ? 'bg-primary-50 border-primary-500 text-primary-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-5 h-5 mx-auto mb-2 text-secondary-500" />
                <span className="text-xs">System Preference</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Threshold Alerts Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>
              <Bell className="w-5 h-5 text-secondary-500" />
              Clinical Alerts & Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Systolic BP Warning Trigger (mmHg)"
                type="number"
                value={bpThreshold}
                onChange={(e) => setBpThreshold(Number(e.target.value))}
              />
              <Input
                label="Blood Sugar Warning Trigger (mmol/L)"
                type="number"
                step="0.1"
                value={sugarThreshold}
                onChange={(e) => setSugarThreshold(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-800">Email Clinical Risk Reports</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Card */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>
              <Globe className="w-5 h-5 text-accent-500" />
              Language & Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">Select Platform Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="en">English (Clinical standard)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
