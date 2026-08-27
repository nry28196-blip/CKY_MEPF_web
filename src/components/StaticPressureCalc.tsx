import React, { useState, useEffect } from 'react';
import { Settings2, Calculator, Plus, Trash2, Wind, AlertCircle } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';

interface Fitting {
  id: string;
  name: string;
  qty: number;
  equivalentLength: number;
}

export default function StaticPressureCalc() {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const pressUnit = isMetric ? 'Pa' : 'in. wg';
  const fricUnit = isMetric ? 'Pa/m' : 'in. wg/100 ft';

  // System parameters
  const [airflow, setAirflow] = useState<number>(isMetric ? 1000 : 2000);
  const [frictionRate, setFrictionRate] = useState<number>(isMetric ? 1.0 : 0.1);
  const [straightLength, setStraightLength] = useState<number>(isMetric ? 30 : 100);

  // Component pressure drops
  const [filterDrop, setFilterDrop] = useState<number>(isMetric ? 75 : 0.3);
  const [coilDrop, setCoilDrop] = useState<number>(isMetric ? 125 : 0.5);
  const [damperDrop, setDamperDrop] = useState<number>(isMetric ? 25 : 0.1);
  const [diffuserDrop, setDiffuserDrop] = useState<number>(isMetric ? 25 : 0.1);
  const [safetyFactor, setSafetyFactor] = useState<number>(10);

  // Fittings (Equivalent lengths)
  const [fittings, setFittings] = useState<Fitting[]>([
    { id: '1', name: '90° Radius Elbow', qty: 3, equivalentLength: isMetric ? 3 : 10 },
    { id: '2', name: 'Branch Takeoff', qty: 1, equivalentLength: isMetric ? 4.5 : 15 },
  ]);

  const addFitting = () => {
    setFittings([...fittings, { id: Math.random().toString(), name: 'New Fitting', qty: 1, equivalentLength: isMetric ? 1.5 : 5 }]);
  };

  const updateFitting = (id: string, field: keyof Fitting, value: any) => {
    setFittings(fittings.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const removeFitting = (id: string) => {
    setFittings(fittings.filter(f => f.id !== id));
  };

  // Calculations
  const [results, setResults] = useState({
    totalEquivLength: 0,
    straightDuctLoss: 0,
    fittingLoss: 0,
    totalDuctLoss: 0,
    equipmentLoss: 0,
    totalStaticPressure: 0,
    designStaticPressure: 0,
  });

  useEffect(() => {
    // 1. Calculate fitting equivalent length
    const totalFittingEquivLength = fittings.reduce((acc, f) => acc + (f.qty * f.equivalentLength), 0);
    
    // 2. Total equivalent length
    const totalEquivLength = straightLength + totalFittingEquivLength;

    // 3. Duct loss calculation
    let straightLoss = 0;
    let fittingLoss = 0;
    
    if (isMetric) {
      straightLoss = straightLength * frictionRate;
      fittingLoss = totalFittingEquivLength * frictionRate;
    } else {
      straightLoss = (straightLength / 100) * frictionRate;
      fittingLoss = (totalFittingEquivLength / 100) * frictionRate;
    }
    
    const totalDuctLoss = straightLoss + fittingLoss;

    // 4. Equipment loss
    const equipmentLoss = filterDrop + coilDrop + damperDrop + diffuserDrop;

    // 5. Total system SP
    const totalSP = totalDuctLoss + equipmentLoss;
    const designSP = totalSP * (1 + (safetyFactor / 100));

    setResults({
      totalEquivLength,
      straightDuctLoss: straightLoss,
      fittingLoss,
      totalDuctLoss,
      equipmentLoss,
      totalStaticPressure: totalSP,
      designStaticPressure: designSP,
    });
  }, [straightLength, frictionRate, fittings, filterDrop, coilDrop, damperDrop, diffuserDrop, safetyFactor, isMetric]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Parameters */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-3">
              <Calculator className="h-4.5 w-4.5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Duct System Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Design Friction Rate ({fricUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={frictionRate || ''}
                  onChange={(e) => setFrictionRate(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Total Straight Length ({lenUnit})</label>
                <input
                  type="number" min="0"
                  value={straightLength || ''}
                  onChange={(e) => setStraightLength(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 border border-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Fittings */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Settings2 className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Fittings (Equivalent Lengths)</h3>
              </div>
              <button 
                onClick={addFitting}
                className="bg-cyan-900/30 text-cyan-400 hover:bg-cyan-800/40 p-1.5 rounded flex items-center text-[10px] font-bold uppercase transition-colors"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Fitting
              </button>
            </div>

            <div className="space-y-3">
              {fittings.map((fitting, index) => (
                <div key={fitting.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-850">
                  <div className="col-span-5 md:col-span-6">
                    <input 
                      type="text" 
                      value={fitting.name}
                      onChange={(e) => updateFitting(fitting.id, 'name', e.target.value)}
                      placeholder="Fitting name"
                      className="w-full bg-transparent text-slate-200 text-xs px-2 py-1.5 focus:outline-none font-sans"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <TooltipLabel label="Qty" className="text-[9px] text-slate-500 uppercase block ml-1" />
                    <input 
                      type="number" min="1"
                      value={fitting.qty || ''}
                      onChange={(e) => updateFitting(fitting.id, 'qty', Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 text-slate-200 text-xs px-2 py-1.5 rounded border border-slate-800 focus:outline-none text-center font-mono"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <TooltipLabel label={`Eq. Len (${lenUnit})`} className="text-[9px] text-slate-500 uppercase block ml-1" />
                    <input 
                      type="number" min="0" step="0.1"
                      value={fitting.equivalentLength || ''}
                      onChange={(e) => updateFitting(fitting.id, 'equivalentLength', Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 text-slate-200 text-xs px-2 py-1.5 rounded border border-slate-800 focus:outline-none font-mono text-center"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => removeFitting(fitting.id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {fittings.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  No fittings added.
                </div>
              )}
            </div>
          </div>

          {/* Component/Equipment Drops */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-3">
              <Wind className="h-4.5 w-4.5 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Equipment Pressure Drops</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Filters ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={filterDrop || ''}
                  onChange={(e) => setFilterDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Coils ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={coilDrop || ''}
                  onChange={(e) => setCoilDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Dampers ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={damperDrop || ''}
                  onChange={(e) => setDamperDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Diffusers ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={diffuserDrop || ''}
                  onChange={(e) => setDiffuserDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Results */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-6 border-b border-indigo-500/20 pb-3">
              Total Static Pressure (Fan Sizing)
            </h3>

            <div className="space-y-5">
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Total Duct Length (Incl. Eq.)</span>
                <span className="text-sm font-mono text-slate-200">{results.totalEquivLength.toFixed(1)} <span className="text-[10px] text-slate-500">{lenUnit}</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Straight Duct Friction</span>
                <span className="text-sm font-mono text-slate-200">{results.straightDuctLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-slate-500">{pressUnit}</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Fittings Friction</span>
                <span className="text-sm font-mono text-slate-200">{results.fittingLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-slate-500">{pressUnit}</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Equipment Drops</span>
                <span className="text-sm font-mono text-rose-300">{results.equipmentLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-rose-500/60">{pressUnit}</span></span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-indigo-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase">System Static Pressure</span>
                <span className="text-[10px] text-slate-500">Unadjusted</span>
              </div>
              <div className="flex items-baseline space-x-2 text-indigo-100">
                <span className="text-3xl font-black font-mono tracking-tighter shadow-indigo-500/20">{results.totalStaticPressure.toFixed(isMetric ? 0 : 2)}</span>
                <span className="text-sm font-bold text-indigo-400">{pressUnit}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-950/50 border border-indigo-900/50 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-indigo-300 uppercase">Design / Fan Selection SP</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-indigo-400/60">+ Safety Factor</span>
                  <input
                    type="number" min="0" max="100"
                    value={safetyFactor || ''}
                    onChange={(e) => setSafetyFactor(Number(e.target.value) || 0)}
                    className="w-12 bg-slate-900 text-indigo-300 rounded px-1.5 py-1 text-xs font-mono focus:outline-none border border-indigo-800 text-center"
                  />
                  <span className="text-[10px] text-indigo-400/60">%</span>
                </div>
              </div>
              
              <div className="flex items-baseline space-x-2 text-white drop-shadow-md">
                <span className="text-4xl font-black font-mono tracking-tighter">{results.designStaticPressure.toFixed(isMetric ? 0 : 2)}</span>
                <span className="text-sm font-bold text-indigo-400">{pressUnit}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-start space-x-2 text-[10px] text-indigo-200/60 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-indigo-400/80" />
              <p>Design SP is used for selecting the fan/AHU. Ensure external static pressure (ESP) specifications of your chosen equipment meet or exceed this value.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
