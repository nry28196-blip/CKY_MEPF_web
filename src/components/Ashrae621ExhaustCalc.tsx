import React, { useState } from 'react';
import { Wind, Copy, Plus, Trash2, Building, Scale, Settings } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import ValidatedInput from './ValidatedInput';

type ExhaustSourceType = 'ashrae621' | 'imc' | 'custom';

interface ExhaustItem {
  id: string;
  name: string;
  sourceType: ExhaustSourceType;
  category?: string;
  quantity: number;
  ratePerUnit: number;
  totalCfm: number;
}

export default function Ashrae621ExhaustCalc() {
  const { unitSystem, getUnitLabel, convert } = useUnit();
  const flowUnit = getUnitLabel('airflow');
  const areaUnit = getUnitLabel('area');
  const isMetric = unitSystem === 'metric';

  const [items, setItems] = useState<ExhaustItem[]>([
    { id: '1', name: 'Public Restroom', sourceType: 'ashrae621', category: 'Bathrooms (public)', quantity: 2, ratePerUnit: isMetric ? 25 : 50, totalCfm: isMetric ? 50 : 100 },
    { id: '2', name: 'Commercial Kitchen', sourceType: 'imc', category: 'Kitchen (commercial)', quantity: isMetric ? 50 : 500, ratePerUnit: isMetric ? 7.5 : 1.5, totalCfm: isMetric ? 375 : 750 }
  ]);

  // ASHRAE 62.1 Table 6.5.1
  const ashraeRates = [
    { name: 'Art classroom', rateImp: 0.7, rateMet: 3.5, unit: 'area' },
    { name: 'Bathrooms (public)', rateImp: 50, rateMet: 25, unit: 'fixture' },
    { name: 'Bathrooms (private)', rateImp: 25, rateMet: 12.5, unit: 'fixture' },
    { name: 'Copy/printing rooms', rateImp: 0.5, rateMet: 2.5, unit: 'area' },
    { name: 'Janitor closets', rateImp: 1.0, rateMet: 5.0, unit: 'area' },
    { name: 'Kitchen (commercial)', rateImp: 0.7, rateMet: 3.5, unit: 'area' },
    { name: 'Locker rooms', rateImp: 0.5, rateMet: 2.5, unit: 'area' },
    { name: 'Parking garages', rateImp: 0.75, rateMet: 3.8, unit: 'area' },
    { name: 'Pet shops', rateImp: 0.9, rateMet: 4.5, unit: 'area' },
    { name: 'Soiled laundry', rateImp: 1.0, rateMet: 5.0, unit: 'area' },
    { name: 'Wood/metal shop', rateImp: 0.5, rateMet: 2.5, unit: 'area' }
  ];

  // International Mechanical Code (IMC) typical values
  const imcRates = [
    { name: 'Toilet rooms (public)', rateImp: 50, rateMet: 25, unit: 'fixture', alt: '75 cfm per wc for heavy' },
    { name: 'Toilet rooms (private)', rateImp: 50, rateMet: 25, unit: 'fixture', alt: 'or 20 cfm continuous' },
    { name: 'Kitchen (commercial)', rateImp: 1.5, rateMet: 7.5, unit: 'area' },
    { name: 'Janitor closets', rateImp: 1.0, rateMet: 5.0, unit: 'area' },
    { name: 'Nail salons', rateImp: 0.6, rateMet: 3.0, unit: 'area', note: '+ source capture' },
    { name: 'Locker rooms', rateImp: 0.5, rateMet: 2.5, unit: 'area' }
  ];

  const addItem = (sourceType: ExhaustSourceType) => {
    const defaultRate = isMetric ? 2.5 : 0.5;
    const newItem: ExhaustItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'New Exhaust Area',
      sourceType,
      category: sourceType === 'custom' ? 'Custom' : '',
      quantity: 100,
      ratePerUnit: defaultRate,
      totalCfm: 100 * defaultRate
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof ExhaustItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      
      if (field === 'category') {
        let found = null;
        if (updated.sourceType === 'ashrae621') {
          found = ashraeRates.find(r => r.name === value);
        } else if (updated.sourceType === 'imc') {
          found = imcRates.find(r => r.name === value);
        }
        
        if (found) {
          updated.ratePerUnit = isMetric ? found.rateMet : found.rateImp;
        }
      }
      
      updated.totalCfm = updated.quantity * updated.ratePerUnit;
      return updated;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const getSourceOptions = (source: ExhaustSourceType) => {
    if (source === 'ashrae621') return ashraeRates.map(r => r.name);
    if (source === 'imc') return imcRates.map(r => r.name);
    return ['Custom Entry'];
  };

  const renderSection = (sourceType: ExhaustSourceType, title: string, description: string, icon: React.ReactNode, colorClass: string) => {
    const sectionItems = items.filter(i => i.sourceType === sourceType);
    const subtotal = sectionItems.reduce((sum, item) => sum + item.totalCfm, 0);

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg mb-6">
        <div className={`bg-slate-950/50 p-4 border-b border-slate-800 flex justify-between items-center`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 mr-3`}>
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Subtotal</span>
            <span className={`text-lg font-mono font-bold ${colorClass.split(' ')[0]}`}>{subtotal.toFixed(1)} <span className="text-xs text-slate-500">{flowUnit}</span></span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {sectionItems.map((item) => (
            <div key={item.id} className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 relative group">
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-6">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Description</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Category</label>
                  <select
                    value={item.category || ''}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500"
                    disabled={sourceType === 'custom'}
                  >
                    <option value="">Select...</option>
                    {getSourceOptions(sourceType).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Qty (Units or {areaUnit})</label>
                  <ValidatedInput
                    type="number" min={0} errorMsg="Quantity >= 0"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Rate ({flowUnit}/unit)</label>
                  <ValidatedInput
                    type="number" min={0} errorMsg="Rate >= 0"
                    value={item.ratePerUnit}
                    onChange={(e) => updateItem(item.id, 'ratePerUnit', Number(e.target.value))}
                    className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/30 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Flow ({flowUnit})</span>
                <span className="text-sm font-mono font-bold text-slate-200">{item.totalCfm.toFixed(1)}</span>
              </div>
            </div>
          ))}

          <button 
            onClick={() => addItem(sourceType)}
            className="w-full py-2.5 border border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-300 transition-all flex items-center justify-center uppercase tracking-wider cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add {title} Item
          </button>
        </div>
      </div>
    );
  };

  const grandTotal = items.reduce((sum, item) => sum + item.totalCfm, 0);

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Wind className="w-5 h-5 mr-2 text-sky-400" />
          Local Exhaust Ventilation
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Calculate and aggregate exhaust rates across different code typologies.
        </p>
      </div>

      {renderSection(
        'ashrae621',
        'ASHRAE 62.1 (Ventilation-Based)',
        'Table 6.5.1 Minimum Exhaust Rates',
        <Building className="w-5 h-5 text-sky-400" />,
        'text-sky-400 border-sky-400'
      )}

      {renderSection(
        'imc',
        'IMC/Code (Minimum Requirements)',
        'Standard mechanical code prescriptive rates',
        <Scale className="w-5 h-5 text-amber-400" />,
        'text-amber-400 border-amber-400'
      )}

      {renderSection(
        'custom',
        'Custom / Engineering Specific',
        'Process loads, hoods, and specified equipment',
        <Settings className="w-5 h-5 text-indigo-400" />,
        'text-indigo-400 border-indigo-400'
      )}

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center mt-8 sticky bottom-4 shadow-2xl shadow-black/50 z-10 ring-1 ring-white/5">
        <div>
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">Grand Total Exhaust</h3>
          <p className="text-slate-400 text-xs mt-1">Aggregated across all typologies</p>
        </div>
        <div className="text-4xl font-mono font-bold text-emerald-400 mt-3 sm:mt-0 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
          {grandTotal.toFixed(1)} <span className="text-lg text-emerald-600">{flowUnit}</span>
        </div>
      </div>
    </div>
  );
}
