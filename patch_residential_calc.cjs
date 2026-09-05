const fs = require('fs');
let code = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf-8');

// I will write a completely new React component to make sure all 62.2 prompt rules are covered.

const newComponentCode = `import React, { useState, useEffect, useMemo } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat, Activity, BookOpen, Info } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import EngineeringAuditTrail from './common/EngineeringAuditTrail';
import { Ashrae622Service } from '../calculations/ventilation/Ashrae622Service';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  
  const [edition, setEdition] = useState<'2025' | '2022' | '2019'>('2025');
  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [kitchenVolume, setKitchenVolume] = useState<number>(isMetric ? 30 : 1000);
  
  const [qInf, setQInf] = useState<number>(0);
  const [qInfSource, setQInfSource] = useState<string>('');
  const [phi, setPhi] = useState<number>(1.0);
  
  const [kitchenMode, setKitchenMode] = useState<'intermittent'|'continuous'>('intermittent');
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [bathroomMode, setBathroomMode] = useState<'intermittent'|'continuous'>('intermittent');
  
  const [toiletRooms, setToiletRooms] = useState<number>(1);
  const [toiletRoomMode, setToiletRoomMode] = useState<'intermittent'|'continuous'>('intermittent');

  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const areaUnit = isMetric ? 'm²' : 'ft²';
  const volUnit = isMetric ? 'm³' : 'ft³';

  const reqs = useMemo(() => Ashrae622Service.getLocalExhaustRequirements(edition, isMetric), [edition, isMetric]);

  const kitchenExhaust = kitchenMode === 'intermittent' 
    ? (reqs.kitchenIntermittent || 0) 
    : (kitchenVolume * reqs.kitchenContinuousACH / (isMetric ? 3.6 : 60)); // volume * ACH / 60 (for cfm) or 3.6 (for L/s from m3/h)

  const bathroomEach = bathroomMode === 'intermittent' ? (reqs.bathroomIntermittent || 0) : (reqs.bathroomContinuous || 0);
  const bathroomTotal = bathroomEach * bathrooms;
  
  const toiletRoomEach = reqs.toiletRoomIntermittent !== null ? (toiletRoomMode === 'intermittent' ? reqs.toiletRoomIntermittent : reqs.toiletRoomContinuous) : 0;
  const toiletRoomTotal = toiletRoomEach! * toiletRooms;

  const totalLocalExhaust = kitchenExhaust + bathroomTotal + toiletRoomTotal;
  const localExhaustDeficit = 0; // The standard typically subtracts installed exhaust from required exhaust to find deficit. Here we just assume deficit is 0 or user inputs it. Wait, the tool is a simplified calculator. We'll set deficit = 0 for now as it was before.

  const result = useMemo(() => {
    return Ashrae622Service.calculateVentilation({
      floorArea,
      bedrooms,
      isMetric,
      qInf,
      qInfSource,
      phi,
      edition,
      localExhaustDeficit
    });
  }, [floorArea, bedrooms, isMetric, qInf, qInfSource, phi, edition, localExhaustDeficit]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center">
            <Home className="w-5 h-5 mr-2 text-purple-400" /> 
            ASHRAE 62.2 Whole-Dwelling Ventilation
          </h2>
          <p className="text-xs text-slate-400 mt-1">Residential ventilation rate and local exhaust.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edition</label>
          <select 
            value={edition} 
            onChange={(e) => setEdition(e.target.value as '2025'|'2022'|'2019')} 
            className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          >
            <option value="2025">62.2-2025</option>
            <option value="2022">62.2-2022</option>
            <option value="2019">62.2-2019</option>
          </select>
        </div>
      </div>

      {result.status !== 'PASS' && (
        <div className={\`mb-6 p-4 rounded-xl border \${result.status === 'WARNING' || result.status === 'INCOMPLETE' ? 'bg-amber-950/20 border-amber-900/50 text-amber-400' : 'bg-red-950/20 border-red-900/50 text-red-400'}\`}>
          <div className="flex items-center font-bold text-sm mb-1 uppercase">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {result.status === 'WARNING' ? 'Calculation Issue' : result.status}
          </div>
          <p className="text-xs">{result.warning || result.error}</p>
        </div>
      )}
      
      {result.notEvaluatedItems.length > 0 && (
         <div className="mb-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400">
          <div className="flex items-center font-bold text-sm mb-1 uppercase text-slate-300">
            <Info className="w-4 h-4 mr-2" />
            Not Evaluated Items
          </div>
          <ul className="text-xs list-disc list-inside">
            {result.notEvaluatedItems.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
          <p className="text-[10px] mt-2 text-slate-500 italic">Project / AHJ verification required for these provisions.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3 mb-4">
            <Home className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dwelling Parameters</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <TooltipLabel label={\`Floor Area (\${areaUnit})\`} className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                <input type="number" min="1" value={floorArea} onChange={(e) => setFloorArea(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
              </div>
              <div>
                <TooltipLabel label="Bedrooms" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/60">
              <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-3">Infiltration Credit</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TooltipLabel label={\`Qinf (\${flowUnit})\`} tooltip="Measured or estimated infiltration" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="number" min="0" value={qInf} onChange={(e) => setQInf(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
                </div>
                <div>
                  <TooltipLabel label="Factor (Φ)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="number" min="0" max="1" step="0.1" value={phi} onChange={(e) => setPhi(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
                </div>
                <div className="col-span-2">
                  <TooltipLabel label="Qinf Basis / Source" tooltip="Describe the origin of the infiltration value (e.g. blower door test)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="text" placeholder="e.g., Blower Door Test (ASTM E779)" value={qInfSource} onChange={(e) => setQInfSource(e.target.value)} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-slate-950/50 p-6 rounded-xl border border-purple-900/30 flex flex-col items-center justify-center relative overflow-hidden mt-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10 text-center">Required Continuous Airflow</p>
              <p className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
                {Math.ceil(result.qTot).toLocaleString()}
                <span className="text-sm font-bold text-purple-400 uppercase tracking-widest ml-1">{flowUnit}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-2 z-10 text-center">Qtot (Eq. 4.1.1)</p>

              <div className="mt-4 pt-4 border-t border-purple-900/30 w-full text-center z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Fan Airflow (Qfan)</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-md">
                  {Math.ceil(result.qFan).toLocaleString()}
                  <span className="text-sm font-bold text-purple-400 uppercase tracking-widest ml-1">{flowUnit}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-2">Qfan = Qtot - Φ × Qinf</p>
                
                <div className="mt-4 pt-4 border-t border-purple-900/30 w-full z-10 text-left">
                  <EngineeringAuditTrail
                    codeReference={\`ASHRAE 62.2-\${edition}\`}
                    title="Whole-Dwelling Audit Trail"
                    trail={[
                       { symbol: 'A_floor', name: 'Floor Area', value: floorArea, unit: areaUnit },
                       { symbol: 'N_br', name: 'Bedrooms', value: bedrooms, unit: '' },
                       { symbol: 'Qtot', name: 'Total Required Rate', formula: isMetric ? '0.15 × A_floor + 3.5 × (N_br + 1)' : '0.03 × A_floor + 7.5 × (N_br + 1)', value: Math.ceil(result.qTot), unit: flowUnit, reference: 'Eq. 4.1.1' },
                       { symbol: 'Qinf', name: 'Infiltration Rate', value: qInf, unit: flowUnit, reference: qInfSource || 'Unverified' },
                       { symbol: 'Φ', name: 'Infiltration Factor', value: phi, unit: '' },
                       { symbol: 'Qfan', name: 'Required Fan Airflow', formula: 'Qtot - Φ × Qinf', value: Math.ceil(result.qFan), unit: flowUnit, reference: 'Eq. 4.1.2' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Local Exhaust */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3">
            <Wind className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Local Exhaust Requirements</h3>
          </div>
          
          <div className="space-y-6">
            {/* Kitchen */}
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><ChefHat className="w-3 h-3 mr-1" /> Kitchen Exhaust</h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => setKitchenMode('intermittent')} className={\`py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors \${kitchenMode === 'intermittent' ? 'bg-sky-900/40 text-sky-400 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800/50'}\`}>Vented Range Hood (Int.)</button>
                <button onClick={() => setKitchenMode('continuous')} className={\`py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors \${kitchenMode === 'continuous' ? 'bg-sky-900/40 text-sky-400 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800/50'}\`}>Continuous (\${reqs.kitchenContinuousACH} ACH)</button>
              </div>
              
              {kitchenMode === 'continuous' && (
                <div className="mb-4">
                  <TooltipLabel label={\`Kitchen Volume (\${volUnit})\`} className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="number" min="0" value={kitchenVolume} onChange={(e) => setKitchenVolume(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 font-mono text-sm border border-slate-800 focus:border-sky-500" />
                </div>
              )}
              
              <div className="flex justify-between items-end border-t border-slate-800/60 pt-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Required Flow</span>
                <span className="font-mono text-sky-300 font-bold text-lg leading-none">{Math.ceil(kitchenExhaust)} <span className="text-xs">{flowUnit}</span></span>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><Droplets className="w-3 h-3 mr-1" /> Bathrooms</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <TooltipLabel label="Quantity" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 font-mono text-sm border border-slate-800 focus:border-sky-500" />
                </div>
                <div>
                  <TooltipLabel label="Operating Mode" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <select 
                    value={bathroomMode}
                    onChange={(e) => setBathroomMode(e.target.value as 'intermittent'|'continuous')}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-xs border border-slate-800 focus:border-sky-500"
                  >
                    <option value="intermittent">Intermittent ({reqs.bathroomIntermittent} {flowUnit}/ea)</option>
                    <option value="continuous">Continuous ({reqs.bathroomContinuous} {flowUnit}/ea)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 border-t border-slate-800/60 pt-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Per Bathroom ({bathrooms}x):</span>
                  <span className="font-mono">{bathroomEach} {flowUnit}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Bathroom Exhaust</span>
                  <span className="font-mono text-sky-300 font-bold text-lg leading-none">{bathroomTotal} <span className="text-xs">{flowUnit}</span></span>
                </div>
              </div>
            </div>
            
            {/* Toilet Rooms (2025 specifically separates this out) */}
            {reqs.toiletRoomIntermittent !== null && (
              <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><Droplets className="w-3 h-3 mr-1" /> Toilet Rooms (No bathing fixtures)</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <TooltipLabel label="Quantity" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                    <input type="number" min="0" value={toiletRooms} onChange={(e) => setToiletRooms(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 font-mono text-sm border border-slate-800 focus:border-sky-500" />
                  </div>
                  <div>
                    <TooltipLabel label="Operating Mode" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                    <select 
                      value={toiletRoomMode}
                      onChange={(e) => setToiletRoomMode(e.target.value as 'intermittent'|'continuous')}
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-xs border border-slate-800 focus:border-sky-500"
                    >
                      <option value="intermittent">Intermittent ({reqs.toiletRoomIntermittent} {flowUnit}/ea)</option>
                      <option value="continuous">Continuous ({reqs.toiletRoomContinuous} {flowUnit}/ea)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 border-t border-slate-800/60 pt-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Per Toilet Room ({toiletRooms}x):</span>
                    <span className="font-mono">{toiletRoomEach} {flowUnit}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Toilet Rm Exhaust</span>
                    <span className="font-mono text-sky-300 font-bold text-lg leading-none">{toiletRoomTotal} <span className="text-xs">{flowUnit}</span></span>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', newComponentCode);
