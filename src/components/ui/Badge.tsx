import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'primary', 
  children,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
  
  const variants = {
    primary: 'bg-brand-gold text-brand-dark',
    secondary: 'bg-brand-dark text-white',
    outline: 'border border-brand-dark text-brand-dark',
    white: 'bg-white text-brand-dark shadow-sm'
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
