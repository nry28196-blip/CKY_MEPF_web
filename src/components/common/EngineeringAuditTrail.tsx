import React, { useState } from 'react';
import { Activity, BookOpen, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export interface AuditTrailStep {
  symbol?: string;
  name: string;
  formula?: string;
  value: string | number;
  unit?: string;
  reference?: string;
}

export interface EngineeringAuditTrailProps {
  title?: string;
  codeReference?: string;
  trail: AuditTrailStep[];
  className?: string;
  defaultExpanded?: boolean;
}

export default function EngineeringAuditTrail({
  title = 'Engineering Audit Trail',
  codeReference,
  trail,
  className = '',
  defaultExpanded = true
}: EngineeringAuditTrailProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden ${className}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-slate-900/80 px-4 py-3 border-b border-slate-800/50 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center">
          <Activity className="w-4 h-4 text-sky-400 mr-2.5" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{title}</span>
          {codeReference && (
            <div className="ml-4 flex items-center inline-flex bg-slate-950/50 px-2 py-0.5 rounded border border-slate-700/50">
              <BookOpen className="w-3 h-3 text-slate-500 mr-1.5" />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{codeReference}</span>
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-0 animate-in slide-in-from-top-2 duration-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/30 border-b border-slate-800/50">
                <th className="px-4 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider w-1/4">Parameter</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider w-1/4">Formula / Ref</th>
                <th className="px-4 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider text-right">Computed Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {trail.map((v, i) => (
                <tr key={i} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col">
                      {v.symbol && (
                        <span className="text-[11px] font-mono font-bold text-sky-400 mb-0.5">{v.symbol}</span>
                      )}
                      <span className="text-[10px] text-slate-300 leading-tight">{v.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col space-y-1">
                      {v.formula ? (
                        <div className="flex items-start">
                          <Calculator className="w-3 h-3 text-slate-500 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span className="text-[10px] font-mono text-slate-400 leading-tight">{v.formula}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Given/Empirical</span>
                      )}
                      {v.reference && (
                        <span className="text-[9px] text-slate-500 tracking-wider">Ref: {v.reference}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex items-baseline justify-end space-x-1.5 bg-slate-950/40 px-2 py-1 rounded border border-slate-800/60">
                      <span className="text-[12px] font-mono font-bold text-white tracking-tight">{v.value}</span>
                      {v.unit && (
                        <span className="text-[9px] font-bold text-sky-500/70 uppercase tracking-wider">{v.unit}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
