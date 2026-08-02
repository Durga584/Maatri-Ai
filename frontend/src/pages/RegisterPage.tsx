import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { HeartPulse, Mail, Lock, User, Calendar, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gestationalWeek, setGestationalWeek] = useState(16);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password, 'Patient', gestationalWeek);
      showToast('Registration Successful!', 'Welcome to Maatri AI Platform.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Registration Failed', 'Please check input fields.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-accent-500 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-2xl font-black gradient-text">Maatri AI</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
          <p className="text-xs text-slate-500">Join the AI-powered maternal health community</p>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Ananya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="ananya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Current Gestational Week"
              type="number"
              min="1"
              max="42"
              value={gestationalWeek}
              onChange={(e) => setGestationalWeek(Number(e.target.value))}
              icon={<Calendar className="w-4 h-4 text-primary-500" />}
              required
            />

            <Button type="submit" size="md" isLoading={isLoading} className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
