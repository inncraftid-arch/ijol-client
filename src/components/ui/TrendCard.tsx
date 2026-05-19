import React from 'react';
import type { TrendItem } from '../../types';
import { cn } from './Button';

interface TrendCardProps {
  trend: TrendItem;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  return (
    <div className={cn(
      "relative group rounded-[2rem] overflow-hidden flex-shrink-0 cursor-pointer w-[280px] h-[360px] sm:w-[320px] sm:h-[400px]",
      trend.comingSoon && "opacity-80 grayscale-[20%]"
    )}>
      <img 
        src={trend.image} 
        alt={trend.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {trend.comingSoon && (
          <div className="mb-2">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              Segera Hadir
            </span>
          </div>
        )}
        <h3 className="text-white font-bold text-2xl leading-tight">
          {trend.title}
        </h3>
      </div>
    </div>
  );
};
