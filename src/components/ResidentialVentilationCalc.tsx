import React, { useState, useEffect } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [kitchenVolume, setKitchenVolume] = useState<number>(isMetric ? 30 : 1000);
  
  const [totalAirflow, setTotalAirflow] = useState<number>(0);
  
  const [kitchenMode, setKitchenMode] = useState<'intermittent'|'continuous'>('intermittent');
  const [bathrooms, setBathrooms] = useState<number>(2);

  useEffect(() => {
    // ASHRAE 62.2 Whole-Dwelling Ventilation
    let qTot = 0;
    if (isMetric) {
      qTot = 0.15 * floorArea + 3.5 * (bedrooms + 1);
    } else {
      qTot = 0.03 * floorArea + 7.5 * (bedrooms + 1);
    }
    setTotalAirflow(Math.max(0, qTot));
  }, [floorArea, bedrooms, isMetric]);

  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const areaUnit = isMetric ? 'm²' : 'ft²';
  const volUnit = isMetric ? 'm³' : 'ft³';

  // 62.2 Local Exhaust
  const kitchenExhaust = kitchenMode === 'intermittent' 
    ? (isMetric ? 50 : 100)
    : (isMetric ? (kitchenVolume * 5 / 3.6) : (kitchenVolume * 5 / 60)); // 5 ACH

  const bathroomInt = isMetric ? 25 : 50;
  const bathroomCont = isMetric ? 10 : 20;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-emerald-900/30 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Home className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">ASHRAE 62.2 Whole-Building</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <TooltipLabel label={`Floor Area (${areaUnit})`} className="text-xs font-bold text-slate-400 uppercase" />
              <input type="number" min="0" value={floorArea} onChange={(e) => setFloorArea(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-emerald-500" />
            </div>
            <div>
              <TooltipLabel label="Bedrooms" className="text-xs font-bold text-slate-400 uppercase" />
              <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-emerald-500" />
            </div>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center mt-6">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Req. Flow</span>
              <div className="text-right">
                <span className="text-3xl font-black font-mono text-emerald-400">{Math.ceil(totalAirflow)}</span>
                <span className="text-emerald-500/50 text-sm ml-2">{flowUnit}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-sky-900/30 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Wind className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">ASHRAE 62.2 Local Exhaust</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><ChefHat className="w-3 h-3 mr-1" /> Kitchen Exhaust</h4>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <button onClick={() => setKitchenMode('intermittent')} className={`py-1.5 text-[10px] font-bold uppercase rounded border ${kitchenMode === 'intermittent' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>Intermittent</button>
                <button onClick={() => setKitchenMode('continuous')} className={`py-1.5 text-[10px] font-bold uppercase rounded border ${kitchenMode === 'continuous' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>Continuous (5 ACH)</button>
              </div>
              {kitchenMode === 'continuous' && (
                <div className="mb-3">
                  <TooltipLabel label={`Kitchen Volume (${volUnit})`} className="text-[10px] font-bold text-slate-400 uppercase" />
                  <input type="number" min="0" value={kitchenVolume} onChange={(e) => setKitchenVolume(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded px-3 py-1.5 font-mono text-sm border border-slate-800" />
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Required:</span>
                <span className="font-mono text-sky-300 font-bold">{Math.ceil(kitchenExhaust)} {flowUnit}</span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><Droplets className="w-3 h-3 mr-1" /> Bathrooms</h4>
              <div className="mb-3">
                <TooltipLabel label="Number of Bathrooms" className="text-[10px] font-bold text-slate-400 uppercase" />
                <input type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded px-3 py-1.5 font-mono text-sm border border-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900 p-2 rounded text-center">
                  <span className="block text-slate-500 mb-1">Intermittent</span>
                  <span className="font-mono text-sky-300 font-bold">{bathroomInt} {flowUnit}</span> <span className="text-[10px] text-slate-600">/ each</span>
                </div>
                <div className="bg-slate-900 p-2 rounded text-center">
                  <span className="block text-slate-500 mb-1">Continuous</span>
                  <span className="font-mono text-sky-300 font-bold">{bathroomCont} {flowUnit}</span> <span className="text-[10px] text-slate-600">/ each</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
