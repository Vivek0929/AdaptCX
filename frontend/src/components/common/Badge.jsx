import React from 'react';

export const Badge = ({
  children,
  variant = 'indigo',
  size = 'md',
  className = ''
}) => {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold',
    md: 'px-2.5 py-0.5 text-xs font-medium',
    lg: 'px-3 py-1 text-xs font-medium'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${variants[variant] || variants.indigo} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {text && <p className="text-xs text-slate-500 font-medium">{text}</p>}
    </div>
  );
};
