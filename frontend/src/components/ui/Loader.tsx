import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text = 'Processing clinical models...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center text-xs">🤰</div>
      </div>
      {text && <p className="mt-3 text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );
};
