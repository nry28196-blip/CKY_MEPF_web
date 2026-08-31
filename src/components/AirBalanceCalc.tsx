import React, { useState } from 'react';
import { Layers, Activity } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import { AirBalanceService, AirBalanceInput, AirBalanceResult } from '../calculations/ventilation/AirBalanceService';

export default function AirBalanceCalc() {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const flowUnit = isMetric ? 'L/s' : 'CFM';

  const [supplyAir, setSupplyAir] = useState<number>(500);
  const [exhaustAir, setExhaustAir] = useState<number>(300);
  const [returnAir, setReturnAir] = useState<number>(200);
  const [transferIn, setTransferIn] = useState<number>(0);

  const input: AirBalanceInput = {
    qSupply: supplyAir, qExhaust: exhaustAir, qReturn: returnAir, qTransferIn: transferIn
  };

  const result: AirBalanceResult = AirBalanceService.calculateRoomBalance(input);

  const netColor = result.pressureRelationship === 'Positive' ? 'text-sky-400' : result.pressureRelationship === 'Negative' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-indigo-400" />
          Room Air Balance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Supply Air ({flowUnit})</label>
              <input 
                type="number" min="0" step="10"
                value={supplyAir}
                onChange={(e) => setSupplyAir(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Return Air ({flowUnit})</label>
              <input 
                type="number" min="0" step="10"
                value={returnAir}
                onChange={(e) => setReturnAir(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Local Exhaust Air ({flowUnit})</label>
              <input 
                type="number" min="0" step="10"
                value={exhaustAir}
                onChange={(e) => setExhaustAir(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Transfer Air In ({flowUnit})</label>
              <input 
                type="number" min="0" step="10"
                value={transferIn}
                onChange={(e) => setTransferIn(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          Balance Results
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800/50 flex flex-col justify-center">
             <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                   <span>Supply (In)</span>
                   <span>+ {Math.round(supplyAir).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300 border-b border-slate-800/60 pb-2">
                   <span>Transfer (In)</span>
                   <span>+ {Math.round(transferIn).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-slate-400 pt-2">
                   <span>Exhaust (Out)</span>
                   <span>- {Math.round(exhaustAir).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-800/60 pb-2">
                   <span>Return (Out)</span>
                   <span>- {Math.round(returnAir).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-white font-bold pt-2">
                   <span>Net Airflow</span>
                   <span className={netColor}>{Math.round(result.qNet).toLocaleString()} {flowUnit}</span>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-950/50 p-6 rounded-xl border border-indigo-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Pressure Relationship</p>
            <p className={`text-3xl font-black font-mono tracking-tight drop-shadow-md z-10 uppercase ${netColor}`}>
              {result.pressureRelationship}
            </p>
            {result.pressureRelationship === 'Positive' && (
              <p className="text-xs text-sky-300 mt-3 z-10 text-center">
                Air will transfer OUT to adjacent spaces: {Math.round(result.transferOut).toLocaleString()} {flowUnit}
              </p>
            )}
            {result.pressureRelationship === 'Negative' && (
              <p className="text-xs text-rose-300 mt-3 z-10 text-center">
                Air must transfer IN from adjacent spaces: {Math.round(Math.abs(result.qNet)).toLocaleString()} {flowUnit}
              </p>
            )}
            {result.pressureRelationship === 'Neutral' && (
              <p className="text-xs text-slate-400 mt-3 z-10 text-center">
                Room is neutrally balanced.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
