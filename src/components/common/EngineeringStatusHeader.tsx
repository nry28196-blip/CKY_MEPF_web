import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';

export type EngineeringStatus = 'READY' | 'CALCULATED' | 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' | 'NOT_APPLICABLE';

interface Props {
  status: EngineeringStatus;
  message?: string;
  className?: string;
}

export default function EngineeringStatusHeader({ status, message, className = '' }: Props) {
  let bgColor = 'bg-slate-900';
  let borderColor = 'border-slate-800';
  let textColor = 'text-slate-400';
  let Icon = HelpCircle;

  switch (status) {
    case 'PASS':
      bgColor = 'bg-emerald-950/20';
      borderColor = 'border-emerald-500/50';
      textColor = 'text-emerald-400';
      Icon = CheckCircle2;
      break;
    case 'WARNING':
      bgColor = 'bg-amber-950/20';
      borderColor = 'border-amber-500/50';
      textColor = 'text-amber-400';
      Icon = AlertTriangle;
      break;
    case 'FAIL':
      bgColor = 'bg-red-950/20';
      borderColor = 'border-red-500/50';
      textColor = 'text-red-400';
      Icon = XCircle;
      break;
    case 'INCOMPLETE':
    case 'NOT_APPLICABLE':
      bgColor = 'bg-slate-900/50';
      borderColor = 'border-slate-700/50';
      textColor = 'text-slate-400';
      Icon = Info;
      break;
    case 'READY':
    case 'CALCULATED':
    default:
      bgColor = 'bg-sky-950/20';
      borderColor = 'border-sky-500/50';
      textColor = 'text-sky-400';
      Icon = Info;
      break;
  }

  return (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-md border ${bgColor} ${borderColor} ${className}`}>
      <Icon className={`h-5 w-5 ${textColor}`} />
      <div className="flex flex-col">
        <span className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
          {status.replace('_', ' ')}
        </span>
        {message && (
          <span className={`text-[13px] ${textColor} opacity-90`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
