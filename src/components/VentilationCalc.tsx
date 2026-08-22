import React, { useState, useEffect } from 'react';
import { Wind, Users, Square, Info, FileSpreadsheet, CheckCircle2, ChevronRight, Activity, AlertTriangle, ArrowDown, Thermometer } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import TooltipLabel from './TooltipLabel';

interface SpaceType {
  id: string;
  name: string;
  rpImp: number; // CFM/person
  raImp: number; // CFM/ft2
  rpMet: number; // L/s/person
  raMet: number; // L/s/m2
  defaultDensityImp: number; // people/1000 ft2
  defaultDensityMet: number; // people/100 m2
}

const SPACE_TYPES: SpaceType[] = [
  { id: 'office', name: 'Office Space', rpImp: 5, raImp: 0.06, rpMet: 2.5, raMet: 0.3, defaultDensityImp: 5, defaultDensityMet: 5.4 },
  { id: 'classroom', name: 'Classroom', rpImp: 10, raImp: 0.12, rpMet: 5, raMet: 0.6, defaultDensityImp: 35, defaultDensityMet: 38 },
  { id: 'conference', name: 'Conference Room', rpImp: 5, raImp: 0.06, rpMet: 2.5, raMet: 0.3, defaultDensityImp: 50, defaultDensityMet: 54 },
  { id: 'retail', name: 'Retail Sales', rpImp: 7.5, raImp: 0.12, rpMet: 3.8, raMet: 0.6, defaultDensityImp: 15, defaultDensityMet: 16 },
  { id: 'corridor', name: 'Corridor', rpImp: 0, raImp: 0.06, rpMet: 0, raMet: 0.3, defaultDensityImp: 0, defaultDensityMet: 0 },
  { id: 'restaurant', name: 'Restaurant Dining', rpImp: 7.5, raImp: 0.18, rpMet: 3.8, raMet: 0.9, defaultDensityImp: 70, defaultDensityMet: 75 },
  { id: 'gym', name: 'Gymnasium', rpImp: 20, raImp: 0.3, rpMet: 10, raMet: 1.5, defaultDensityImp: 30, defaultDensityMet: 32 },
];

export default function VentilationCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('office');
  const [area, setArea] = useState<number>(1000); // ft2 or m2
  const [useDefaultDensity, setUseDefaultDensity] = useState<boolean>(true);
  const [customOccupants, setCustomOccupants] = useState<number>(5);
  const [zoneEzId, setZoneEzId] = useState<string>('cooling_ceiling'); // Zone air distribution effectiveness ID
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);
  const [useTempAdj, setUseTempAdj] = useState<boolean>(false);
  
  useEffect(() => {
    setAirTemp(isMetric ? 20 : 70);
  }, [isMetric]);
  
  // ASHRAE 62.1-2019 Table 6.2.2.2
  const EZ_OPTIONS = [
    { id: 'cooling_ceiling', label: '1.0 - Ceiling supply of cool air', value: 1.0 },
    { id: 'heating_ceiling_floor', label: '1.0 - Ceiling supply of warm air & floor return', value: 1.0 },
    { id: 'heating_ceiling_15f', label: '0.8 - Ceiling supply of warm air (≥15°F/8°C above space temp)', value: 0.8 },
    { id: 'heating_ceiling_less_15f', label: '1.0 - Ceiling supply of warm air (<15°F/8°C above space temp)', value: 1.0 },
    { id: 'cooling_floor_disp', label: '1.2 - Floor supply of cool air (displacement)', value: 1.2 },
    { id: 'cooling_floor_dir', label: '1.0 - Floor supply of cool air (directed)', value: 1.0 },
    { id: 'heating_floor_floor', label: '1.0 - Floor supply of warm air & floor return', value: 1.0 },
    { id: 'heating_floor_ceiling', label: '0.7 - Floor supply of warm air & ceiling return', value: 0.7 },
    { id: 'makeup_opp', label: '0.8 - Makeup air drawn on opposite side of room from exhaust', value: 0.8 },
    { id: 'makeup_near', label: '0.5 - Makeup air drawn near to exhaust/return', value: 0.5 }
  ];

  const zoneEz = EZ_OPTIONS.find(o => o.id === zoneEzId)?.value || 1.0;

  // Units display
  const areaUnit = isMetric ? 'm²' : 'ft²';
  const flowUnit = isMetric ? 'L/s' : 'CFM';

  // Selected space type
  const spaceType = SPACE_TYPES.find((s) => s.id === selectedSpaceId) || SPACE_TYPES[0];

  // Recalculate default density when area or space type changes
  const calcDefaultOccupants = () => {
    if (isMetric) {
      return Math.ceil((area / 100) * spaceType.defaultDensityMet);
    } else {
      return Math.ceil((area / 1000) * spaceType.defaultDensityImp);
    }
  };

  const occupants = useDefaultDensity ? calcDefaultOccupants() : customOccupants;

  // Calculation
  const rp = isMetric ? spaceType.rpMet : spaceType.rpImp;
  const ra = isMetric ? spaceType.raMet : spaceType.raImp;

  const typicalOccupants = calcDefaultOccupants();
  const typicalVbz = (typicalOccupants * rp) + (area * ra);

  const vbp = occupants * rp; // Breathing zone outdoor airflow (people component)
  const vba = area * ra; // Breathing zone outdoor airflow (area component)
  const vbz = vbp + vba; // Breathing zone total
  const vozBase = vbz / zoneEz; // Zone outdoor airflow

  const deviation = typicalVbz > 0 ? (vbz / typicalVbz) : 1;
  let statusColor = 'text-emerald-400';
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let badgeText = 'Typical Range';
  let numberColor = 'text-slate-300';
  let vozNumberColor = 'text-white';
  let vozLabelColor = 'text-emerald-400';
  let borderClass = 'border-slate-800/50';
  let vozBorderClass = 'border-slate-800';
  let vozBgDeco = 'bg-emerald-500/10';

  if (deviation < 0.75) {
    statusColor = 'text-amber-400';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    badgeText = 'Below Typical';
    numberColor = 'text-amber-100';
    vozNumberColor = 'text-amber-50';
    vozLabelColor = 'text-amber-400';
    borderClass = 'border-amber-900/30';
    vozBorderClass = 'border-amber-900/50';
    vozBgDeco = 'bg-amber-500/10';
  } else if (deviation > 1.25) {
    statusColor = 'text-rose-400';
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    badgeText = 'Above Typical';
    numberColor = 'text-rose-100';
    vozNumberColor = 'text-rose-50';
    vozLabelColor = 'text-rose-400';
    borderClass = 'border-rose-900/30';
    vozBorderClass = 'border-rose-900/50';
    vozBgDeco = 'bg-rose-500/10';
  }

  // Air Density Adjustment
  const tempUnit = isMetric ? '°C' : '°F';
  const stdTempAbs = isMetric ? 20 + 273.15 : 70 + 459.67;
  const actualTempAbs = isMetric ? airTemp + 273.15 : airTemp + 459.67;
  const densityRatio = useTempAdj ? actualTempAbs / stdTempAbs : 1.0;
  
  const voz = vozBase * densityRatio; // Adjusted zone outdoor airflow

  // Validations
  const isExtremeArea = isMetric ? area > 50000 : area > 500000;
  const isExtremeTemp = useTempAdj && (isMetric ? (airTemp < -10 || airTemp > 50) : (airTemp < 14 || airTemp > 122));
  const actualDensity = area > 0 ? (occupants / area) * (isMetric ? 100 : 1000) : 0;
  const isExtremeDensity = !useDefaultDensity && actualDensity > (isMetric ? 215 : 200);

  const chartData = [
    { name: 'People Load', value: vbp, fill: '#38bdf8' },
    { name: 'Area Load', value: vba, fill: '#34d399' }
  ];

  const COLORS = ['#38bdf8', '#34d399'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INPUTS PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="mb-4 pb-4 border-b border-slate-800">
              <label className="block text-xs font-bold text-sky-400 mb-2 uppercase tracking-wider">Load Presets</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedSpaceId('office'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Office
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('conference'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Conference
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('classroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Classroom
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('gym'); setZoneEzId('cooling_floor_disp'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Gymnasium
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Space Type (ASHRAE 62.1)</label>
                <select
                  value={selectedSpaceId}
                  onChange={(e) => setSelectedSpaceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {SPACE_TYPES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <TooltipLabel label={`Floor Area (${areaUnit})`} tooltip="Total occupiable floor area of the zone." />
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={area === 0 ? '' : area}
                    onChange={(e) => setArea(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pl-9 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <Square className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{areaUnit}</span>
                </div>
                {isExtremeArea && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Unusually large area. Verify value.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <TooltipLabel label="Occupants" tooltip="Number of people in the zone." />
                  <label className="flex items-center text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={useDefaultDensity}
                      onChange={(e) => setUseDefaultDensity(e.target.checked)}
                      className="mr-2 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                    />
                    Use Default Density
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    disabled={useDefaultDensity}
                    value={occupants === 0 && !useDefaultDensity ? '' : occupants}
                    onChange={(e) => {
                      if (!useDefaultDensity) setCustomOccupants(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 pl-9 text-sm focus:outline-none transition-colors ${
                      useDefaultDensity 
                        ? 'bg-slate-900/50 border-slate-800/50 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  <Users className={`w-4 h-4 absolute left-3 top-2.5 ${useDefaultDensity ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">People</span>
                </div>
                {isExtremeDensity && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> High occupant density. Verify value.
                  </p>
                )}
              </div>

              <div>
                <TooltipLabel label="Air Distribution Effectiveness (Ez)" tooltip="1.0 for ceiling supply/return. 0.8 for ceiling supply/floor return. 1.2 for floor supply." />
                <select
                  value={zoneEzId}
                  onChange={(e) => setZoneEzId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {EZ_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>

                {zoneEz < 1.0 && (
                  <div className="mt-3 flex items-start space-x-2 bg-amber-950/30 border border-amber-900/50 p-2.5 rounded-lg text-amber-400">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[10.5px] leading-relaxed">
                      <strong className="font-semibold block mb-0.5">Effectiveness Penalty (Ez &lt; 1.0)</strong> 
                      This configuration is less than 100% effective at mixing. It will significantly increase the required outdoor airflow (Voz) to compensate.
                    </p>
                  </div>
                )}
                {zoneEz > 1.0 && (
                  <div className="mt-3 flex items-start space-x-2 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-lg text-emerald-400">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[10.5px] leading-relaxed">
                      <strong className="font-semibold block mb-0.5">High Effectiveness (Ez &gt; 1.0)</strong> 
                      This configuration (e.g., displacement ventilation) is highly effective, which safely reduces the required outdoor airflow (Voz).
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <TooltipLabel label={`Air Temperature (${tempUnit})`} tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume." />
                  <label className="flex items-center text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={useTempAdj}
                      onChange={(e) => setUseTempAdj(e.target.checked)}
                      className="mr-2 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                    />
                    Adjust Density
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!useTempAdj}
                    value={airTemp === 0 && !useTempAdj ? '' : airTemp}
                    onChange={(e) => {
                      if (useTempAdj) setAirTemp(e.target.value === '' ? 0 : Number(e.target.value));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 pl-9 text-sm focus:outline-none transition-colors ${
                      !useTempAdj 
                        ? 'bg-slate-900/50 border-slate-800/50 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  <Thermometer className={`w-4 h-4 absolute left-3 top-2.5 ${!useTempAdj ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{tempUnit}</span>
                </div>
                {isExtremeTemp && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Extreme temperature value. Verify units.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-full flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-6 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-emerald-400" />
              Ventilation Requirement (ASHRAE 62.1)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              
              <div className="flex flex-col justify-center space-y-6">
                <div className={`bg-slate-950/50 border ${borderClass} rounded-xl p-4 relative overflow-hidden transition-colors duration-300`}>
                  <div className="flex justify-between items-start mb-1">
                    <TooltipLabel label="Breathing Zone Outdoor Air (Vbz)" tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses." className="text-slate-400 text-xs font-medium mb-0" />
                    {!useDefaultDensity && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} transition-colors duration-300`}>
                        {badgeText}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-2xl font-bold ${numberColor} transition-colors duration-300`}>{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>

                <div className="flex justify-center -my-5 relative z-10 pointer-events-none">
                  <div className={`bg-slate-950/80 backdrop-blur-sm border-[4px] border-slate-900 ${vozLabelColor} text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center space-x-1 transition-colors duration-300`}>
                    <span>÷ Ez ({zoneEz})</span>
                    <ArrowDown className="w-3 h-3" />
                  </div>
                </div>

                <div className={`bg-slate-950 border ${vozBorderClass} rounded-xl p-4 relative overflow-hidden group transition-colors duration-300`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 ${vozBgDeco} rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-all duration-300`} />
                  <TooltipLabel label={useTempAdj ? "Required Zone Outdoor Air (Actual Voz)" : "Required Zone Outdoor Air (Standard Voz)"} tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)." className={`${vozLabelColor} text-xs font-bold uppercase tracking-wider mb-0 transition-colors duration-300`} />
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-black ${vozNumberColor} tracking-tight transition-colors duration-300`}>{Math.ceil(voz).toLocaleString()}</span>
                    <span className={`${vozLabelColor} font-semibold transition-colors duration-300`}>{flowUnit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">People Component</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-bold text-sky-400">{Math.ceil(vbp).toLocaleString()}</span>
                      <span className="text-xs text-slate-500">{flowUnit}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{rp} {flowUnit}/person</p>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Area Component</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-bold text-emerald-400">{Math.ceil(vba).toLocaleString()}</span>
                      <span className="text-xs text-slate-500">{flowUnit}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{ra} {flowUnit}/{areaUnit}</p>
                  </div>
                </div>
              </div>

              <div className="h-64 md:h-auto min-h-[250px] relative flex flex-col justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`${Math.ceil(value)} ${flowUnit}`, '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-sky-300 mb-2">Ventilation Rate (ASHRAE 62.1)</h4>
                <p className="text-xs text-slate-300 mb-4">Calculates the required outdoor airflow using the breathing-zone ventilation rate and zone air distribution effectiveness.</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 1 — Breathing Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Vbz = (Rp × Pz) + (Ra × Az)</code>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                  </div>
                  {useTempAdj && (
                    <div>
                      <p className="text-xs font-bold text-slate-200">Eq 3 — Actual Flow (Density Adjusted)</p>
                      <code className="text-emerald-400 text-xs font-mono">Voz(actual) = Voz × (T_actual / T_std)</code>
                    </div>
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-300 mb-1">FORMULA PARAMETERS</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li><span className="font-mono text-slate-300">Vbz</span> = Breathing zone outdoor airflow</li>
                  <li><span className="font-mono text-slate-300">Voz</span> = Zone outdoor airflow required</li>
                  <li><span className="font-mono text-slate-300">Rp</span> = Outdoor airflow rate required per person</li>
                  <li><span className="font-mono text-slate-300">Pz</span> = Zone population (number of people)</li>
                  <li><span className="font-mono text-slate-300">Ra</span> = Outdoor airflow rate required per unit area</li>
                  <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                  <li><span className="font-mono text-slate-300">Ez</span> = Zone air distribution effectiveness</li>
                  {useTempAdj && (
                    <>
                      <li><span className="font-mono text-slate-300">T_actual</span> = Actual absolute air temperature</li>
                      <li><span className="font-mono text-slate-300">T_std</span> = Standard absolute air temperature</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-4 h-full flex flex-col">
                <h4 className="font-semibold text-emerald-300 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ez Setup Guide (Table 6.2.2.2)
                </h4>
                <p className="text-xs text-slate-300 mb-4">Brief checklist for selecting correct Zone Air Distribution Effectiveness values based on common scenarios.</p>
                
                <ul className="text-xs text-slate-300 space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Cooling (Ceiling)</strong> <span className="text-emerald-400 font-mono text-[10px] ml-1">Ez = 1.0</span><br/>
                      <span className="text-slate-400">Standard overhead supply of cool air (typical AC).</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Heating (Ceiling to Ceiling)</strong> <span className="text-amber-400 font-mono text-[10px] ml-1">Ez = 0.8</span><br/>
                      <span className="text-slate-400">Supplying warm air (≥15°F/8°C above room temp) from ceiling with ceiling return (stratification penalty).</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Heating (Ceiling to Floor)</strong> <span className="text-emerald-400 font-mono text-[10px] ml-1">Ez = 1.0</span><br/>
                      <span className="text-slate-400">Supplying warm air from the ceiling but forcing return air low near the floor.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Displacement (Floor to Ceiling)</strong> <span className="text-sky-400 font-mono text-[10px] ml-1">Ez = 1.2</span><br/>
                      <span className="text-slate-400">Floor supply of cool air at low velocity, allowing thermal plumes to lift pollutants to ceiling returns.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
