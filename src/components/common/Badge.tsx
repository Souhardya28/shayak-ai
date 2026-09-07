import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'purple' | 'slate' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    amber: 'bg-amber-100 text-amber-900 border-amber-300',
    purple: 'bg-purple-100 text-purple-900 border-purple-300',
    slate: 'bg-slate-100 text-slate-800 border-slate-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-3.5 py-1.5 text-base font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
