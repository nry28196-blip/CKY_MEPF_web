import React, { useState } from 'react';
import { BookOpen, Wind, Activity } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import VentilationReferenceModal from './VentilationReferenceModal';
import KitchenVentilationCalc from './KitchenVentilationCalc';
import ResidentialVentilationCalc from './ResidentialVentilationCalc';
import Ashrae621VentilationCalc from './Ashrae621VentilationCalc';
import CommercialLocalExhaustCalc from './CommercialLocalExhaustCalc';
import AirBalanceCalc from './AirBalanceCalc';

export default function VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  
  const [ventMode, setVentMode] = useState<'standard' | 'exhaust' | 'balance' | 'kitchen' | 'residential'>('standard');
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <VentilationReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />
      
      {/* Sub-modes for Ventilation */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-wrap bg-slate-950 border border-slate-850 p-0.5 rounded-xl text-[10px] font-bold uppercase w-fit gap-1">
          <button
            type="button"
            onClick={() => setVentMode('standard')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ventMode === 'standard' ? 'bg-sky-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Zone / VAV (ASHRAE 62.1)
          </button>
          <button
            type="button"
            onClick={() => setVentMode('exhaust')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ventMode === 'exhaust' ? 'bg-indigo-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Commercial Exhaust
          </button>
          <button
            type="button"
            onClick={() => setVentMode('balance')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ventMode === 'balance' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Air Balance
          </button>
          <button
            type="button"
            onClick={() => setVentMode('kitchen')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ventMode === 'kitchen' ? 'bg-rose-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kitchen Hood
          </button>
          <button
            type="button"
            onClick={() => setVentMode('residential')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ventMode === 'residential' ? 'bg-purple-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Residential (62.2)
          </button>
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
        
        {ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} />}
        {ventMode === 'exhaust' && <CommercialLocalExhaustCalc />}
        {ventMode === 'balance' && <AirBalanceCalc />}
        {ventMode === 'kitchen' && <KitchenVentilationCalc />}
        {ventMode === 'residential' && <ResidentialVentilationCalc />}
      </div>
    </div>
  );
}
