import React, { useState, useEffect } from 'react';
import { Wind, Activity, CheckCircle2, AlertTriangle, ChefHat } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';

export default function KitchenVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  // Hood Type
  const [hoodType, setHoodType] = useState<'wall' | 'island'>('wall');
  
  // Appliance Duty
  const [duty, setDuty] = useState<'light' | 'medium' | 'heavy' | 'extra'>('medium');
  
  // Equipment length
  const [equipmentLength, setEquipmentLength] = useState<number>(isMetric ? 3 : 10);
  
  // Optional parameters
  const [overhang, setOverhang] = useState<number>(isMetric ? 0.3 : 1.0);

  // Results
  const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);
  const [displayUnit, setDisplayUnit] = useState<'CFM' | 'L/s'>(isMetric ? 'L/s' : 'CFM');

  // Sync default when global unit system changes (optional, but good for consistency)
  useEffect(() => {
    setDisplayUnit(isMetric ? 'L/s' : 'CFM');
  }, [isMetric]);


  // Duct Sizing Velocity
  const [ductVelocity, setDuctVelocity] = useState<number>(isMetric ? 7.6 : 1500);
  const [ductArea, setDuctArea] = useState<number>(0);

  useEffect(() => {
    setDuctVelocity(isMetric ? 7.6 : 1500);
  }, [isMetric]);


  // Quick Presets
  const applyPreset = (dutyType: 'light' | 'medium' | 'heavy' | 'extra', lenImp: number, lenMet: number) => {
    setDuty(dutyType);
    setEquipmentLength(isMetric ? lenMet : lenImp);
  };


  useEffect(() => {
    // Basic rules of thumb for commercial kitchens (e.g. ASHRAE / IMC or similar approximations)
    // We'll calculate a simple CFM/ft or L/s/m rule based on hood type and duty.
    
    // Base rates in CFM per linear foot of hood
    // Wall-mounted canopy: Light 200, Medium 300, Heavy 400, Extra Heavy 550
    // Island canopy: Light 300, Medium 400, Heavy 600, Extra Heavy 700
    
    let baseRateCfmPerFt = 300;
    
    if (hoodType === 'wall') {
      if (duty === 'light') baseRateCfmPerFt = 200;
      else if (duty === 'medium') baseRateCfmPerFt = 300;
      else if (duty === 'heavy') baseRateCfmPerFt = 400;
      else if (duty === 'extra') baseRateCfmPerFt = 550;
    } else {
      if (duty === 'light') baseRateCfmPerFt = 300;
      else if (duty === 'medium') baseRateCfmPerFt = 400;
      else if (duty === 'heavy') baseRateCfmPerFt = 600;
      else if (duty === 'extra') baseRateCfmPerFt = 700;
    }

    // Convert length to feet for calc
    const lengthInFt = isMetric ? (equipmentLength * 3.28084) : equipmentLength;
    
    // Assume hood length = equipment length + (2 * overhang)
    const overhangInFt = isMetric ? (overhang * 3.28084) : overhang;
    const hoodLengthFt = lengthInFt + (2 * overhangInFt);

    const totalCfm = hoodLengthFt * baseRateCfmPerFt;

    if (isMetric) {
      const flowLs = totalCfm * 0.471947;
      setExhaustAirflow(flowLs);
      const flowM3s = flowLs / 1000;
      const areaM2 = ductVelocity > 0 ? flowM3s / ductVelocity : 0;
      setDuctArea(areaM2 * 10000);
    } else {
      setExhaustAirflow(totalCfm);
      const areaSqFt = ductVelocity > 0 ? totalCfm / ductVelocity : 0;
      setDuctArea(areaSqFt * 144);
    }
  }, [hoodType, duty, equipmentLength, overhang, isMetric, ductVelocity]);


  const isOverhangWarning = overhang < (isMetric ? 0.15 : 0.5);
  const isVelocityWarning = ductVelocity < (isMetric ? 2.54 : 500);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* INPUTS */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
            <ChefHat className="w-4 h-4 mr-2 text-rose-400" />
            Kitchen Hood Parameters
          </h3>
          
          <div className="space-y-5">

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Quick Equipment Presets</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyPreset('medium', 3, 0.9)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Fryer (Medium)
                </button>
                <button
                  onClick={() => applyPreset('medium', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Gas Range (Medium)
                </button>
                <button
                  onClick={() => applyPreset('medium', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Griddle (Medium)
                </button>
                <button
                  onClick={() => applyPreset('heavy', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Charbroiler (Heavy)
                </button>
                <button
                  onClick={() => applyPreset('extra', 5, 1.5)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Solid Fuel (Extra)
                </button>
              </div>
            </div>

            <div>
              <TooltipLabel
                label="Hood Configuration"
                tooltip="Wall-mounted canopies require less airflow than island canopies due to the wall preventing cross-drafts."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status="success"
              />
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-850">
                <button
                  type="button"
                  onClick={() => setHoodType('wall')}
                  className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    hoodType === 'wall'
                      ? 'bg-rose-650 text-white shadow-md shadow-rose-950/25 border border-rose-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Wall-Mounted
                </button>
                <button
                  type="button"
                  onClick={() => setHoodType('island')}
                  className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    hoodType === 'island'
                      ? 'bg-rose-650 text-white shadow-md shadow-rose-950/25 border border-rose-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Island Canopy
                </button>
              </div>
            </div>

            <div>
              <TooltipLabel
                label="Cooking Duty"
                tooltip="Light (ovens, steamers), Medium (griddles, fryers), Heavy (charbroilers), Extra Heavy (solid fuel)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status="success"
              />
              <select
                value={duty}
                onChange={(e) => setDuty(e.target.value as any)}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 cursor-pointer"
              >
                <option value="light">Light Duty (Ovens, Steamers)</option>
                <option value="medium">Medium Duty (Griddles, Fryers)</option>
                <option value="heavy">Heavy Duty (Gas Charbroilers)</option>
                <option value="extra">Extra Heavy (Solid Fuel/Wood)</option>
              </select>
            </div>

            <div>
              <TooltipLabel
                label={`Equipment Bank Length (${isMetric ? 'm' : 'ft'})`}
                tooltip="Total length of the cooking equipment line."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={equipmentLength > 0 ? 'success' : 'error'}
              />
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={equipmentLength}
                onChange={(e) => setEquipmentLength(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div>
              <TooltipLabel
                label={`Side Overhang (${isMetric ? 'm' : 'ft'})`}
                tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={isOverhangWarning ? 'warning' : 'success'}
              />
              <input
                type="number"
                min="0"
                step="0.05"
                value={overhang}
                onChange={(e) => setOverhang(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/60">
              <TooltipLabel
                label={`Target Duct Velocity (${isMetric ? 'm/s' : 'FPM'})`}
                tooltip="Code typically requires a minimum grease duct velocity of 500 FPM (2.5 m/s). Typical design range: 1500 - 2200 FPM (7.6 - 11 m/s) to keep grease particulates entrained."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
                status={isVelocityWarning ? 'warning' : 'success'}
              />
              <input
                type="number"
                min="1"
                step={isMetric ? "0.1" : "50"}
                value={ductVelocity}
                onChange={(e) => setDuctVelocity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-full">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-rose-400" />
            Exhaust Sizing Results
          </h3>

          <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 right-4 z-20 flex bg-slate-900/80 border border-slate-700 p-0.5 rounded-lg text-[9px] font-bold uppercase backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setDisplayUnit('CFM')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  displayUnit === 'CFM' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                CFM
              </button>
              <button
                type="button"
                onClick={() => setDisplayUnit('L/s')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  displayUnit === 'L/s' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                L/s
              </button>
            </div>
            <div className="text-center z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Exhaust Airflow</p>
              <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {displayUnit === 'L/s' 
                  ? Math.round(isMetric ? exhaustAirflow : exhaustAirflow * 0.471947).toLocaleString()
                  : Math.round(isMetric ? exhaustAirflow * 2.11888 : exhaustAirflow).toLocaleString()}
                <span className="text-lg font-bold text-rose-400 ml-2 uppercase tracking-widest">{displayUnit}</span>
              </p>
              {displayUnit === 'L/s' && (
                <p className="text-sm text-slate-500 font-mono mt-2">
                  {Math.round((isMetric ? exhaustAirflow : exhaustAirflow * 0.471947) * 3.6).toLocaleString()} m³/h
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
             <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">Make-Up Air Requirement</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Commercial kitchen exhaust systems typically require dedicated make-up air equal to 80-90% of the exhaust volume to prevent excessive negative building pressure. Check local mechanical codes.
                  </p>
                </div>
             </div>

             {(isOverhangWarning || isVelocityWarning) && (
               <div className="bg-amber-950/40 border border-amber-900/50 p-4 rounded-lg flex items-start space-x-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-500 uppercase">NFPA 96 Compliance Warning</h4>
                    <ul className="text-[11px] text-amber-200/70 mt-2 space-y-1 list-disc list-inside">
                      {isOverhangWarning && (
                        <li>Hood overhang should be at least {isMetric ? '0.15 m' : '6 inches (0.5 ft)'} on all open sides.</li>
                      )}
                      {isVelocityWarning && (
                        <li>Exhaust duct velocity must be at least {isMetric ? '2.54 m/s' : '500 FPM'} to ensure grease entrainment.</li>
                      )}
                    </ul>
                  </div>
               </div>
             )}
             
             <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg flex items-start space-x-3 mt-4">
                <Wind className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">Minimum Duct Area</h4>
                  <p className="text-2xl font-black text-white font-mono mt-1 tracking-tight">
                    {Math.round(ductArea).toLocaleString()} <span className="text-sm font-bold text-rose-400 uppercase">{isMetric ? 'cm²' : 'sq.in'}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Estimated cross-sectional area based on the target velocity to ensure code compliance for grease entrainment.
                  </p>
                </div>
             </div>

             <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex items-start space-x-3 mt-4">
                <ChefHat className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Calculation Standard (ASHRAE 154 / IMC 507)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    These calculations are based on the unlisted hood formula <span className="font-mono text-rose-400">Q = L × Base Rate</span>, established by <strong>ASHRAE Standard 154</strong> and the <strong>International Mechanical Code (IMC)</strong>. Base extraction rates (CFM per linear foot) are defined by the cooking equipment duty classification and hood canopy configuration.
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
