import React from 'react';
import { RiskCategory } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'amber' | 'rose' | 'primary' | 'secondary' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  riskLevel?: RiskCategory;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  size = 'md',
  riskLevel,
  className = '',
  ...props
}) => {
  let resolvedVariant = variant || 'neutral';

  if (riskLevel) {
    if (riskLevel === 'Low Risk') resolvedVariant = 'emerald';
    else if (riskLevel === 'Mid Risk') resolvedVariant = 'amber';
    else if (riskLevel === 'High Risk') resolvedVariant = 'rose';
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-bold',
  };

  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-semibold',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/80 font-semibold',
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/80 font-semibold',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200/80 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeStyles[size]} ${variantStyles[resolvedVariant]} ${className}`}
      {...props}
    >
      {riskLevel === 'Low Risk' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
      {riskLevel === 'Mid Risk' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
      {riskLevel === 'High Risk' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
      {children || riskLevel}
    </span>
  );
};
