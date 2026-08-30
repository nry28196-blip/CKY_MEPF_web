const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { Wind, Activity, CheckCircle2, AlertTriangle, ChefHat, BookOpen, Calculator, Info, ThermometerSun, Maximize } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';

export default function KitchenVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [hoodStandard, setHoodStandard] = useState<'unlisted' | 'listed' | 'performance'>('unlisted');
  
  // Base Parameters
  const [hoodType, setHoodType] = useState<'wall' | 'single_island' | 'double_island' | 'backshelf' | 'eyebrow'>('wall');
  const [duty, setDuty] = useState<'light' | 'medium' | 'heavy' | 'extra'>('medium');
  const [equipmentLength, setEquipmentLength] = useState<number>(isMetric ? 3 : 10);
  const [overhang, setOverhang] = useState<number>(isMetric ? 0.3 : 1.0);
  
  // Performance (C&C) Parameters
  const [captureVelocity, setCaptureVelocity] = useState<number>(isMetric ? 0.4 : 80); // 80 FPM or 0.4 m/s
  const [hoodDepth, setHoodDepth] = useState<number>(isMetric ? 1.2 : 4); // 4 ft or 1.2m
  
  // Listed Parameters (UL 710)
  const [listedFlowPerLength, setListedFlowPerLength] = useState<number>(isMetric ? 300 : 200);

  // Localized MUA Breakdown (% of Exhaust)
  const [muaTransfer, setMuaTransfer] = useState<number>(20);
  const [muaCeiling, setMuaCeiling] = useState<number>(40);
  const [muaPerimeter, setMuaPerimeter] = useState<number>(20);
  const [muaInternal, setMuaInternal] = useState<number>(0);

  const [ductVelocity, setDuctVelocity] = useState<number>(isMetric ? 7.6 : 1500);

  // IMC 507.5 Base Rates (CFM per linear foot of hood)
  // [Hood Type][Duty] = CFM/ft
  const imcRates = {
    wall: { light: 200, medium: 300, heavy: 400, extra: 550 },
    single_island: { light: 400, medium: 500, heavy: 600, extra: 700 },
    double_island: { light: 250, medium: 300, heavy: 400, extra: 550 },
    backshelf: { light: 250, medium: 300, heavy: 400, extra: 0 },
    eyebrow: { light: 250, medium: 250, heavy: 250, extra: 0 },
  };

  const lenUnit = isMetric ? 'm' : 'ft';
  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const velUnit = isMetric ? 'm/s' : 'FPM';
  const areaUnit = isMetric ? 'cm²' : 'sq.in';

  // State for results
  const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);
  const [ductArea, setDuctArea] = useState<number>(0);
  const [hoodLength, setHoodLength] = useState<number>(0);
  const [faceVelocity, setFaceVelocity] = useState<number>(0);
  
  const notAllowed = hoodStandard === 'unlisted' && imcRates[hoodType][duty] === 0;
  
  const totalMuaRatio = muaTransfer + muaCeiling + muaPerimeter + muaInternal;

  useEffect(() => {
    let cfm = 0;
    
    // Hood Length = Equipment Length + (2 * overhang for side overhangs, simplified)
    const eqLenFt = isMetric ? equipmentLength * 3.28084 : equipmentLength;
    const overhangFt = isMetric ? overhang * 3.28084 : overhang;
    const depthFt = isMetric ? hoodDepth * 3.28084 : hoodDepth;
    const hLenFt = eqLenFt + (2 * overhangFt);
    
    if (hoodStandard === 'unlisted') {
      const baseRateCfm = imcRates[hoodType][duty];
      cfm = hLenFt * baseRateCfm;
    } else if (hoodStandard === 'listed') {
      if (isMetric) {
         const flowLs = listedFlowPerLength * (equipmentLength + 2*overhang);
         cfm = flowLs * 2.11888;
      } else {
         cfm = listedFlowPerLength * hLenFt;
      }
    } else if (hoodStandard === 'performance') {
      // Q = V * A
      const faceAreaSqFt = hLenFt * depthFt;
      const targetVelFpm = isMetric ? captureVelocity * 196.85 : captureVelocity;
      cfm = targetVelFpm * faceAreaSqFt;
    }

    // Convert back to metric if needed
    const finalFlow = isMetric ? cfm * 0.471947 : cfm;
    setExhaustAirflow(finalFlow);
    setHoodLength(isMetric ? hLenFt / 3.28084 : hLenFt);

    // Calculate actual face velocity for unlisted/listed
    const faceAreaSqFt = hLenFt * depthFt;
    const actualVelFpm = faceAreaSqFt > 0 ? cfm / faceAreaSqFt : 0;
    setFaceVelocity(isMetric ? actualVelFpm / 196.85 : actualVelFpm);

    // Duct Area
    if (ductVelocity > 0) {
      if (isMetric) {
         const m3s = finalFlow / 1000;
         setDuctArea((m3s / ductVelocity) * 10000);
      } else {
         setDuctArea((finalFlow / ductVelocity) * 144);
      }
    } else {
      setDuctArea(0);
    }
  }, [hoodStandard, hoodType, duty, equipmentLength, overhang, listedFlowPerLength, captureVelocity, hoodDepth, ductVelocity, isMetric]);

  const muaTotalFlow = exhaustAirflow * (totalMuaRatio / 100);
  const muaTransferFlow = exhaustAirflow * (muaTransfer / 100);
  const muaCeilingFlow = exhaustAirflow * (muaCeiling / 100);
  const muaPerimeterFlow = exhaustAirflow * (muaPerimeter / 100);
  const muaInternalFlow = exhaustAirflow * (muaInternal / 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
            <ChefHat className="w-4 h-4 mr-2 text-rose-400" />
            Kitchen Hood Parameters
          </h3>
          
          <div className="flex bg-slate-950 p-1 rounded-lg mb-6 border border-slate-800">
            <button 
              onClick={() => setHoodStandard('unlisted')}
              className={\`flex-1 py-1.5 text-[10px] font-bold uppercase rounded \${hoodStandard === 'unlisted' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'}\`}
            >
              Unlisted (IMC)
            </button>
            <button 
              onClick={() => setHoodStandard('listed')}
              className={\`flex-1 py-1.5 text-[10px] font-bold uppercase rounded \${hoodStandard === 'listed' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'}\`}
            >
              Listed
            </button>
            <button 
              onClick={() => setHoodStandard('performance')}
              className={\`flex-1 py-1.5 text-[10px] font-bold uppercase rounded \${hoodStandard === 'performance' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'}\`}
            >
              C&C (F1704)
            </button>
          </div>

          <div className="space-y-4">
            {(hoodStandard === 'unlisted' || hoodStandard === 'performance') && (
              <div>
                <TooltipLabel label="Cooking Equipment Duty" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
                <select 
                  value={duty} 
                  onChange={(e) => setDuty(e.target.value as any)}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm focus:outline-none border border-slate-800 focus:border-rose-500"
                >
                  <option value="light">Light Duty (Ovens, Steamers)</option>
                  <option value="medium">Medium Duty (Fryers, Griddles)</option>
                  <option value="heavy">Heavy Duty (Charbroilers, Woks)</option>
                  <option value="extra">Extra-Heavy Duty (Solid Fuel)</option>
                </select>
              </div>
            )}
            
            <div>
              <TooltipLabel label="Hood Configuration" className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
              <select 
                value={hoodType} 
                onChange={(e) => setHoodType(e.target.value as any)}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm focus:outline-none border border-slate-800 focus:border-rose-500"
              >
                <option value="wall">Wall-Mounted Canopy</option>
                <option value="single_island">Single Island Canopy</option>
                <option value="double_island">Double Island Canopy</option>
                <option value="backshelf">Backshelf / Pass-over</option>
                <option value="eyebrow">Eyebrow</option>
              </select>
            </div>
            
            {hoodStandard === 'listed' && (
              <div className="pt-2 border-t border-slate-800/60">
                 <TooltipLabel label={\`Listed Extraction Rate (\${isMetric ? 'L/s per m' : 'CFM per ft'})\`} className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
                 <input 
                   type="number" min="0" step="10" 
                   value={listedFlowPerLength} 
                   onChange={e => setListedFlowPerLength(Number(e.target.value))}
                   className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono border border-slate-800 focus:border-rose-500"
                 />
                 <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wide">From Manufacturer Data</p>
              </div>
            )}

            {hoodStandard === 'performance' && (
              <div className="pt-2 border-t border-slate-800/60">
                 <TooltipLabel label={\`Target Capture Velocity (\${velUnit})\`} className="block text-[10px] font-bold text-rose-400 mb-1.5 uppercase" />
                 <input 
                   type="number" min="0" step={isMetric ? 0.05 : 10} 
                   value={captureVelocity} 
                   onChange={e => setCaptureVelocity(Number(e.target.value))}
                   className="w-full bg-rose-950/20 text-rose-200 rounded-lg px-4 py-2 text-sm font-mono border border-rose-900/50 focus:border-rose-500"
                 />
                 <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wide">Typically 50-150 FPM (0.25-0.75 m/s)</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
              <div>
                <TooltipLabel label={\`Eq. Length (\${lenUnit})\`} className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
                <input 
                  type="number" min="0.1" step="0.1" 
                  value={equipmentLength} 
                  onChange={e => setEquipmentLength(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm font-mono border border-slate-800 focus:border-rose-500"
                />
              </div>
              <div>
                <TooltipLabel label={\`Side Overhang (\${lenUnit})\`} className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
                <input 
                  type="number" min="0" step="0.05" 
                  value={overhang} 
                  onChange={e => setOverhang(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm font-mono border border-slate-800 focus:border-rose-500"
                />
              </div>
              <div className="col-span-2">
                <TooltipLabel label={\`Hood Depth (\${lenUnit})\`} className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
                <input 
                  type="number" min="0.1" step="0.1" 
                  value={hoodDepth} 
                  onChange={e => setHoodDepth(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm font-mono border border-slate-800 focus:border-rose-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
             <Wind className="w-4 h-4 mr-2 text-sky-400" />
             Localized Make-Up Air (MUA)
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase">Total MUA Ratio</span>
               <span className={\`text-xs font-bold font-mono \${totalMuaRatio > 95 ? 'text-red-400' : totalMuaRatio < 75 ? 'text-amber-400' : 'text-sky-400'}\`}>
                 {totalMuaRatio}%
               </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                  <span>Transfer Air (Dining)</span>
                  <span className="font-mono text-slate-400">{muaTransfer}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={muaTransfer} 
                  onChange={e => setMuaTransfer(Number(e.target.value))}
                  className="w-full accent-slate-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                  <span>Ceiling Supply (Diffusers)</span>
                  <span className="font-mono text-sky-400">{muaCeiling}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={muaCeiling} 
                  onChange={e => setMuaCeiling(Number(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                  <span>Front Face / Perimeter</span>
                  <span className="font-mono text-indigo-400">{muaPerimeter}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={muaPerimeter} 
                  onChange={e => setMuaPerimeter(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-[9px] text-slate-500 mb-1 uppercase tracking-wide">
                  <span>Internal Short-Circuit</span>
                  <span className="font-mono text-amber-500">{muaInternal}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" 
                  value={muaInternal} 
                  onChange={e => setMuaInternal(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-800/60">
              <TooltipLabel label={\`Target Duct Velocity (\${velUnit})\`} className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" />
              <input 
                type="number" min="1" step={isMetric ? 0.1 : 50} 
                value={ductVelocity} 
                onChange={e => setDuctVelocity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono border border-slate-800 focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* RESULTS */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-sm font-semibold text-white flex items-center">
              <Activity className="w-4 h-4 mr-2 text-rose-400" />
              Kitchen Exhaust Results
            </h3>
            <div className="flex space-x-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest border border-slate-800 px-2 py-1 rounded bg-slate-950">
                L: {hoodLength.toFixed(2)} {lenUnit}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest border border-slate-800 px-2 py-1 rounded bg-slate-950">
                D: {hoodDepth.toFixed(2)} {lenUnit}
              </span>
            </div>
          </div>
          
          {notAllowed ? (
            <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl flex flex-col items-center justify-center text-center">
               <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
               <h4 className="text-sm font-bold text-red-400 uppercase">Configuration Not Allowed</h4>
               <p className="text-xs text-red-300 mt-2">
                 Per IMC 507, {duty} duty equipment is not permitted under a {hoodType.replace('_', ' ')} hood.
               </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-950/50 p-6 rounded-xl border border-rose-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required Exhaust</p>
                  <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
                    {Math.ceil(exhaustAirflow).toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
                  
                  <div className="mt-4 flex items-center justify-between w-full px-4 text-[10px] font-mono z-10 border-t border-slate-800 pt-3">
                     <div className="text-slate-500">
                        {hoodStandard === 'unlisted' && \`Base Rate: \${imcRates[hoodType][duty]} \${isMetric ? 'L/s/m' : 'CFM/ft'}\`}
                        {hoodStandard === 'listed' && \`Listed Rate: \${listedFlowPerLength} \${isMetric ? 'L/s/m' : 'CFM/ft'}\`}
                        {hoodStandard === 'performance' && \`Target C&C: \${captureVelocity} \${velUnit}\`}
                     </div>
                     <div className="text-rose-300/80">
                        Face Vel: {faceVelocity.toFixed(0)} {velUnit}
                     </div>
                  </div>
                </div>
                
                <div className="bg-slate-950/50 p-6 rounded-xl border border-sky-900/30 relative overflow-hidden group flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-bl from-sky-500/5 to-transparent" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10 text-center">Make-Up Air ({totalMuaRatio}%)</p>
                  <p className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md z-10 text-center mb-4">
                    {Math.ceil(muaTotalFlow).toLocaleString()} <span className="text-sm font-bold text-sky-400 uppercase tracking-widest">{flowUnit}</span>
                  </p>
                  
                  <div className="flex-grow flex flex-col justify-end space-y-2 z-10 text-[10px] font-mono w-full px-2">
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-slate-500">Transfer ({muaTransfer}%)</span>
                        <span className="text-slate-300">{Math.round(muaTransferFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-sky-500/70">Ceiling ({muaCeiling}%)</span>
                        <span className="text-sky-300">{Math.round(muaCeilingFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-indigo-500/70">Front/Perimeter ({muaPerimeter}%)</span>
                        <span className="text-indigo-300">{Math.round(muaPerimeterFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-amber-500/70">Internal ({muaInternal}%)</span>
                        <span className="text-amber-300">{Math.round(muaInternalFlow).toLocaleString()}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Minimum Duct Area</h4>
                   <div className="flex items-end">
                     <span className="text-2xl font-black text-slate-200 font-mono leading-none">{Math.round(ductArea).toLocaleString()}</span>
                     <span className="text-xs font-bold text-slate-500 uppercase ml-2 mb-0.5">{areaUnit}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-2">Required cross-section to maintain {ductVelocity} {velUnit}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Design Guidelines</h4>
                   <ul className="text-[9px] text-slate-400 space-y-1.5 list-disc list-inside">
                     {muaInternal > 10 && <li className="text-amber-400">High internal MUA (&gt;10%) may interfere with thermal plume capture.</li>}
                     {totalMuaRatio < 80 && <li className="text-amber-400">Low total MUA may cause negative building pressure.</li>}
                     {faceVelocity < (isMetric ? 0.25 : 50) && <li className="text-amber-400">Low face velocity may result in poor spill containment.</li>}
                     <li>Duct velocity min 500 FPM (2.54 m/s) per IMC to prevent grease accumulation.</li>
                   </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', content);
console.log('Replaced KitchenVentilationCalc');
