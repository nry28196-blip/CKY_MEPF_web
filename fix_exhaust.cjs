const fs = require('fs');

let content = `import React, { useState } from 'react';
import { Wind, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import EngineeringStatusHeader from './common/EngineeringStatusHeader';
import ValidatedInput from './ValidatedInput';
import { Ashrae621ExhaustService } from '../calculations/ventilation/Ashrae621ExhaustService';

interface ExhaustRow {
  id: string;
  name: string;
  ashraeCategory: string;
  ashraeQuantity: number;
  ashraeUnit: 'area' | 'fixture' | 'custom';
  ashraeRate: number;
  imcRate: number;
  projectRate: number;
  mfgRate: number;
  ashraeClass: string;
}

export default function Ashrae621ExhaustCalc({ edition = '2025' }: { edition?: string }) {
  const { unitSystem } = useUnit();
  const flowUnit = unitSystem === 'metric' ? 'L/s' : 'cfm';
  
  const [rows, setRows] = useState<ExhaustRow[]>([
    {
      id: '1',
      name: 'Public Restroom',
      ashraeCategory: 'Bathrooms (public)',
      ashraeQuantity: 2,
      ashraeUnit: 'fixture',
      ashraeRate: unitSystem === 'metric' ? 25 : 50,
      imcRate: unitSystem === 'metric' ? 25 : 50,
      projectRate: 0,
      mfgRate: 0,
      ashraeClass: 'Class 2'
    }
  ]);

  const addRow = () => {
    setRows([...rows, {
      id: Math.random().toString(),
      name: 'New Space',
      ashraeCategory: 'Custom',
      ashraeQuantity: 1,
      ashraeUnit: 'custom',
      ashraeRate: 0,
      imcRate: 0,
      projectRate: 0,
      mfgRate: 0,
      ashraeClass: 'Class 1'
    }]);
  };

  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
  
  const updateRow = (id: string, field: keyof ExhaustRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const evaluateRows = () => {
    return rows.map(r => {
      const ashraeTotal = r.ashraeQuantity * r.ashraeRate;
      return {
        row: r,
        result: Ashrae621ExhaustService.evaluateSpace({
          ashraeRate: ashraeTotal,
          imcRate: r.imcRate,
          projectRate: r.projectRate,
          mfgRate: r.mfgRate,
          ashraeClass: r.ashraeClass
        })
      };
    });
  };

  const evaluated = evaluateRows();
  const totalGoverning = evaluated.reduce((sum, e) => sum + e.result.governingRequired, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <EngineeringStatusHeader 
        status="PASS" 
        message="Local exhaust requirements evaluated against competing standards." 
      />
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
          <Wind className="w-4 h-4 mr-2 text-sky-400" />
          Exhaust Evaluation (ASHRAE 62.1 vs IMC vs Project) - {edition}
        </h3>
        
        <div className="space-y-4">
          {evaluated.map((e, index) => (
            <div key={e.row.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <input 
                  type="text" 
                  value={e.row.name}
                  onChange={ev => updateRow(e.row.id, 'name', ev.target.value)}
                  className="bg-transparent font-bold text-white text-sm border-none focus:ring-0 focus:outline-none w-1/2"
                />
                <button onClick={() => removeRow(e.row.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">ASHRAE Qty</label>
                  <input type="number" value={e.row.ashraeQuantity} onChange={ev => updateRow(e.row.id, 'ashraeQuantity', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">ASHRAE Rate</label>
                  <input type="number" value={e.row.ashraeRate} onChange={ev => updateRow(e.row.id, 'ashraeRate', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">IMC Total</label>
                  <input type="number" value={e.row.imcRate} onChange={ev => updateRow(e.row.id, 'imcRate', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Project Total</label>
                  <input type="number" value={e.row.projectRate} onChange={ev => updateRow(e.row.id, 'projectRate', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" />
                </div>
                <div className="md:col-span-1 bg-slate-800/50 p-2 rounded flex flex-col justify-center items-end border border-slate-700/50">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{e.result.governingSource} GOVERNS</span>
                  <span className="text-xl font-mono font-black text-white">{e.result.governingRequired} {flowUnit}</span>
                  <span className="text-[9px] text-slate-400 uppercase mt-1">Class: {e.result.classification}</span>
                </div>
              </div>
            </div>
          ))}
          
          <button onClick={addRow} className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-all flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" /> Add Exhaust Space
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
           <span className="text-sm font-bold text-slate-400 uppercase">Total Governing Exhaust</span>
           <span className="text-2xl font-black text-sky-400 font-mono">{totalGoverning} {flowUnit}</span>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', content);
