const fs = require('fs');

const code = `import React, { useState, useMemo } from 'react';
import { Wind, Plus, Trash2, Database } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import EngineeringStatusHeader from './common/EngineeringStatusHeader';
import { Ashrae621ExhaustService, ExhaustInput } from '../calculations/ventilation/Ashrae621ExhaustService';
import { ASHRAE_621_2025_EXHAUST_RATES } from '../data/ventilation/ashrae621/2025/data';
import { VentilationValidationService } from '../calculations/ventilation/VentilationValidationService';
import { UnitConversionService } from '../services/UnitConversionService';

interface ExhaustRow {
  id: string;
  name: string;
  categoryId: string;
  quantity: number | ''; 
  designExhaust: number | '';
}

export default function Ashrae621ExhaustCalc({ edition = '2025' }: { edition?: string }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [rows, setRows] = useState<ExhaustRow[]>([
    {
      id: '1',
      name: 'Public Restroom 1',
      categoryId: 'toilet_public',
      quantity: 2,
      designExhaust: 50
    }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Math.random().toString(), name: \`Space \${rows.length + 1}\`, categoryId: 'toilet_public', quantity: 1, designExhaust: 25 }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof ExhaustRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const results = useMemo(() => {
    const calcRows = rows.map(r => {
      const exhaustType = ASHRAE_621_2025_EXHAUST_RATES.find(e => e.id === r.categoryId) || null;
      
      let qty = r.quantity === '' ? null : r.quantity;
      if (qty !== null && exhaustType?.unitType === 'm2' && !isMetric) {
        qty = UnitConversionService.ft2ToM2(qty);
      }
      
      let dExhaust = r.designExhaust === '' ? null : r.designExhaust;
      if (dExhaust !== null && !isMetric) {
        dExhaust = UnitConversionService.cfmToLs(dExhaust);
      }
      
      const res = Ashrae621ExhaustService.calculate({ exhaustType, qty, designExhaust: dExhaust });
      
      return { row: r, result: res };
    });
    
    const status = VentilationValidationService.aggregateStatus(calcRows.map(r => r.result.status));
    
    return { calcRows, status };
  }, [rows, isMetric]);

  return (
    <div className="space-y-6">
      <EngineeringStatusHeader 
        status={results.status} 
        moduleName={\`ASHRAE 62.1-\${edition} Exhaust\`}
        details={results.status === 'PASS' ? 'All exhaust requirements met' : 'Check requirements'} 
      />
      
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-rose-400">
            <Wind className="w-5 h-5" />
            <h3 className="font-semibold text-white">Space Exhaust Rates</h3>
          </div>
          <button onClick={addRow} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Space
          </button>
        </div>

        <div className="space-y-4">
          {results.calcRows.map(({ row, result }) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-950/50 p-4 rounded-lg border border-slate-800 relative">
              {rows.length > 1 && (
                <button onClick={() => removeRow(row.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="col-span-3">
                <TooltipLabel label="Space Name" tooltip="Identifier" />
                <input type="text" className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm border border-slate-700" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
              </div>
              
              <div className="col-span-3">
                <TooltipLabel label="Category" tooltip="ASHRAE 62.1 Exhaust Space" />
                <select className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm border border-slate-700" value={row.categoryId} onChange={(e) => updateRow(row.id, 'categoryId', e.target.value)}>
                  {ASHRAE_621_2025_EXHAUST_RATES.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-2">
                <TooltipLabel label={\`Quantity (\${result.unitType === 'm2' ? (isMetric ? 'm²' : 'ft²') : result.unitType})\`} tooltip="Multiplier" />
                <input type="number" min="0" className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm border border-slate-700" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', e.target.value ? Number(e.target.value) : '')} />
              </div>
              
              <div className="col-span-2">
                <TooltipLabel label={\`Design (\${isMetric ? 'L/s' : 'cfm'})\`} tooltip="Proposed actual exhaust" />
                <input type="number" min="0" className="w-full bg-slate-900 text-white rounded px-3 py-2 text-sm border border-slate-700" value={row.designExhaust} onChange={(e) => updateRow(row.id, 'designExhaust', e.target.value ? Number(e.target.value) : '')} />
              </div>
              
              <div className="col-span-2 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400 mb-1">Required: {isMetric ? result.requiredExhaust.toFixed(1) : UnitConversionService.lsToCfm(result.requiredExhaust).toFixed(1)} {isMetric ? 'L/s' : 'cfm'}</div>
                <div className={\`px-2 py-1 rounded text-xs font-bold text-center \${result.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : result.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}\`}>
                  {result.status} (Class {result.exhaustClass})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`
fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', code);
