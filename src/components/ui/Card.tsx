import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = ({ children, className, title, subtitle, icon, footer }: CardProps) => {
  return (
    <div className={cn("bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden flex flex-col", className)}>
      {(title || icon) && (
        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-bold tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>
          {icon && <div className="p-3 bg-stone-50 rounded-2xl text-stone-400">{icon}</div>}
        </div>
      )}
      <div className="flex-1 p-8">
        {children}
      </div>
      {footer && (
        <div className="px-8 py-4 bg-stone-50 border-t border-stone-100">
          {footer}
        </div>
      )}
    </div>
  );
};
