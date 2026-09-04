import React, { useState, useEffect } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat, Activity, BookOpen } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import EngineeringAuditTrail from './common/EngineeringAuditTrail';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [edition, setEdition] = useState<'2025' | '2022' | '2019'>('2025');
  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [kitchenVolume, setKitchenVolume] = useState<number>(isMetric ? 30 : 1000);
  
  const [totalAirflow, setTotalAirflow] = useState<number>(0);
  
  const [qInf, setQInf] = useState<number>(0);
  const [phi, setPhi] = useState<number>(1.0);
  const [qFan, setQFan] = useState<number>(0);
  const [kitchenMode, setKitchenMode] = useState<'intermittent'|'continuous'>('intermittent');
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [bathroomMode, setBathroomMode] = useState<'intermittent'|'continuous'>('intermittent');

  useEffect(() => {
    import('../calculations/ventilation/Ashrae622Service').then(({ Ashrae622Service }) => {
       const res = Ashrae622Service.calculateVentilation({
          floorArea,
          bedrooms,
          isMetric,
          qInf,
          phi
       });
       setTotalAirflow(res.qTot);
       setQFan(res.qFan);
    });
  }, [floorArea, bedrooms, isMetric, qInf, phi]);

  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const areaUnit = isMetric ? 'm²' : 'ft²';
  const volUnit = isMetric ? 'm³' : 'ft³';

  // 62.2 Local Exhaust
  // Kitchen
  let kitchenExhaust = 0;
  if (kitchenMode === 'intermittent') {
    // 2022: Vented range hood: 100 CFM (50 L/s)
    kitchenExhaust = isMetric ? 50 : 100;
  } else {
    // 2022: Continuous: 5 ACH
    kitchenExhaust = isMetric ? (kitchenVolume * 5 / 3.6) : (kitchenVolume * 5 / 60);
  }

  // Bathrooms
  const bathroomIntEach = isMetric ? 25 : 50;
  const bathroomContEach = isMetric ? 10 : 20;
  const bathroomEach = bathroomMode === 'intermittent' ? bathroomIntEach : bathroomContEach;
  const bathroomTotal = bathroomEach * bathrooms;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
          ASHRAE 62.2 Standard Edition
        </h3>
        <select 
          value={edition}
          onChange={(e) => setEdition(e.target.value as '2025' | '2022' | '2019')}
          className="bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs border border-slate-800 focus:border-purple-500"
        >
          <option value="2025">ASHRAE 62.2-2025</option>
          <option value="2022">ASHRAE 62.2-2022</option>
          <option value="2019">ASHRAE 62.2-2019</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whole Dwelling */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3">
            <Home className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Whole-Dwelling Ventilation</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <TooltipLabel label={`Floor Area (${areaUnit})`} className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" step={isMetric ? 10 : 100} value={floorArea} onChange={(e) => setFloorArea(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>
            
            <div>
              <TooltipLabel label="Infiltration (Qinf)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" value={qInf} onChange={(e) => setQInf(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>
            <div>
              <TooltipLabel label="Infiltration Credit Factor (Φ)" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" max="1" step="0.1" value={phi} onChange={(e) => setPhi(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>

            <div>
              <TooltipLabel label="Bedrooms" className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
              <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 font-mono border border-slate-800 focus:border-purple-500 text-sm" />
            </div>
            
            <div className="bg-slate-950/50 p-6 rounded-xl border border-purple-900/30 flex flex-col items-center justify-center relative overflow-hidden mt-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10 text-center">Required Continuous Whole-Dwelling Airflow</p>
              <p className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
                {Math.ceil(totalAirflow).toLocaleString()}
                <span className="text-sm font-bold text-purple-400 uppercase tracking-widest ml-1">{flowUnit}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-2 z-10 text-center">Qtot (Eq. 4.1.1)</p>
              <div className="mt-4 pt-4 border-t border-purple-900/30 w-full text-center z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Fan Airflow (Qfan)</p>
                <p className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-md">
                  {Math.ceil(qFan).toLocaleString()}
                  <span className="text-sm font-bold text-purple-400 uppercase tracking-widest ml-1">{flowUnit}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-2">Qfan = Qtot - Φ * Qinf</p>
              
              <div className="mt-4 pt-4 border-t border-purple-900/30 w-full z-10 text-left">
                 <EngineeringAuditTrail
                    codeReference="ASHRAE 62.2"
                    title="Whole-Dwelling Audit Trail"
                    trail={[
                       { symbol: 'A_floor', name: 'Floor Area', value: floorArea, unit: areaUnit },
                       { symbol: 'N_br', name: 'Bedrooms', value: bedrooms, unit: '' },
                       { symbol: 'Qtot', name: 'Total Required Ventilation Rate', formula: isMetric ? '0.15 × A_floor + 3.5 × (N_br + 1)' : '0.03 × A_floor + 7.5 × (N_br + 1)', value: Math.ceil(totalAirflow), unit: flowUnit, reference: 'Eq. 4.1.1' },
                       { symbol: 'Qinf', name: 'Infiltration Rate', value: qInf, unit: flowUnit },
                       { symbol: 'Φ', name: 'Infiltration Credit Factor', value: phi, unit: '' },
                       { symbol: 'Qfan', name: 'Required Fan Airflow', formula: 'Qtot - Φ × Qinf', value: Math.ceil(qFan), unit: flowUnit, reference: 'Eq. 4.1.2' }
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Local Exhaust</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
              <h4 className="text-[10px] font-bold text-sky-400 uppercase mb-3 flex items-center"><ChefHat className="w-3 h-3 mr-1" /> Kitchen Exhaust</h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button onClick={() => setKitchenMode('intermittent')} className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors ${kitchenMode === 'intermittent' ? 'bg-sky-900/40 text-sky-400 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800/50'}`}>Vented Range Hood (Int.)</button>
                <button onClick={() => setKitchenMode('continuous')} className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-colors ${kitchenMode === 'continuous' ? 'bg-sky-900/40 text-sky-400 border-sky-500/50' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800/50'}`}>Continuous (5 ACH)</button>
              </div>
              
              {kitchenMode === 'continuous' && (
                <div className="mb-4">
                  <TooltipLabel label={`Kitchen Volume (${volUnit})`} className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />
                  <input type="number" min="0" value={kitchenVolume} onChange={(e) => setKitchenVolume(Number(e.target.value))} className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 font-mono text-sm border border-slate-800 focus:border-sky-500" />
                </div>
              )}
              
              <div className="flex justify-between items-end border-t border-slate-800/60 pt-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Required Flow</span>
                <span className="font-mono text-sky-300 font-bold text-lg leading-none">{Math.ceil(kitchenExhaust)} <span className="text-xs">{flowUnit}</span></span>
              </div>
            </div>

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
                    <option value="intermittent">Intermittent ({bathroomIntEach} {flowUnit}/ea)</option>
                    <option value="continuous">Continuous ({bathroomContEach} {flowUnit}/ea)</option>
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
          </div>
        </div>
      </div>
    </div>
  );
}
