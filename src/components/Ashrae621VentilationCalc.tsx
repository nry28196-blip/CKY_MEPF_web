import React, { useState, useEffect, useMemo } from 'react';
import { Wind, Users, Activity, Settings, Info, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';
import ValidatedInput from './ValidatedInput';
import TooltipLabel from './TooltipLabel';
import EngineeringWarning from './EngineeringWarning';
import EngineeringAuditTrail from './common/EngineeringAuditTrail';
import EngineeringStatusHeader from './common/EngineeringStatusHeader';

import { VentilationEngine, MultiZoneInput, SingleZoneInput } from '../lib/VentilationEngine';
import { UnitConversionService } from '../lib/UnitConversionService';
import { StandardDataProvider, AshraeEdition } from '../data/ventilation/StandardDataProvider';



interface ZoneState {
  id: string;
  name: string;
  spaceTypeId: string;
  area: number;
  occupants: number | '';
  useDefaultOccupancy: boolean;
  ezId: string;
  primaryAirflow: number | '';
  vpzMin: number | '';
  ep?: number | '';
  er?: number | '';
}

export default function Ashrae621VentilationCalc({ onVentilationChange, edition = '2025' }: { onVentilationChange?: (flow: number, details?: any) => void, edition?: '2019' | '2022' | '2025' }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [systemType, setSystemType] = useState<'single' | 'multi_simplified' | 'multi_alternative'>('single');
  const [isVAV, setIsVAV] = useState<boolean>(true);
  const [alternativeConfig, setAlternativeConfig] = useState<'single-supply' | 'secondary-recirculation'>('single-supply');
  const [systemPopulation, setSystemPopulation] = useState<number | ''>('');
  
  const spaceTypes = StandardDataProvider.get621SpaceTypes(edition);
  const ezValues = StandardDataProvider.get621EzValues(edition);

  const [altitude, setAltitude] = useState<number>(0);
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 68);

  const [zones, setZones] = useState<ZoneState[]>([
    {
      id: '1',
      name: 'Zone 1',
      spaceTypeId: 'office',
      area: isMetric ? 100 : 1000,
      occupants: 5,
      useDefaultOccupancy: true,
      ezId: 'ez_cooling_ceiling',
      primaryAirflow: isMetric ? 400 : 800,
      vpzMin: '',
      ep: 1.0,
      er: 0.0
    }
  ]);

  const addZone = () => {
    setZones([
      ...zones,
      {
        id: Math.random().toString(),
        name: `Zone ${zones.length + 1}`,
        spaceTypeId: 'office',
        area: isMetric ? 100 : 1000,
        occupants: 5,
        useDefaultOccupancy: true,
        ezId: 'ez_cooling_ceiling',
        primaryAirflow: isMetric ? 400 : 800,
        vpzMin: '',
        ep: 1.0,
        er: 0.0
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

  const engineResult = useMemo(() => {
    // 1. Density conversion
    const elevationM = isMetric ? altitude : UnitConversionService.ftToM(altitude);
    const tempC = isMetric ? airTemp : UnitConversionService.fToC(airTemp);
    
    const densityInput = { elevation: elevationM, temperature: tempC };

    if (systemType === 'single') {
      const z = zones[0];
      const spaceType = spaceTypes.find(s => s.id === z.spaceTypeId) || null;
      const ezConfig = ezValues.find(e => e.id === z.ezId) || null;
      
      const areaM2 = isMetric ? z.area : UnitConversionService.ft2ToM2(z.area);
      
      const input: SingleZoneInput = {
        zone: {
          spaceType,
          area: areaM2,
          designOccupancy: z.occupants === '' ? null : z.occupants,
          useDefaultOccupancy: z.useDefaultOccupancy,
          ezConfig
        },
        density: densityInput
      };
      
      return VentilationEngine.runSingleZone(input);
    } else {
      const mzInput: MultiZoneInput = {
        zones: zones.map(z => {
          const spaceType = spaceTypes.find(s => s.id === z.spaceTypeId) || null;
          const ezConfig = ezValues.find(e => e.id === z.ezId) || null;
          const areaM2 = isMetric ? z.area : UnitConversionService.ft2ToM2(z.area);
          
          let vpz = z.primaryAirflow === '' ? null : z.primaryAirflow;
          if (vpz !== null && !isMetric) vpz = UnitConversionService.cfmToLs(vpz);
          
          let vpzMin = z.vpzMin === '' ? null : z.vpzMin;
          if (vpzMin !== null && !isMetric) vpzMin = UnitConversionService.cfmToLs(vpzMin);

          return {
            id: z.id,
            spaceType,
            area: areaM2,
            designOccupancy: z.occupants === '' ? null : z.occupants,
            useDefaultOccupancy: z.useDefaultOccupancy,
            ezConfig,
            dMode: isVAV ? 'VAV' : 'CV',
            vpz,
            vpzMinDesign: vpzMin,
            ep: typeof z.ep === 'number' ? z.ep : null,
            er: typeof z.er === 'number' ? z.er : null
          };
        }),
        density: densityInput,
        method: systemType === 'multi_simplified' ? 'Simplified' : 'Alternative',
        systemPopulation: systemPopulation === '' ? null : systemPopulation,
        systemType: alternativeConfig
      };
      return VentilationEngine.runMultiZone(mzInput);
    }
  }, [zones, systemType, isVAV, alternativeConfig, systemPopulation, altitude, airTemp, isMetric, spaceTypes, ezValues]);

  useEffect(() => {
    if (onVentilationChange) {
      let finalAirflow = engineResult.finalDesignOutdoorAir;
      if (!isMetric && finalAirflow > 0) {
        finalAirflow = UnitConversionService.lsToCfm(finalAirflow);
      }
      onVentilationChange(finalAirflow, engineResult);
    }
  }, [engineResult, isMetric, onVentilationChange]);

  const finalAirflowDisplay = engineResult.finalDesignOutdoorAir === null ? null : (isMetric ? engineResult.finalDesignOutdoorAir : UnitConversionService.lsToCfm(engineResult.finalDesignOutdoorAir));

  // Extract all audit trails for report
  const allAuditTrails = [];
  if (systemType === 'single') {
    const sr = engineResult as any;
    allAuditTrails.push(...sr.zone.auditTrail, ...sr.density.auditTrail, ...(sr.auditTrail || []));
  } else {
    const mr = engineResult as any;
    mr.zones.forEach((z: any) => allAuditTrails.push(...z.auditTrail));
    if (mr.simplifiedSystem) allAuditTrails.push(...mr.simplifiedSystem.auditTrail);
    if (mr.alternativeSystem) allAuditTrails.push(...mr.alternativeSystem.auditTrail);
    allAuditTrails.push(...mr.density.auditTrail, ...(mr.auditTrail || []));
  }

  return (
    <div className="space-y-6">
      <EngineeringStatusHeader 
        status={engineResult.status} 
        message={`ASHRAE 62.1-${edition} Ventilation - ${engineResult.status === 'PASS' ? 'Calculation validated' : 'Check required inputs'}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-cyan-400">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold text-white">System Architecture</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <TooltipLabel label="Configuration Method" tooltip="Select calculation methodology" />
              <select 
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                value={systemType}
                onChange={(e) => setSystemType(e.target.value as any)}
              >
                <option value="single">Single-Zone System</option>
                <option value="multi_simplified">Multi-Zone (Simplified Procedure)</option>
                <option value="multi_alternative">Multi-Zone (Alternative Procedure)</option>
              </select>
            </div>

            {systemType !== 'single' && (
              <div>
                <TooltipLabel label="Air Volume Control" tooltip="Constant Volume or Variable Air Volume" />
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${!isVAV ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setIsVAV(false)}
                  >
                    Constant Volume (CV)
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${isVAV ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setIsVAV(true)}
                  >
                    Variable Air Volume (VAV)
                  </button>
                </div>
              </div>
            )}
            
            {systemType === 'multi_alternative' && (
              <div>
                <TooltipLabel label="Alternative Topology" tooltip="Appendix A configuration" />
                <select 
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                  value={alternativeConfig}
                  onChange={(e) => setAlternativeConfig(e.target.value as any)}
                >
                  <option value="single-supply">Single-Supply (100% Return)</option>
                  <option value="secondary-recirculation">Secondary Recirculation (e.g. Fan-Powered Boxes)</option>
                </select>
              </div>
            )}
            
            {systemType === 'multi_simplified' && (
              <div>
                <TooltipLabel label="System Population (Ps)" tooltip="Total concurrent population" />
                <input 
                  type="number" min="0"
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                  value={systemPopulation}
                  onChange={(e) => setSystemPopulation(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Wind className="w-5 h-5" />
            <h3 className="font-semibold text-white">Air Density Correction (Eρ)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TooltipLabel label={`Site Elevation (${isMetric ? 'm' : 'ft'})`} tooltip="Affects barometric pressure" />
              <input 
                type="number"
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
              />
            </div>
            <div>
              <TooltipLabel label={`Design Temp (${isMetric ? '°C' : '°F'})`} tooltip="Summer/Winter design temperature" />
              <input 
                type="number"
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                value={airTemp}
                onChange={(e) => setAirTemp(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Zone Design Configuration
          </h3>
          {systemType !== 'single' && (
            <button 
              onClick={addZone}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Zone
            </button>
          )}
        </div>

        {zones.map((z, index) => (
          <div key={z.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 relative">
            {systemType !== 'single' && zones.length > 1 && (
              <button 
                onClick={() => removeZone(z.id)}
                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemType !== 'single' && (
                <div>
                  <TooltipLabel label="Zone Name" tooltip="Identifier" />
                  <input 
                    type="text"
                    className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                    value={z.name}
                    onChange={(e) => updateZone(z.id, 'name', e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <TooltipLabel label="Space Category" tooltip="ASHRAE 62.1 Classification" />
                <select 
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                  value={z.spaceTypeId}
                  onChange={(e) => updateZone(z.id, 'spaceTypeId', e.target.value)}
                >
                  {spaceTypes.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <TooltipLabel label={`Floor Area (${isMetric ? 'm²' : 'ft²'})`} tooltip="Zone floor area" />
                <input 
                  type="number" min="0"
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                  value={z.area}
                  onChange={(e) => updateZone(z.id, 'area', e.target.value ? Number(e.target.value) : 0)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">Occupants</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 w-3 h-3"
                      checked={z.useDefaultOccupancy}
                      onChange={(e) => updateZone(z.id, 'useDefaultOccupancy', e.target.checked)}
                    />
                    <span className="text-[9px] text-slate-500 uppercase">Default</span>
                  </label>
                </div>
                <input 
                  type="number" min="0"
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 disabled:opacity-50"
                  value={z.occupants}
                  disabled={z.useDefaultOccupancy}
                  onChange={(e) => updateZone(z.id, 'occupants', e.target.value ? Number(e.target.value) : '')}
                />
              </div>

              <div>
                <TooltipLabel label="Distribution (Ez)" tooltip="Zone Air Distribution Effectiveness" />
                <select 
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                  value={z.ezId}
                  onChange={(e) => updateZone(z.id, 'ezId', e.target.value)}
                >
                  {ezValues.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.ez})</option>
                  ))}
                </select>
              </div>

              {systemType !== 'single' && (
                <div>
                  <TooltipLabel label={`Primary Airflow (${isMetric ? 'L/s' : 'cfm'})`} tooltip="Vpz design airflow" />
                  <input 
                    type="number" min="0"
                    className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                    value={z.primaryAirflow}
                    onChange={(e) => updateZone(z.id, 'primaryAirflow', e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              )}
              
              {systemType !== 'single' && isVAV && (
                <div>
                  <TooltipLabel label={`Vpz-min (${isMetric ? 'L/s' : 'cfm'})`} tooltip="VAV minimum primary airflow" />
                  <input 
                    type="number" min="0"
                    className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                    value={z.vpzMin}
                    onChange={(e) => updateZone(z.id, 'vpzMin', e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              )}
              
              {systemType === 'multi_alternative' && alternativeConfig === 'secondary-recirculation' && (
                <>
                  <div>
                    <TooltipLabel label="Ep" tooltip="Primary Air Fraction" />
                    <input 
                      type="number" step="0.1"
                      className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                      value={z.ep}
                      onChange={(e) => updateZone(z.id, 'ep', e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                  <div>
                    <TooltipLabel label="Er" tooltip="Secondary Recirculation Fraction" />
                    <input 
                      type="number" step="0.1"
                      className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800"
                      value={z.er}
                      onChange={(e) => updateZone(z.id, 'er', e.target.value ? Number(e.target.value) : '')}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col items-center text-center">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Final Design Outdoor Air</h2>
        <div className="text-5xl font-black text-cyan-400 font-mono tracking-tight flex items-baseline gap-3">
          {finalAirflowDisplay === null || isNaN(finalAirflowDisplay) ? '--' : finalAirflowDisplay.toFixed(1)}
          <span className="text-xl text-slate-500">{isMetric ? 'L/s' : 'cfm'}</span>
        </div>
        <p className="text-slate-500 text-sm mt-3 max-w-lg">
          Final Vot corrected for air density. Preliminary compliance subject to adopted AHJ engineering review.
        </p>
      </div>

      <EngineeringAuditTrail title="ASHRAE 62.1 Engine Audit Log" trail={allAuditTrails} />
    </div>
  );
}
