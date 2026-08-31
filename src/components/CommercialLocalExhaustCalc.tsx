import React, { useState } from 'react';
import { Wind, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import { LocalExhaustService, LocalExhaustInput } from '../calculations/ventilation/LocalExhaustService';
import TooltipLabel from './TooltipLabel';

export default function CommercialLocalExhaustCalc() {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  
  const [selectedId, setSelectedId] = useState<string>('none');
  const [quantity, setQuantity] = useState<number>(100); // represents area or unit count
  const [customRate, setCustomRate] = useState<number>(0);
  
  const categories = LocalExhaustService.getCategories();
  const category = categories.find(c => c.id === selectedId) || categories[0];
  
  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const areaUnit = isMetric ? 'm²' : 'ft²';
  
  const input: LocalExhaustInput = {
    categoryId: selectedId,
    quantity: quantity,
    customRate: customRate,
    isMetric: isMetric
  };
  
  const result = LocalExhaustService.calculateExhaust(input);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl flex items-start text-xs text-rose-400">
         <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
         <p>
           <strong>Important Warning:</strong> Commercial local exhaust rates are independent of general outdoor air ventilation (ASHRAE 62.1 VRP). 
           Do not use a local exhaust rate to satisfy a room's breathing zone outdoor air requirement. Local exhaust must be discharged directly outdoors and cannot be recirculated.
         </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
          <Wind className="w-4 h-4 mr-2 text-rose-400" />
          Commercial Local Exhaust
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Exhaust Category</label>
            <select 
              value={selectedId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedId(newId);
                const newCat = categories.find(c => c.id === newId);
                if (newCat) {
                   if (newCat.unitType === 'per_unit') setQuantity(1);
                   if (newCat.unitType === 'per_area') setQuantity(isMetric ? 10 : 100);
                }
              }}
              className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm border border-slate-800 focus:border-rose-500 transition-colors"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {selectedId !== 'none' && selectedId !== 'custom' && (
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Code Rate:</span>
                <span className="text-rose-400 font-mono font-bold">
                  {isMetric ? category.rateMetric : category.rateImp} {isMetric ? category.unitLabelMetric : category.unitLabelImp}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-500">Operating Mode:</span>
                <span className="text-slate-300">{category.operatingMode}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] mt-1">
                <span className="text-slate-500">Reference:</span>
                <span className="text-slate-400">{category.reference}</span>
              </div>
            </div>
          )}
          
          {selectedId === 'custom' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Custom Exhaust Rate ({flowUnit})</label>
              <input 
                type="number" min="0" step="10"
                value={customRate}
                onChange={(e) => setCustomRate(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-rose-500 transition-colors"
              />
            </div>
          )}

          {selectedId !== 'none' && selectedId !== 'custom' && category.unitType === 'per_unit' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Number of Units (e.g., Water Closets)</label>
              <input 
                type="number" min="1" step="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-rose-500 transition-colors"
              />
            </div>
          )}
          
          {selectedId !== 'none' && selectedId !== 'custom' && category.unitType === 'per_area' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Floor Area ({areaUnit})</label>
              <input 
                type="number" min="1" step={isMetric ? 5 : 50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2.5 text-sm font-mono border border-slate-800 focus:border-rose-500 transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-rose-400" />
          Local Exhaust Requirements
        </h3>
        
        {selectedId === 'none' ? (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/30 rounded-lg border border-slate-800/50">
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
            <p className="text-sm text-slate-400">No local exhaust required for this category.</p>
          </div>
        ) : (
          <div className="bg-slate-950/50 p-6 rounded-xl border border-rose-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required Local Exhaust</p>
            <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
              {Math.ceil(result.requiredExhaust).toLocaleString()}
            </p>
            <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
          </div>
        )}
      </div>
    </div>
  );
}
