import React, { useState, useEffect } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [kitchenVolume, setKitchenVolume] = useState<number>(isMetric ? 30 : 1000);
  const [totalAirflow, setTotalAirflow] = useState<number>(0);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-5">
              <Home className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-200 tracking-wide">Whole-Dwelling Ventilation (ASHRAE 62.2)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Dwelling Floor Area ({areaUnit})</label>
                <input
                  type="number"
                  min="0"
                  value={floorArea || ''}
                  onChange={(e) => setFloorArea(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Number of Bedrooms</label>
                <input
                  type="number"
                  min="1"
                  value={bedrooms || ''}
                  onChange={(e) => setBedrooms(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div className="flex items-center space-x-2">
                <Wind className="h-5 w-5 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-200 tracking-wide">Local Source Exhaust (ASHRAE 62.2)</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kitchen Exhaust Calculator */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                    <ChefHat className="w-4 h-4 mr-1.5 text-amber-500" /> Kitchens
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Intermittent (Vented Hood)</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '50' : '100'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-slate-500 uppercase">Continuous (5 ACH)</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex-1">
                          <label className="text-[9px] text-slate-400 uppercase">Volume ({isMetric ? 'm³' : 'ft³'})</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Volume"
                            value={kitchenVolume || ''}
                            onChange={(e) => setKitchenVolume(Number(e.target.value) || 0)}
                            className="w-full bg-slate-950 text-white rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50 border border-slate-800"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] text-slate-400 uppercase">Req. ({flowUnit})</label>
                          <div className="w-full bg-slate-900 text-amber-400 rounded-lg px-2 py-1.5 text-xs font-mono border border-slate-800 flex items-center">
                            {kitchenVolume ? (isMetric ? (kitchenVolume * 5 / 3.6).toFixed(1) : (kitchenVolume * 5 / 60).toFixed(1)) : '0.0'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bathroom Exhaust */}
              <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                    <Droplets className="w-4 h-4 mr-1.5 text-cyan-500" /> Bathrooms
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Intermittent Exhaust</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '25' : '50'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/50">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Continuous Exhaust</span>
                      <p className="text-lg font-bold text-white font-mono">
                        {isMetric ? '10' : '20'} <span className="text-[10px] font-normal text-slate-400 normal-case">{flowUnit}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/50">
                  <p className="text-[9px] text-slate-500 leading-tight">
                    * Rates apply per bathroom. Local exhaust removes air directly from pollutant/moisture sources, separate from whole-dwelling ventilation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Required Whole-Dwelling</h3>
            <p className="text-[10px] text-slate-400 mb-4">ASHRAE 62.2 Minimum Outdoor Airflow</p>
            
            <div className="flex items-end space-x-2">
              <span className="text-5xl font-black text-white font-mono tracking-tighter">
                {Math.ceil(totalAirflow)}
              </span>
              <span className="text-lg font-bold text-indigo-300 mb-1">{flowUnit}</span>
            </div>
            
            <div className="mt-5 pt-4 border-t border-indigo-500/20">
              <p className="text-[10px] text-indigo-200/60 leading-relaxed flex items-start">
                <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0 text-amber-500/70" />
                This airflow is intended to dilute the unavoidable contaminant emissions from people, materials, and background processes.
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
            <h4 className="font-semibold text-slate-300 mb-2 text-xs flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Calculation Formula
            </h4>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <code className="text-indigo-400 text-xs font-mono block mb-2">
                {isMetric 
                  ? 'Q_tot = 0.15 × A_floor + 3.5 × (N_br + 1)'
                  : 'Q_tot = 0.03 × A_floor + 7.5 × (N_br + 1)'}
              </code>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li><span className="font-mono text-slate-300">Q_tot</span> = Total required ventilation rate ({flowUnit})</li>
                <li><span className="font-mono text-slate-300">A_floor</span> = Dwelling floor area ({areaUnit})</li>
                <li><span className="font-mono text-slate-300">N_br</span> = Number of bedrooms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
