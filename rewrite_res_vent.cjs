const fs = require('fs');

const code = `import React, { useState, useMemo } from 'react';
import { Home, Wind, CheckCircle2, AlertTriangle, Droplets, ChefHat, Activity, BookOpen, Info } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import EngineeringAuditTrail from './common/EngineeringAuditTrail';
import EngineeringStatusHeader from './common/EngineeringStatusHeader';
import { Ashrae622Service } from '../calculations/ventilation/Ashrae622Service';
import { ASHRAE_622_2025_LOCAL_EXHAUST } from '../data/ventilation/ashrae622/2025/data';
import { UnitConversionService } from '../services/UnitConversionService';

export default function ResidentialVentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  
  const [edition, setEdition] = useState<'2025' | '2022' | '2019'>('2025');
  const [floorArea, setFloorArea] = useState<number>(isMetric ? 150 : 1500);
  const [bedrooms, setBedrooms] = useState<number>(3);
  
  const [qInf, setQInf] = useState<number | ''>('');
  const [infiltrationVerified, setInfiltrationVerified] = useState<boolean>(false);

  const engineResult = useMemo(() => {
    let areaM2 = isMetric ? floorArea : UnitConversionService.ft2ToM2(floorArea);
    let credit = qInf === '' ? null : qInf;
    if (credit !== null && !isMetric) credit = UnitConversionService.cfmToLs(credit);

    return Ashrae622Service.calculateWholeDwelling({
      floorArea: areaM2,
      bedrooms,
      infiltrationCredit: credit,
      infiltrationVerified
    });
  }, [floorArea, bedrooms, qInf, infiltrationVerified, isMetric]);

  const flowUnit = isMetric ? 'L/s' : 'cfm';

  return (
    <div className="space-y-6">
      <EngineeringStatusHeader 
        status={engineResult.status} 
        moduleName={\`ASHRAE 62.2-\${edition} Whole-Dwelling\`} 
        details={engineResult.status === 'PASS' ? 'Ventilation requirements met' : 'Check requirements'} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Home className="w-5 h-5" />
            <h3 className="font-semibold text-white">Dwelling Parameters</h3>
          </div>
          <div className="space-y-4">
            <div>
              <TooltipLabel label={\`Floor Area (\${isMetric ? 'm²' : 'ft²'})\`} tooltip="Total conditioned area" />
              <input type="number" className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800" value={floorArea} onChange={e => setFloorArea(Number(e.target.value))} />
            </div>
            <div>
              <TooltipLabel label="Bedrooms" tooltip="Number of bedrooms" />
              <input type="number" className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Wind className="w-5 h-5" />
            <h3 className="font-semibold text-white">Infiltration Credit</h3>
          </div>
          <div className="space-y-4">
            <div>
              <TooltipLabel label={\`Measured Infiltration (\${flowUnit})\`} tooltip="Effective infiltration rate Qinf" />
              <input type="number" className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800" value={qInf} onChange={e => setQInf(e.target.value ? Number(e.target.value) : '')} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="rounded bg-slate-900 border-slate-700 text-cyan-500" checked={infiltrationVerified} onChange={e => setInfiltrationVerified(e.target.checked)} />
              Measurement verified by certified tester
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col items-center text-center">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Required Fan Airflow (Qfan)</h2>
        <div className="text-5xl font-black text-cyan-400 font-mono tracking-tight flex items-baseline gap-3">
          {(isMetric ? engineResult.qFan : UnitConversionService.lsToCfm(engineResult.qFan)).toFixed(1)}
          <span className="text-xl text-slate-500">{flowUnit}</span>
        </div>
        <p className="text-slate-500 text-sm mt-3 max-w-lg">
          Final required mechanical ventilation. Total required (Qtot) is {(isMetric ? engineResult.qTot : UnitConversionService.lsToCfm(engineResult.qTot)).toFixed(1)} {flowUnit}.
        </p>
      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', code);
