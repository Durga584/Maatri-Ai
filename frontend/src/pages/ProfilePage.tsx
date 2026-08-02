import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Calendar, Stethoscope, Phone, Shield, Save, Heart, Activity } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Ananya Sharma');
  const [email, setEmail] = useState(user?.email || 'ananya.sharma@maatri.ai');
  const [gestationalWeek, setGestationalWeek] = useState(user?.gestational_week || 26);
  const [dueDate, setDueDate] = useState(user?.due_date || '2026-11-10');
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'B+');
  const [obstetrician, setObstetrician] = useState(user?.obstetrician || 'Dr. Sunita Kapoor, Senior OB-GYN');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergency_contact || '+1 (555) 019-2834');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      gestational_week: Number(gestationalWeek),
      due_date: dueDate,
      blood_group: bloodGroup,
      obstetrician,
      emergency_contact: emergencyContact,
    });
    showToast('Profile Saved', 'Your maternal health profile has been updated.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Maternal Health Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage personal care parameters, gestational week, and emergency contacts.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary Card */}
        <Card className="lg:col-span-1 space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-accent-500 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary-500/20">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500">{email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200">
              <Heart className="w-3.5 h-3.5 text-primary-600" />
              <span>Week {gestationalWeek} • Second Trimester</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-left text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Blood Group</span>
              <span className="font-bold text-slate-800">{bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Expected Due Date</span>
              <span className="font-bold text-slate-800">{dueDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Attending Physician</span>
              <span className="font-bold text-slate-800 text-right">{obstetrician}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Editable Profile Inputs */}
        <Card className="lg:col-span-2 space-y-6">
          <CardHeader>
            <CardTitle>
              <User className="w-5 h-5 text-primary-600" />
              Personal & Clinical Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="Gestational Week"
                type="number"
                value={gestationalWeek}
                onChange={(e) => setGestationalWeek(Number(e.target.value))}
                icon={<Calendar className="w-4 h-4 text-primary-500" />}
              />
              <Input
                label="Expected Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                icon={<Calendar className="w-4 h-4 text-secondary-500" />}
              />
              <Input
                label="Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                icon={<Activity className="w-4 h-4 text-rose-500" />}
              />
              <Input
                label="Emergency Phone"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                icon={<Phone className="w-4 h-4 text-emerald-500" />}
              />
            </div>

            <Input
              label="Attending Obstetrician / Clinic"
              value={obstetrician}
              onChange={(e) => setObstetrician(e.target.value)}
              icon={<Stethoscope className="w-4 h-4 text-primary-600" />}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
