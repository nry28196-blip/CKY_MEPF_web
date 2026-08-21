import React from 'react';
import { Info } from 'lucide-react';

interface TooltipLabelProps {
  label: React.ReactNode;
  tooltip?: React.ReactNode;
  className?: string;
}

export default function TooltipLabel({ label, tooltip, className = '' }: TooltipLabelProps) {
  if (!tooltip) {
    return <label className={className}>{label}</label>;
  }

  return (
    <div className="flex items-center space-x-1.5 mb-1.5 group relative w-fit">
      <label className={className.replace('mb-1.5', '').replace('mb-2', '').trim()}>{label}</label>
      <div className="cursor-help text-slate-500 hover:text-sky-400 transition-colors">
        <Info className="w-3 h-3" />
      </div>
      <div className="absolute bottom-full left-0 mb-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-slate-800 text-slate-200 text-[10px] sm:text-xs rounded-lg shadow-xl border border-slate-700 p-2.5 z-50 pointer-events-none translate-y-1 group-hover:translate-y-0">
        {tooltip}
        <div className="absolute top-full left-4 border-[5px] border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}
