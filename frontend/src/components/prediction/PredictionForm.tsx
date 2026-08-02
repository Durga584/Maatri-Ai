import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VitalsInputData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Activity, Flame, Heart, Sparkles, Scale } from 'lucide-react';

const vitalsSchema = z.object({
  Age: z.coerce.number().min(10, 'Age must be between 10 and 60').max(60, 'Age must be between 10 and 60'),
  SystolicBP: z.coerce.number().min(70, 'Systolic BP must be between 70 and 200 mmHg').max(200, 'Systolic BP must be between 70 and 200 mmHg'),
  DiastolicBP: z.coerce.number().min(40, 'Diastolic BP must be between 40 and 120 mmHg').max(120, 'Diastolic BP must be between 40 and 120 mmHg'),
  BS: z.coerce.number().min(2.0, 'Blood sugar must be between 2.0 and 25.0 mmol/L').max(25.0, 'Blood sugar must be between 2.0 and 25.0 mmol/L'),
  BodyTemp: z.coerce.number().min(95.0, 'Body temp must be between 95°F and 106°F').max(106.0, 'Body temp must be between 95°F and 106°F'),
  HeartRate: z.coerce.number().min(40, 'Heart rate must be between 40 and 150 bpm').max(150, 'Heart rate must be between 40 and 150 bpm'),
});

interface PredictionFormProps {
  onSubmit: (data: VitalsInputData) => void;
  isLoading?: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VitalsInputData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      Age: 28,
      SystolicBP: 120,
      DiastolicBP: 80,
      BS: 5.5,
      BodyTemp: 98.6,
      HeartRate: 75,
    },
  });

  const setPreset = (type: 'normal' | 'elevated' | 'highRisk') => {
    if (type === 'normal') {
      setValue('Age', 26);
      setValue('SystolicBP', 115);
      setValue('DiastolicBP', 76);
      setValue('BS', 5.2);
      setValue('BodyTemp', 98.4);
      setValue('HeartRate', 72);
    } else if (type === 'elevated') {
      setValue('Age', 32);
      setValue('SystolicBP', 132);
      setValue('DiastolicBP', 86);
      setValue('BS', 6.4);
      setValue('BodyTemp', 99.0);
      setValue('HeartRate', 82);
    } else if (type === 'highRisk') {
      setValue('Age', 38);
      setValue('SystolicBP', 152);
      setValue('DiastolicBP', 96);
      setValue('BS', 8.8);
      setValue('BodyTemp', 101.2);
      setValue('HeartRate', 92);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Quick Clinical Presets Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-600" />
          Quick Test Presets:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreset('normal')}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold transition-colors"
          >
            Normal Vitals
          </button>
          <button
            type="button"
            onClick={() => setPreset('elevated')}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold transition-colors"
          >
            Elevated BP/Sugar
          </button>
          <button
            type="button"
            onClick={() => setPreset('highRisk')}
            className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold transition-colors"
          >
            High Risk Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Input
          label="Maternal Age (years)"
          type="number"
          placeholder="e.g. 28"
          icon={<User className="w-4 h-4" />}
          error={errors.Age?.message}
          {...register('Age')}
        />

        <Input
          label="Systolic BP (mmHg)"
          type="number"
          placeholder="Upper BP e.g. 120"
          icon={<Activity className="w-4 h-4 text-primary-500" />}
          error={errors.SystolicBP?.message}
          {...register('SystolicBP')}
        />

        <Input
          label="Diastolic BP (mmHg)"
          type="number"
          placeholder="Lower BP e.g. 80"
          icon={<Activity className="w-4 h-4 text-secondary-500" />}
          error={errors.DiastolicBP?.message}
          {...register('DiastolicBP')}
        />

        <Input
          label="Blood Sugar / Glucose (mmol/L)"
          type="number"
          step="0.1"
          placeholder="Fast < 5.6 e.g. 5.5"
          icon={<Scale className="w-4 h-4 text-amber-500" />}
          error={errors.BS?.message}
          {...register('BS')}
        />

        <Input
          label="Body Temp (°F)"
          type="number"
          step="0.1"
          placeholder="Normal 98.6"
          icon={<Flame className="w-4 h-4 text-rose-500" />}
          error={errors.BodyTemp?.message}
          {...register('BodyTemp')}
        />

        <Input
          label="Heart Rate (bpm)"
          type="number"
          placeholder="Normal 70-80"
          icon={<Heart className="w-4 h-4 text-accent-500" />}
          error={errors.HeartRate?.message}
          {...register('HeartRate')}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full shadow-lg shadow-primary-500/25 py-4 text-base font-bold"
        leftIcon={<Sparkles className="w-5 h-5" />}
      >
        Analyze Maternal Risk & Generate SHAP Insights
      </Button>
    </form>
  );
};
