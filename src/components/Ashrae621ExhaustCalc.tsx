import React, { useState, useEffect } from 'react';
import { Wind, Plus, Trash2, Database } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import EngineeringStatusHeader from './common/EngineeringStatusHeader';
import { Ashrae621ExhaustService, ExhaustSpaceType, AshraeEdition } from '../calculations/ventilation/Ashrae621ExhaustService';

interface ExhaustRow {
  id: string;
  name: string;
  categoryId: string;
  quantity: number; // Qty of area or fixtures
  projectTotal: number;
  mfgTotal: number;
}

export default function Ashrae621ExhaustCalc({ edition = '2025' }: { edition?: string }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const flowUnit = isMetric ? 'L/s' : 'cfm';
  
  const allSpaces = Ashrae621ExhaustService.getSpaces(edition as AshraeEdition);
  
  const [rows, setRows] = useState<ExhaustRow[]>([
    {
      id: '1',
      name: 'Public Restroom 1',
      categoryId: 'bath_public',
      quantity: 2,
      projectTotal: 0,
      mfgTotal: 0
    }
  ]);

  const addRow = () => {
    setRows([...rows, {
      id: Math.random().toString(),
      name: 'New Exhaust Space',
      categoryId: allSpaces[0].id,
      quantity: 1,
      projectTotal: 0,
      mfgTotal: 0
    }]);
  };

  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
  
  const updateRow = (id: string, field: keyof ExhaustRow, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const evaluateRows = () => {
    return rows.map(r => {
      const space = Ashrae621ExhaustService.getSpaceById(r.categoryId, edition as AshraeEdition) || allSpaces[0];
      
      // The service encapsulates the logic to look up the rates and determine the governing rate
      const result = Ashrae621ExhaustService.calculateSpaceExhaust({
        spaceId: r.categoryId,
        edition: edition as AshraeEdition,
        quantity: r.quantity,
        isMetric,
        projectOverride: r.projectTotal,
        mfgOverride: r.mfgTotal
      });

      return {
        row: r,
        space,
        result
      };
    });
  };

  const evaluated = evaluateRows();
  const totalGoverning = evaluated.reduce((sum, e) => sum + e.result.governingRequired, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <EngineeringStatusHeader 
        status="PASS" 
        message="Local exhaust requirements evaluated against ASHRAE 62.1 and IMC database." 
      />
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
          <Database className="w-4 h-4 mr-2 text-sky-400" />
          Exhaust Evaluation (ASHRAE 62.1 vs IMC vs Project) - {edition}
        </h3>
        
        <div className="space-y-4">
          {evaluated.map((e) => (
            <div key={e.row.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={e.row.name}
                    onChange={ev => updateRow(e.row.id, 'name', ev.target.value)}
                    className="bg-transparent font-bold text-white text-sm border-none focus:ring-0 focus:outline-none w-full"
                    placeholder="Space Name"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <select 
                    value={e.row.categoryId}
                    onChange={ev => updateRow(e.row.id, 'categoryId', ev.target.value)}
                    className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800 focus:border-sky-500"
                  >
                    {allSpaces.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button onClick={() => removeRow(e.row.id)} className="text-slate-500 hover:text-red-400 flex-shrink-0 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-800/50">
                <div className="md:col-span-1">
                  <TooltipLabel className="block text-[10px] font-bold text-slate-500 uppercase" label={`Qty (${e.space.ashraeUnit === 'area' ? (isMetric ? 'm²' : 'ft²') : 'units'})`} tooltip="The base physical quantity (e.g., floor area, number of fixtures, or number of appliances) used to calculate the mandatory exhaust flow rate." />
                  <input type="number" min="0" step="any" value={e.row.quantity} onChange={ev => updateRow(e.row.id, 'quantity', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">ASHRAE 62.1 Total</label>
                  <div className="w-full bg-slate-900/50 text-xs rounded p-2 text-slate-400 border border-slate-800/50 font-mono">
                    {(e.result.ashraeRequired || 0).toFixed(1)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">IMC Total</label>
                  <div className="w-full bg-slate-900/50 text-xs rounded p-2 text-slate-400 border border-slate-800/50 font-mono">
                    {(e.result.imcRequired || 0).toFixed(1)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <TooltipLabel className="block text-[10px] font-bold text-slate-500 uppercase" label="Project Override" tooltip="Allows a custom, project-specific required exhaust flow rate that supersedes ASHRAE/IMC minimums if higher." />
                  <input type="number" min="0" step="any" value={e.row.projectTotal} onChange={ev => updateRow(e.row.id, 'projectTotal', Number(ev.target.value))} className="w-full bg-slate-900 text-xs rounded p-2 text-slate-300 border border-slate-800" placeholder="Optional" />
                </div>
                <div className="md:col-span-1 bg-slate-800/50 p-2 rounded flex flex-col justify-center items-end border border-slate-700/50">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{e.result.governingSource}</span>
                  <span className="text-lg font-mono font-black text-white">{(e.result.governingRequired || 0).toFixed(1)} <span className="text-xs text-sky-400">{flowUnit}</span></span>
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
           <span className="text-2xl font-black text-sky-400 font-mono">{Math.ceil(totalGoverning)} <span className="text-sm">{flowUnit}</span></span>
        </div>
      </div>
    </div>
  );
}
