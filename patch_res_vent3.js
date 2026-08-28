import fs from 'fs';
const code = `import React, { useState, useEffect } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
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
`;
fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
