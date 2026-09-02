import React, { useState, useEffect } from 'react';
import { Wind, Users, Activity, Settings, Info, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';


import { Ashrae621Service, ZoneVentilationInput, ZoneVentilationResult } from '../calculations/ventilation/Ashrae621Service';
import ValidatedInput from './ValidatedInput';
import { MultiZoneVentilationService, MultiZoneInput, MultiZoneSystemResult } from '../calculations/ventilation/MultiZoneVentilationService';

export default function Ashrae621VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [systemType, setSystemType] = useState<'single' | 'multi'>('single');
  const [systemPopulation, setSystemPopulation] = useState<number | ''>('');
  const [systemPrimaryAirflow, setSystemPrimaryAirflow] = useState<number | ''>('');
      const [altitude, setAltitude] = useState<number>(0);
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);
  const [edition, setEdition] = useState<'2019' | '2022' | '2025'>('2022');
  
  interface ZoneState {
    id: string;
    name: string;
    spaceTypeId: string;
    area: number;
    occupants: number;
    useDefaultOccupancy: boolean;
    ezId: string;
    primaryAirflow: number; // For multi-zone Vpz
    vpzMin: number | ''; // Minimum primary airflow (Vpz-min) for VAV
  }

  const [zones, setZones] = useState<ZoneState[]>([
    {
      id: '1',
      name: 'Zone 1',
      spaceTypeId: 'office',
      area: 1000,
      occupants: 5,
      useDefaultOccupancy: true,
      ezId: 'ceiling_cool',
      primaryAirflow: 800,
      vpzMin: ''
    }
  ]);

  const addZone = () => {
    setZones([
      ...zones,
      {
        id: Math.random().toString(),
        name: `Zone ${zones.length + 1}`,
        spaceTypeId: 'office',
        area: 1000,
        occupants: 5,
        useDefaultOccupancy: true,
        ezId: 'ceiling_cool',
        primaryAirflow: 800,
      vpzMin: ''
    }
    ]);
  };

  const removeZone = (id: string) => {
    if (zones.length > 1) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  const updateZone = (id: string, field: keyof ZoneState, value: any) => {
    setZones(zones.map(z => z.id === id ? { ...z, [field]: value } : z));
  };


  const areaUnit = isMetric ? 'm²' : 'ft²';
  const flowUnit = isMetric ? 'L/s' : 'CFM';

  // Density logic
  const densityRatio = Ashrae621Service.getDensityRatio(altitude, airTemp, isMetric);

  // Calculate results for each zone
  const zoneResults: { input: ZoneState; result: ZoneVentilationResult }[] = zones.map(z => {
    const spaces = Ashrae621Service.getSpacesByEdition(edition);
    const spaceType = spaces.find(s => s.id === z.spaceTypeId) || spaces[0];
    const ezList = Ashrae621Service.getEzByEdition(edition);
    const ezConfig = ezList.find(e => e.id === z.ezId) || ezList[0];
    
    const input: ZoneVentilationInput = {
      spaceType,
      area: z.area,
      designOccupancy: z.occupants,
      useDefaultOccupancy: z.useDefaultOccupancy,
      ezConfig,
      isMetric,
      densityRatio
    };
    
    return {
      input: z,
      result: Ashrae621Service.calculateZoneVentilation(input)
    };
  });

  // Calculate system result
  let systemResult: MultiZoneSystemResult | null = null;
  
  if (systemType === 'multi') {
    const multiInputs: MultiZoneInput[] = zoneResults.map(zr => ({
      zoneId: zr.input.id,
      name: zr.input.name,
      zoneResult: zr.result,
      primaryAirflow: zr.input.primaryAirflow,
      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
    }));
    
    systemResult = MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio
    );
  }


  useEffect(() => {
    if (onVentilationChange) {
      if (systemType === 'single') {
        // Just sum the zones
        const total = zoneResults.reduce((sum, z) => sum + (z.result.vozActual || z.result.voz), 0);
        onVentilationChange(total);
      } else if (systemResult) {
        onVentilationChange(systemResult.votActual || systemResult.vot);
      }
    }
  }, [systemType, zoneResults, systemResult, onVentilationChange]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Context Summary Card */}
      <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="bg-sky-500/20 p-2 rounded-lg border border-sky-500/30">
            <Info className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold">Calculation Context</h4>
            <p className="text-xs text-slate-400">Active Parameters</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-8">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">ASHRAE Edition</p>
            <p className="text-sm font-mono text-sky-300 font-bold">{edition}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Air Distribution (Ez)</p>
            <p className="text-sm font-mono text-sky-300 font-bold">
              {zones.length === 1 
                ? zoneResults[0].result.ez.toFixed(2) 
                : 'Zone Specific'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Density Factor (Eρ)</p>
            <p className="text-sm font-mono text-sky-300 font-bold">{densityRatio.toFixed(3)}</p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
          <Settings className="w-4 h-4 mr-2 text-sky-400" />
          ASHRAE 62.1 Ventilation Rate Procedure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Edition</label>
            <select
              value={edition}
              onChange={(e) => setEdition(e.target.value as any)}
              className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
            >
              <option value="2019">62.1-2019</option>
              <option value="2022">62.1-2022</option>
              <option value="2025">62.1-2025</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Elevation ({isMetric ? 'm' : 'ft'})</label>
            <ValidatedInput type="number" min={-1000} errorMsg="Altitude must be >= -1000" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Air Temp ({isMetric ? '°C' : '°F'})</label>
            <ValidatedInput type="number" min={-60} max={150} errorMsg="Valid range: -60 to 150" value={airTemp} onChange={(e) => setAirTemp(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">System Type</label>
            <select 
              value={systemType}
              onChange={(e) => setSystemType(e.target.value as 'single' | 'multi')}
              className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
            >
              <option value="single">Single Zone System</option>
              <option value="multi">Multi-Zone System (VAV/CV)</option>
            </select>
          </div>
        </div>

        {systemType === 'multi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-800/60">
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Peak System Population Ps (Optional)</label>
              <input 
                type="number" min="0" placeholder="Defaults to ΣPz"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates Occupant Diversity Ratio (D = Ps / ΣPz)</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Min System Primary Airflow Vps (Optional)</label>
              <input 
                type="number" min="0" placeholder="Defaults to ΣVpz-min"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates System Primary Fraction (Xs = Vou / Vps)</p>
            </div>
          </div>
        )}

        {systemType === 'multi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-800/60">
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Peak System Population Ps (Optional)</label>
              <input 
                type="number" min="0" placeholder="Defaults to ΣPz"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates Occupant Diversity Ratio (D = Ps / ΣPz)</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Min System Primary Airflow Vps (Optional)</label>
              <input 
                type="number" min="0" placeholder="Defaults to ΣVpz-min"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates System Primary Fraction (Xs = Vou / Vps)</p>
            </div>
          </div>
        )}
        <div className="text-[10px] text-slate-500 font-mono">
          Density Ratio: {densityRatio.toFixed(3)} (Volume adjustments applied to final results)
        </div>
      </div>

      {/* Zones Panel */}
      <div className="space-y-4">
        {zoneResults.map((zr, index) => (
          <div key={zr.input.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative">
            {zones.length > 1 && (
              <button 
                onClick={() => removeZone(zr.input.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-400" />
              {systemType === 'multi' ? `Zone ${index + 1}: ` : ''} {zr.input.name}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemType === 'multi' && (
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Zone Name</label>
                  <input 
                    type="text" 
                    value={zr.input.name}
                    onChange={(e) => updateZone(zr.input.id, 'name', e.target.value)}
                    className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-indigo-500"
                  />
                </div>
              )}
              <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Space Type (Table 6.2.2.1)</label>
                <select 
                  value={zr.input.spaceTypeId}
                  onChange={(e) => updateZone(zr.input.id, 'spaceTypeId', e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-indigo-500"
                >
                  {Ashrae621Service.getSpacesByEdition(edition).map(s => (
                    <option key={s.id} value={s.id}>{s.category} - {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Floor Area ({areaUnit})</label>
                <input 
                  type="number" min="0"
                  value={zr.input.area}
                  onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Zone Ez (Table 6.2.2.2)</label>
                <select 
                  value={zr.input.ezId}
                  onChange={(e) => updateZone(zr.input.id, 'ezId', e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-indigo-500"
                >
                  {Ashrae621Service.getEzByEdition(edition).map(ez => (
                    <option key={ez.id} value={ez.id}>{ez.ez.toFixed(1)} - {ez.name}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2 flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Occupancy</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number" min="0"
                      value={zr.input.occupants}
                      onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))}
                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="flex items-center h-full pt-4">
                  <label className="flex items-center text-xs text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={zr.input.useDefaultOccupancy}
                      onChange={(e) => updateZone(zr.input.id, 'useDefaultOccupancy', e.target.checked)}
                      className="mr-2 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-500/20"
                    />
                    Use Default
                  </label>
                </div>
              </div>
              
              {systemType === 'multi' && (
                <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-amber-400 mb-1.5 uppercase">Design Vpz ({flowUnit})</label>
                    <input 
                      type="number" min="0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-500 mb-1.5 uppercase">Min Vpz-min</label>
                    <input 
                      type="number" min="0" placeholder="Auto (VAV)"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/30 focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Zone Calculation Details */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Rp × Pz = Vbp</span>
                  <span className="font-mono text-slate-300">{zr.result.rp} × {Math.round(zr.result.pz)} = {Math.round(zr.result.vbp)}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Ra × Az = Vba</span>
                  <span className="font-mono text-slate-300">{zr.result.ra} × {zr.result.az} = {Math.round(zr.result.vba)}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Vbp + Vba = Vbz</span>
                  <span className="font-mono text-indigo-400 font-bold">{Math.round(zr.result.vbz)} {flowUnit}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Vbz / Ez = Voz (Std)</span>
                  <span className="font-mono text-sky-400 font-bold">{Math.round(zr.result.voz)} {flowUnit}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase">Voz (Actual)</span>
                  <span className="font-mono text-indigo-400 font-bold">{Math.round(zr.result.vozActual || zr.result.voz)} {flowUnit}</span>
                </div>
              </div>
            </div>
            
            {/* Density Adjusted Zone Voz */}
            {systemType === 'single' && (
              <div className="mt-4 bg-sky-950/20 border border-sky-900/30 p-4 rounded-lg flex items-center justify-between">
                 <div>
                   <h5 className="text-[10px] font-bold text-sky-400 uppercase">Required Outdoor Air (Voz)</h5>
                   <p className="text-xs text-slate-400 mt-1">Adjusted for air density (Ratio: {densityRatio.toFixed(3)})</p>
                 </div>
                 <div className="text-right">
                    <span className="text-3xl font-black text-white font-mono">{Math.ceil(zr.result.vozActual || zr.result.voz).toLocaleString()}</span>
                    <span className="text-xs font-bold text-sky-400 ml-2">{flowUnit}</span>
                 </div>
              </div>
            )}
          </div>
        ))}
        
        {systemType === 'multi' && (
          <button 
            onClick={addZone}
            className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </button>
        )}
      </div>

      {/* Multi-Zone System Results */}
      {systemType === 'multi' && systemResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-sky-400" />
            System Level Calculation (ASHRAE 62.1 VRP)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Population (Ps)</span>
                <span className="font-mono text-white">{Math.round(systemResult.ps)} <span className="text-slate-500 text-xs">(D = {systemResult.d.toFixed(2)})</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Min Airflow (Vps)</span>
                <span className="font-mono text-white">{Math.round(systemResult.vps)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Uncorrected Outdoor Air (Vou)</span>
                <span className="font-mono text-white">{Math.round(systemResult.vou)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Primary Fraction (Xs)</span>
                <span className="font-mono text-white">{systemResult.xs.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Max Zone Fraction (Zpz)</span>
                <span className="font-mono text-amber-400 font-bold">{systemResult.zdMax.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400">System Vent Efficiency (Ev)</span>
                <span className="font-mono text-sky-400 font-bold">{systemResult.ev.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-slate-950/50 p-6 rounded-xl border border-sky-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required System Outdoor Air (Vot)</p>
              <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
                {Math.ceil(systemResult.votActual || systemResult.vot).toLocaleString()}
              </p>
              <p className="text-sm font-bold text-sky-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
              <p className="text-[10px] text-slate-500 mt-2 z-10">Density Adjusted. Base: {Math.ceil(systemResult.vot).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/60">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Zone Fractions (Zpz)</h4>
             <div className="flex flex-wrap gap-2">
               {systemResult.zones.map((z, i) => (
                 <div key={z.zoneId} className={`px-3 py-1.5 rounded border text-xs font-mono flex flex-col ${z.isCritical ? 'bg-amber-950/30 border-amber-500/50 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                   <span>Z{i+1}: Zpz={z.zpz === Infinity ? '∞' : z.zpz.toFixed(3)} {z.isCritical && ' (Critical)'}</span>
                   <span className="text-[9px] opacity-70">Vpz-min={Math.round(z.vpzMin)} | Voz={z.voz.toFixed(1)}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
