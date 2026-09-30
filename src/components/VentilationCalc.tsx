import React, { useState, useEffect } from 'react';
import { BookOpen, Wind, Activity } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import VentilationReferenceModal from './VentilationReferenceModal';
import KitchenVentilationCalc from './KitchenVentilationCalc';
import ResidentialVentilationCalc from './ResidentialVentilationCalc';
import Ashrae621VentilationCalc from './Ashrae621VentilationCalc';
import Ashrae621ExhaustCalc from './Ashrae621ExhaustCalc';
import AirBalanceCalc from './AirBalanceCalc';
import SystemPerformanceCalc from './SystemPerformanceCalc';

export default function VentilationCalc({ onVentilationChange, governingStandard = 'ASHRAE 62.1-2022' }: { onVentilationChange?: (flow: number, details?: any) => void, governingStandard?: string }) {
  const isResidentialStandard = governingStandard.includes('62.2');
  const activeBasis = isResidentialStandard ? 'ASHRAE 62.2-2022' : 'ASHRAE 62.1-2022';

  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  
  const [ventMode, setVentMode] = useState<'standard' | 'exhaust' | 'balance' | 'kitchen' | 'residential' | 'system_perf'>(
    isResidentialStandard ? 'residential' : 'standard'
  );
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  useEffect(() => {
    if (governingStandard.includes('62.2') && ventMode !== 'residential') {
      setVentMode('residential');
    } else if (!governingStandard.includes('62.2') && ventMode === 'residential') {
      setVentMode('standard');
    }
  }, [governingStandard]);

  const getActiveBaseline = () => {
    switch (ventMode) {
      case 'residential':
        return 'ASHRAE 62.2-2022 [AUTHORITATIVE PRODUCTION CALCULATION - RESIDENTIAL]';
      case 'exhaust':
        return 'ASHRAE 62.1-2022 + Addendum x [AUTHORITATIVE PRODUCTION CALCULATION - PRESCRIPTIVE]';
      case 'balance':
        return 'Volumetric Air-Balance Diagnostic Utility [NON-AUTHORITATIVE DIAGNOSTIC]';
      case 'kitchen':
        return 'Commercial Kitchen Hood Sizing Diagnostic [NON-AUTHORITATIVE DIAGNOSTIC]';
      case 'system_perf':
        return 'Fan & Duct Aerodynamic Performance Estimator [NON-AUTHORITATIVE DIAGNOSTIC]';
      case 'standard':
      default:
        return 'ASHRAE 62.1-2022 + Addendum j [AUTHORITATIVE PRODUCTION CALCULATION]';
    }
  };

  return (
    <div className="space-y-6">
      <VentilationReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />
      
      {/* Active Standard Basis Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            ventMode === 'standard' || ventMode === 'exhaust' || ventMode === 'residential'
              ? 'bg-cyan-400'
              : 'bg-amber-400'
          }`}></span>
          <span className={`text-xs font-mono font-bold ${
            ventMode === 'standard' || ventMode === 'exhaust' || ventMode === 'residential'
              ? 'text-cyan-300'
              : 'text-amber-300'
          }`}>
            Active Mode: {getActiveBaseline()}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Status: <span className="text-emerald-400 font-semibold">FROZEN TO 2022 BASIS</span> | Future/2025: <span className="text-slate-500 font-semibold">BLOCKED</span>
        </div>
      </div>

      {/* Sub-modes for Ventilation */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'standard', label: 'Zone / VAV (ASHRAE 62.1)', isAuth: true },
            { id: 'exhaust', label: 'Commercial Exhaust (62.1)', isAuth: true },
            { id: 'balance', label: 'Air Balance (Diag)', isAuth: false },
            { id: 'kitchen', label: 'Kitchen Hood (Diag)', isAuth: false },
            { id: 'system_perf', label: 'Fan & Duct (Diag)', isAuth: false },
            { id: 'residential', label: 'Residential (62.2)', isAuth: true }
          ].map(mod => (
            <button
              key={mod.id}
              type="button"
              onClick={() => setVentMode(mod.id as any)}
              className={`px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                ventMode === mod.id
                  ? mod.isAuth
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/50 rounded-lg'
                    : 'bg-amber-950/40 text-amber-400 border border-amber-500/50 rounded-lg'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent rounded-lg'
              }`}
            >
              <span>{mod.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                mod.isAuth ? 'bg-cyan-900/60 text-cyan-300' : 'bg-amber-900/60 text-amber-300'
              }`}>
                {mod.isAuth ? 'PROD' : 'DIAG'}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsRefModalOpen(true)}
          className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span>Reference</span>
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-4 bg-amber-950/20 border border-amber-900/50 p-3 rounded-lg flex items-start text-xs text-amber-400">
           <Activity className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
           <p>
             <strong>Engineering Calculation Aid:</strong> Active ventilation engine baseline is strictly ASHRAE 62.1-2022 and ASHRAE 62.2-2022. 
             Final project design must be verified against project-adopted code, AHJ requirements, and manufacturer data.
           </p>
        </div>
        
        {ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} edition="2022" />}
        {ventMode === 'exhaust' && <Ashrae621ExhaustCalc />}
        {ventMode === 'balance' && <AirBalanceCalc />}
        {ventMode === 'kitchen' && <KitchenVentilationCalc />}
        {ventMode === 'system_perf' && <SystemPerformanceCalc />}
        {ventMode === 'residential' && <ResidentialVentilationCalc />}
      </div>
    </div>
  );
}
