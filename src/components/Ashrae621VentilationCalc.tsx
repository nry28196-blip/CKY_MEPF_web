import { AirDensityService } from '../calculations/services/AirDensityService';
import React, { useState, useEffect, useMemo } from 'react';
import { Wind, Users, Activity, Settings, Info, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useUnit } from '../lib/UnitContext';


import { Ashrae621Service, ZoneVentilationInput, ZoneVentilationResult } from '../calculations/ventilation/Ashrae621Service';
import ValidatedInput from './ValidatedInput';
import EngineeringWarning from './EngineeringWarning';
import EngineeringAuditTrail from './common/EngineeringAuditTrail';
import { ValidationService, ValidationRule, ValidationIssue } from '../calculations/services/ValidationService';
import { MultiZoneVentilationService, MultiZoneInput, MultiZoneSystemResult } from '../calculations/ventilation/MultiZoneVentilationService';

export default function Ashrae621VentilationCalc({ onVentilationChange, edition = '2025' }: { onVentilationChange?: (flow: number, details?: any) => void, edition?: '2019' | '2022' | '2025' }) {
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [systemType, setSystemType] = useState<'single' | 'multi'>('single');
  const [systemPopulation, setSystemPopulation] = useState<number | ''>('');
  const [systemPrimaryAirflow, setSystemPrimaryAirflow] = useState<number | ''>('');
      const [altitude, setAltitude] = useState<number>(0);
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);
  const [validations, setValidations] = useState<ValidationIssue[]>([]);
    
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
  const altMeters = isMetric ? altitude : altitude * 0.3048;
  const tempC = isMetric ? airTemp : (airTemp - 32) * 5/9;
  const densityRatio = AirDensityService.getAirProperties(altMeters, tempC, 50).densityRatio;

  // Calculate results for each zone
  const zoneResults = useMemo(() => {
    return zones.map(z => {
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
  }, [zones, edition, isMetric, densityRatio]);

  // Calculate system result
  const systemResult = useMemo(() => {
    if (systemType !== 'multi') return null;
    
    const multiInputs: MultiZoneInput[] = zoneResults.map(zr => ({
      zoneId: zr.input.id,
      name: zr.input.name,
      zoneResult: zr.result,
      primaryAirflow: zr.input.primaryAirflow,
      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
    }));
    
    return MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio
    );
  }, [systemType, zoneResults, systemPopulation, systemPrimaryAirflow, densityRatio]);



  useEffect(() => {
    const rules: ValidationRule<any>[] = [
      {
        id: 'missing-ps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.systemPopulation === ''),
        message: (s) => `Peak System Population (Ps) was not provided. Assumed equal to sum of peak zone populations (ΣPz = ${Math.ceil(s.sumPz)}). Diversity Ratio (D) = 1.00.`,
        reference: `ASHRAE 62.1-${edition}`
      },
      {
        id: 'missing-vps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.systemPrimaryAirflow === ''),
        message: (s) => `System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = ${Math.ceil(s.sumVpzMin)}).`,
        reference: `ASHRAE 62.1-${edition}`
      },
      {
        id: 'missing-vpzmin',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.zones.some((z: any) => z.vpzMin === '')),
        message: 'Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the max(30% of Vpz, Voz).',
        reference: `ASHRAE 62.1-${edition}`
      },
      {
        id: 'critical-zpz',
        severity: 'error',
        title: 'Critical System Failure: Zpz > 1.0',
        validate: (s) => !(s.systemType === 'multi' && s.systemResult && s.systemResult.zdMax > 1.0),
        message: 'One or more zones have a Maximum Zone Fraction (Zpz) greater than 1.0. This means the Minimum Primary Airflow (Vpz-min) is less than the Required Outdoor Air (Voz) for that zone. To resolve this, increase the Design Vpz or Vpz-min for the critical zone(s).',
        reference: 'ASHRAE 62.1 § 6.2.5.3.3'
      }
    ];

    const state = {
      systemType,
      systemPopulation,
      systemPrimaryAirflow,
      zones,
      edition,
      sumPz: zoneResults.reduce((sum, z) => sum + z.result.pz, 0),
      sumVpzMin: systemResult?.sumVpzMin || 0,
      systemResult
    };

    setValidations(ValidationService.validate(state, rules));
  }, [systemType, systemPopulation, systemPrimaryAirflow, zones, edition, zoneResults, systemResult]);

  useEffect(() => {
    if (onVentilationChange) {
      if (systemType === 'single') {
        // Just sum the zones
        const total = zoneResults.reduce((sum, z) => sum + (z.result.vozActual || z.result.voz), 0);
        onVentilationChange(total, { systemType: 'single', zoneResults });
      } else if (systemResult) {
        onVentilationChange(systemResult.votActual || systemResult.vot, { systemType: 'multi', systemResult });
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <ValidatedInput 
                type="number" min={0} placeholder="Defaults to ΣPz"
                max={Math.ceil(zoneResults.reduce((sum, z) => sum + z.result.pz, 0))}
                errorMsg="System Population (Ps) cannot exceed the sum of peak zone populations per 62.1-2025 (D ≤ 1.0)"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates Occupant Diversity Ratio (D = Ps / ΣPz)</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Min System Primary Airflow Vps (Optional)</label>
              <ValidatedInput 
                type="number" min={systemResult ? Math.ceil(systemResult.sumVpzMin) : 0} placeholder="Defaults to ΣVpz-min"
                errorMsg="System Primary Airflow (Vps) must be ≥ sum of zone minimum primary airflows (ΣVpz-min)"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates System Primary Fraction (Xs = Vou / Vps)</p>
            </div>
          </div>
        )}

        {systemType === 'multi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-800/60">
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Peak System Population Ps (Optional)</label>
              <ValidatedInput 
                type="number" min={0} placeholder="Defaults to ΣPz"
                max={Math.ceil(zoneResults.reduce((sum, z) => sum + z.result.pz, 0))}
                errorMsg="System Population (Ps) cannot exceed the sum of peak zone populations per 62.1-2025 (D ≤ 1.0)"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />
              <p className="text-[9px] text-slate-500 mt-1">Evaluates Occupant Diversity Ratio (D = Ps / ΣPz)</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-sky-400 mb-1.5 uppercase">Min System Primary Airflow Vps (Optional)</label>
              <ValidatedInput 
                type="number" min={systemResult ? Math.ceil(systemResult.sumVpzMin) : 0} placeholder="Defaults to ΣVpz-min"
                errorMsg="System Primary Airflow (Vps) must be ≥ sum of zone minimum primary airflows (ΣVpz-min)"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
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
                <ValidatedInput 
                  type="number" min={0.1}
                  errorMsg="Zone Area must be > 0"
                  value={zr.input.area}
                  onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500"
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
                    <ValidatedInput 
                      type="number" min={0}
                      errorMsg="Occupants cannot be negative"
                      value={zr.input.occupants}
                      onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))}
                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <ValidatedInput 
                      type="number" min={Math.ceil(zr.result.voz)}
                      errorMsg="Design primary airflow (Vpz) must be ≥ required zone outdoor air (Voz) to maintain Zpz ≤ 1.0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-amber-500 mb-1.5 uppercase">Min Vpz-min</label>
                    <ValidatedInput 
                      type="number" min={Math.ceil(zr.result.voz)} max={zr.input.primaryAirflow > 0 ? zr.input.primaryAirflow : undefined}
                      placeholder="Auto (VAV)"
                      errorMsg="Vpz-min must be ≥ Voz to satisfy ventilation at turndown, and ≤ Design Vpz"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500"
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
            
            {/* Audit Trail */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <div className="bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/50 flex items-center">
                  <Activity className="w-3.5 h-3.5 text-sky-400 mr-2" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Audit Trail</span>
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Governing Code</span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">ASHRAE 62.1-{edition}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Methodology</span>
                    <span className="text-[10px] font-mono text-slate-300">{systemType === 'single' ? 'Single Zone System (VRP)' : 'Multi-Zone System (VRP)'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Vbz Formula (ASHRAE 62.1 Eq. 6.2.2.1)</span>
                    <span className="text-[10px] font-mono text-slate-400">Rp×Pz + Ra×Az = {Math.round(zr.result.vbz)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Voz Formula (ASHRAE 62.1 Eq. 6.2.2.3)</span>
                    <span className="text-[10px] font-mono text-slate-400">Vbz / Ez = {Math.round(zr.result.voz)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Rp (People Rate)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.rp} {isMetric ? 'L/s·person' : 'cfm/person'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Ra (Area Rate)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.ra} {isMetric ? 'L/s·m²' : 'cfm/ft²'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Pz (Zone Population)</span>
                    <span className="text-[10px] font-mono text-slate-400">{Math.round(zr.result.pz)} <span className="text-slate-600">({zr.result.occupancySource === 'default' ? 'Code Default' : 'User Design'})</span></span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Az (Zone Area)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.az} {isMetric ? 'm²' : 'ft²'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Ez (Distribution Eff.)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.ez}</span>
                  </div>
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

      {/* Automated Engineering Validation Panel */}
      {validations.length > 0 && (
        <EngineeringWarning validations={validations} />
      )}

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
          
          
          
          {/* System Audit Trail */}
          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <EngineeringAuditTrail
              codeReference={`ASHRAE 62.1-${edition}`}
              trail={[
                { symbol: 'ΣPz', name: 'Sum of Zone Populations', value: Math.ceil(systemResult.sumPz), unit: 'people' },
                { symbol: 'Ps', name: 'Peak System Population', value: Math.ceil(systemResult.ps), unit: 'people' },
                { symbol: 'D', name: 'Diversity Ratio', formula: 'Ps / ΣPz', value: systemResult.d.toFixed(3), reference: 'Eq. 6.2.5.3.1' },
                { symbol: 'Vou', name: 'Uncorrected Outdoor Air', formula: 'D×Σ(Rp×Pz) + Σ(Ra×Az)', value: Math.round(systemResult.vou), unit: flowUnit, reference: 'Eq. 6.2.5.3' },
                { symbol: 'Vps', name: 'System Primary Airflow', value: Math.round(systemResult.vps), unit: flowUnit },
                { symbol: 'Xs', name: 'System Primary Fraction', formula: 'Vou / Vps', value: systemResult.xs.toFixed(3) },
                { symbol: 'Zd', name: 'Max Zone Fraction', formula: 'Max(Zpz)', value: systemResult.zdMax.toFixed(3) },
                { symbol: 'Ev', name: 'System Ventilation Efficiency', formula: 'Min(Evz)', value: systemResult.ev.toFixed(3), reference: 'Eq. 6.2.5.4.1 / App. A' },
                { symbol: 'Vot', name: 'Standard Required System Outdoor Air', formula: 'Vou / Ev', value: Math.round(systemResult.vot), unit: flowUnit, reference: 'Eq. 6.2.5.1' },
                { symbol: 'Eρ', name: 'Density Ratio', formula: 'ρ_actual / ρ_standard', value: densityRatio.toFixed(3) },
                { symbol: 'Vot_actual', name: 'Density Corrected Required Outdoor Air', formula: 'Vot / Eρ', value: Math.ceil(systemResult.votActual || systemResult.vot), unit: flowUnit },
              ]}
            />
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
