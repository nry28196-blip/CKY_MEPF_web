import React, { useState } from 'react';
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

export default function VentilationCalc({ onVentilationChange, governingStandard = 'ASHRAE 62.1-2025' }: { onVentilationChange?: (flow: number, details?: any) => void, governingStandard?: string }) {
  const standardParts = governingStandard.split('-');
  const edition = standardParts.length > 1 ? standardParts[1] : '2025';

  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  
  const [ventMode, setVentMode] = useState<'standard' | 'exhaust' | 'balance' | 'kitchen' | 'residential'>('standard');
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <VentilationReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />
      
      {/* Sub-modes for Ventilation */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'standard', label: 'Zone / VAV (ASHRAE 62.1)' },
            { id: 'exhaust', label: 'Commercial Exhaust' },
            { id: 'balance', label: 'Air Balance' },
            { id: 'kitchen', label: 'Kitchen Hood' },
            { id: 'residential', label: 'Residential (62.2)' }
          ].map(mod => (
            <button
              key={mod.id}
              type="button"
              onClick={() => setVentMode(mod.id)}
              className={`px-3 py-1.5 transition-all cursor-pointer ${
                ventMode === mod.id
                  ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/50 rounded-lg'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent rounded-lg'
              }`}
            >
              {mod.label}
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
             <strong>Engineering Calculation Aid:</strong> This tool calculates requirements based on the selected standard methodology. 
             Final project design must be verified against project-adopted code, AHJ requirements, and manufacturer data.
           </p>
        </div>
        
        {ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} edition={edition as any} />}
        {ventMode === 'exhaust' && <Ashrae621ExhaustCalc />}
        {ventMode === 'balance' && <AirBalanceCalc />}
        {ventMode === 'kitchen' && <KitchenVentilationCalc />}
        {ventMode === 'residential' && <ResidentialVentilationCalc />}
      </div>
    </div>
  );
}
