import React from 'react';
import type { SwapStep } from '../../types';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StepCardProps {
  step: SwapStep;
}

export const StepCard: React.FC<StepCardProps> = ({ step }) => {
  const iconComponents = Icons as unknown as Record<string, LucideIcon>;
  const IconComponent = iconComponents[step.icon] || Icons.Circle;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-light transition-colors">
      <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm text-brand-dark">
        <IconComponent size={24} strokeWidth={1.5} />
        {/* Step Number Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
          {step.number}
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-brand-dark mb-1">{step.title}</h4>
        <p className="text-sm text-brand-dark/70 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};
