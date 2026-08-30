import React, { useState, useEffect } from 'react';
import ValidationBanner, { ValidationItem } from './ValidationBanner';
import { Calculator, Settings2, Plus, Trash2, Wind, AlertCircle, TrendingUp, Info, Thermometer, Mountain } from 'lucide-react';
import { useLanguage } from '../lib/translations';
import { useUnit } from '../lib/UnitContext';
import TooltipLabel from './TooltipLabel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import InputAlert from './InputAlert';

interface FittingType {
  name: string;
  cValue: number;
}

const COMMON_FITTINGS: FittingType[] = [
  { name: 'Custom / Unknown', cValue: 0.5 },
  { name: '90° Radius Elbow (R/D=1.5)', cValue: 0.14 },
  { name: '90° Mitered Elbow (no vanes)', cValue: 1.15 },
  { name: '90° Mitered Elbow (w/ vanes)', cValue: 0.22 },
  { name: '45° Radius Elbow', cValue: 0.10 },
  { name: 'Branch Takeoff (Conical)', cValue: 0.30 },
  { name: 'Branch Takeoff (Straight)', cValue: 0.85 },
  { name: 'Transition (Contraction 30°)', cValue: 0.05 },
  { name: 'Transition (Expansion 30°)', cValue: 0.25 },
  { name: 'Fire Damper (Fully Open)', cValue: 0.20 },
];

interface DuctSection {
  id: string;
  name: string;
  airflow: number;
  width: number;
  height: number;
  length: number;
  fittings: { id: string; typeIndex: number; customC: number; qty: number }[];
}

export default function StaticPressureCalc() {
  const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';

  const lenUnit = isMetric ? 'm' : 'ft';
  const ductDimUnit = isMetric ? 'mm' : 'in';
  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const pressUnit = isMetric ? 'Pa' : 'in. wg';
  const velUnit = isMetric ? 'm/s' : 'FPM';

  // Air Density States
  const [altitude, setAltitude] = useState<number>(0);
  const [useAltitudeAdj, setUseAltitudeAdj] = useState<boolean>(false);
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);
  const [useTempAdj, setUseTempAdj] = useState<boolean>(false);
  const [actualDensity, setActualDensity] = useState<number>(0.075);
  const [densityRatio, setDensityRatio] = useState<number>(1.0);


  const [sections, setSections] = useState<DuctSection[]>([
    {
      id: '1',
      name: 'Main Trunk',
      airflow: isMetric ? 1000 : 2000,
      width: isMetric ? 600 : 24,
      height: isMetric ? 400 : 16,
      length: isMetric ? 15 : 50,
      fittings: [
        { id: 'f1', typeIndex: 1, customC: 0.14, qty: 2 }
      ]
    }
  ]);

  const [filterDrop, setFilterDrop] = useState<number>(isMetric ? 75 : 0.3);
  const [coilDrop, setCoilDrop] = useState<number>(isMetric ? 125 : 0.5);
  const [damperDrop, setDamperDrop] = useState<number>(isMetric ? 25 : 0.1);
  const [diffuserDrop, setDiffuserDrop] = useState<number>(isMetric ? 25 : 0.1);
  const [safetyFactor, setSafetyFactor] = useState<number>(10);

  const [results, setResults] = useState({
    totalStraightLoss: 0,
    totalFittingLoss: 0,
    equipmentLoss: 0,
    totalStaticPressure: 0,
    designStaticPressure: 0,
    sectionDetails: [] as any[]
  });

  const addSection = () => {
    setSections([...sections, {
      id: Math.random().toString(),
      name: `Branch ${sections.length + 1}`,
      airflow: isMetric ? 250 : 500,
      width: isMetric ? 300 : 12,
      height: isMetric ? 300 : 12,
      length: isMetric ? 5 : 15,
      fittings: []
    }]);
  };

  const updateSection = (id: string, field: keyof DuctSection, value: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const addFittingToSection = (sectionId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fittings: [...s.fittings, { id: Math.random().toString(), typeIndex: 1, customC: COMMON_FITTINGS[1].cValue, qty: 1 }]
        };
      }
      return s;
    }));
  };

  const updateFitting = (sectionId: string, fittingId: string, field: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          fittings: s.fittings.map(f => {
            if (f.id === fittingId) {
              const updated = { ...f, [field]: value };
              if (field === 'typeIndex') {
                updated.customC = COMMON_FITTINGS[value].cValue;
              }
              return updated;
            }
            return f;
          })
        };
      }
      return s;
    }));
  };

  const removeFitting = (sectionId: string, fittingId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, fittings: s.fittings.filter(f => f.id !== fittingId) };
      }
      return s;
    }));
  };

  useEffect(() => {
    // Altitude & Temperature Density Correction
    const alt_ft = isMetric ? altitude * 3.28084 : altitude;
    let P_atm = 14.696;
    if (useAltitudeAdj && alt_ft > 0) {
      P_atm = 14.696 * Math.pow(1 - 6.8754e-6 * alt_ft, 5.2559);
    }
    
    let T_F = 70;
    if (useTempAdj) {
      T_F = isMetric ? (airTemp * 9 / 5) + 32 : airTemp;
    }
    const T_R = T_F + 459.67;
    
    const standardDensity = 0.075;
    const calcDensity = standardDensity * (P_atm / 14.696) * (529.67 / T_R);
    const calcRatio = calcDensity / standardDensity;
    
    setActualDensity(isMetric ? calcDensity * 16.0185 : calcDensity);
    setDensityRatio(calcRatio);

    let totalStraight = 0;
    let totalFittings = 0;
    const sectionDetails = [];

    sections.forEach(sec => {
      // 1. Convert everything to Imperial (CFM, inches, feet) for internal ASHRAE formulas
      const cfm = isMetric ? sec.airflow * 2.11888 : sec.airflow;
      const w_in = isMetric ? sec.width / 25.4 : sec.width;
      const h_in = isMetric ? sec.height / 25.4 : sec.height;
      const l_ft = isMetric ? sec.length * 3.28084 : sec.length;

      // 2. Equivalent diameter & Velocity
      const area_sqin = w_in * h_in;
      const area_sqft = area_sqin / 144;
      const vel_fpm = area_sqft > 0 ? cfm / area_sqft : 0;
      
      const de_in = 1.3 * Math.pow(w_in * h_in, 0.625) / Math.pow(w_in + h_in, 0.25);
      
      // 3. Friction Rate (in. wg per 100 ft) - ASHRAE approximation
      let fr_in_100 = 0;
      if (vel_fpm > 0 && de_in > 0) {
        // Friction rate is directly proportional to density ratio
        fr_in_100 = (0.109136 * Math.pow(vel_fpm, 1.9) / Math.pow(de_in, 1.22)) * calcRatio;
      }
      
      // 4. Straight duct loss (in. wg)
      const secStraightLoss_in = (l_ft / 100) * fr_in_100;
      
      // 5. Velocity Pressure (in. wg)
      // Pv = rho * (V / 1096.5)^2 -> simplified with density ratio
      const pv_in = calcRatio * Math.pow(vel_fpm / 4005, 2);
      
      // 6. Fittings Loss
      let secFittingLoss_in = 0;
      sec.fittings.forEach(fit => {
        secFittingLoss_in += fit.customC * pv_in * fit.qty;
      });

      // Convert back to metric if needed
      const secStraightLoss = isMetric ? secStraightLoss_in * 249.089 : secStraightLoss_in;
      const secFittingLoss = isMetric ? secFittingLoss_in * 249.089 : secFittingLoss_in;
      const secPv = isMetric ? pv_in * 249.089 : pv_in;
      const secVel = isMetric ? vel_fpm * 0.00508 : vel_fpm;
      
      totalStraight += secStraightLoss;
      totalFittings += secFittingLoss;

      sectionDetails.push({
        id: sec.id,
        name: sec.name,
        velocity: secVel,
        pv: secPv,
        straightLoss: secStraightLoss,
        fittingLoss: secFittingLoss,
        totalLoss: secStraightLoss + secFittingLoss
      });
    });

    const equipLoss = filterDrop + coilDrop + damperDrop + diffuserDrop;
    const totalSP = totalStraight + totalFittings + equipLoss;
    const designSP = totalSP * (1 + (safetyFactor / 100));

    setResults({
      totalStraightLoss: totalStraight,
      totalFittingLoss: totalFittings,
      equipmentLoss: equipLoss,
      totalStaticPressure: totalSP,
      designStaticPressure: designSP,
      sectionDetails
    });
  }, [sections, filterDrop, coilDrop, damperDrop, diffuserDrop, safetyFactor, isMetric, altitude, useAltitudeAdj, airTemp, useTempAdj]);
  // Validation Engine
  const validations: ValidationItem[] = [];

  if (useAltitudeAdj && altitude > (isMetric ? 1000 : 3280)) {
    validations.push({
      id: 'altitude-high',
      severity: 'info',
      message: `High altitude (${altitude} ${isMetric ? 'm' : 'ft'}) significantly reduces air density. System static pressure will be lower than at sea level for the same actual volumetric flow rate.`,
    });
  }

  if (useTempAdj && ((isMetric && airTemp > 40) || (!isMetric && airTemp > 104))) {
    validations.push({
      id: 'temp-high',
      severity: 'warning',
      message: `Elevated airstream temperature (${airTemp}°${isMetric ? 'C' : 'F'}) reduces density. This lowers static pressure for a given actual volume, but decreases mass flow.`,
    });
  }
  if (results.designStaticPressure > (isMetric ? 750 : 3.0)) {
    validations.push({
      id: 'sp-high',
      severity: 'error',
      message: `Total Design Static Pressure (${results.designStaticPressure.toFixed(isMetric ? 0 : 2)} ${isMetric ? 'Pa' : 'in.wg'}) exceeds typical commercial limits. Fan motor power will be excessively high. Optimize duct sizing or equipment selection.`,
    });
  } else if (results.designStaticPressure > (isMetric ? 500 : 2.0)) {
    validations.push({
      id: 'sp-warn',
      severity: 'warning',
      message: `Total Design Static Pressure (${results.designStaticPressure.toFixed(isMetric ? 0 : 2)} ${isMetric ? 'Pa' : 'in.wg'}) is high. Verify if a medium or high-pressure class duct system is required.`,
    });
  }
  
  if (safetyFactor < 10) {
    validations.push({
      id: 'sf-low',
      severity: 'warning',
      message: `Safety factor (${safetyFactor}%) is low. Standard practice recommends 10% to 15% to account for installation variations.`,
    });
  }
  
  // Find sections with very high velocity or friction
  results.sectionDetails.forEach(det => {
    if (det.velocity > (isMetric ? 12.7 : 2500)) {
      validations.push({
        id: `sec-${det.id}-vel`,
        severity: 'error',
        message: `Section "${det.name}" velocity (${det.velocity.toFixed(0)} ${isMetric ? 'm/s' : 'FPM'}) is dangerously high and will cause severe acoustic issues.`,
      });
    }
  });

  
  // Compute Chart Data
  const chartData: any[] = [];
  let cum = 0;
  chartData.push({ name: 'Start', SP: 0 });
  
  results.sectionDetails.forEach(sec => {
    if (sec.straightLoss > 0) {
      cum += sec.straightLoss;
      chartData.push({ name: `${sec.name} (Duct)`, SP: cum });
    }
    if (sec.fittingLoss > 0) {
      cum += sec.fittingLoss;
      chartData.push({ name: `${sec.name} (Fittings)`, SP: cum });
    }
  });
  
  if (results.equipmentLoss > 0) {
    cum += results.equipmentLoss;
    chartData.push({ name: 'Equipment Drops', SP: cum });
  }

  // Final point matches total unadjusted SP (design SP is just a safety factor)
  // Or we can add Safety factor
  if (safetyFactor > 0) {
    cum += results.designStaticPressure - results.totalStaticPressure;
    chartData.push({ name: 'Safety Margin', SP: cum });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ValidationBanner validations={validations} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-800 pb-3 gap-3">
              <div className="flex items-center space-x-2">
                <Mountain className="h-4.5 w-4.5 text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Air Density Adjustments</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-[10px] text-slate-400 font-mono flex flex-col text-right leading-tight bg-slate-950 px-2 py-1 rounded border border-slate-800/50">
                  <span>Actual: <strong className="text-sky-400">{actualDensity.toFixed(4)}</strong> {isMetric ? 'kg/m³' : 'lb/ft³'}</span>
                  <span>Ratio: <strong className="text-sky-400">{densityRatio.toFixed(3)}</strong></span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Altitude Correction */}
              <div>
                <TooltipLabel label="Altitude / Air Density" tooltip="Adjust air density based on non-sea-level altitude." className="text-sky-400 mb-2" />
                <div className="flex items-center space-x-2">
                  <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer w-20 shrink-0">
                    <input
                      type="checkbox"
                      checked={useAltitudeAdj}
                      onChange={(e) => setUseAltitudeAdj(e.target.checked)}
                      className="mr-1.5 rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-900"
                    />
                    Enable
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      disabled={!useAltitudeAdj}
                      value={altitude === 0 && !useAltitudeAdj ? '' : altitude}
                      onChange={(e) => {
                        if (useAltitudeAdj) setAltitude(e.target.value === '' ? 0 : Number(e.target.value));
                      }}
                      placeholder="Altitude"
                      className={`w-full bg-slate-950 rounded-lg pl-9 pr-8 py-1.5 text-sm font-mono focus:outline-none transition-colors border ${
                        !useAltitudeAdj ? 'text-slate-600 border-slate-800' : 'text-white border-slate-700 focus:border-sky-500'
                      }`}
                    />
                    <Mountain className={`w-3.5 h-3.5 absolute left-3 top-2 ${!useAltitudeAdj ? 'text-slate-700' : 'text-slate-500'}`} />
                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-500 select-none uppercase">{isMetric ? 'm' : 'ft'}</span>
                  </div>
                </div>
              </div>

              {/* Temperature Correction */}
              <div>
                <TooltipLabel label="Air Temperature" tooltip="Adjust air density based on actual air stream temperature (e.g. heated makeup air or hot exhaust)." className="text-sky-400 mb-2" />
                <div className="flex items-center space-x-2">
                  <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer w-20 shrink-0">
                    <input
                      type="checkbox"
                      checked={useTempAdj}
                      onChange={(e) => setUseTempAdj(e.target.checked)}
                      className="mr-1.5 rounded border-slate-700 text-sky-500 focus:ring-sky-500 bg-slate-900"
                    />
                    Enable
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      disabled={!useTempAdj}
                      value={airTemp}
                      onChange={(e) => {
                        if (useTempAdj) setAirTemp(e.target.value === '' ? 0 : Number(e.target.value));
                      }}
                      className={`w-full bg-slate-950 rounded-lg pl-9 pr-8 py-1.5 text-sm font-mono focus:outline-none transition-colors border ${
                        !useTempAdj ? 'text-slate-600 border-slate-800' : 'text-white border-slate-700 focus:border-sky-500'
                      }`}
                    />
                    <Thermometer className={`w-3.5 h-3.5 absolute left-3 top-2 ${!useTempAdj ? 'text-slate-700' : 'text-slate-500'}`} />
                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-500 select-none uppercase">°{isMetric ? 'C' : 'F'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Duct Index Run (Critical Path)</h3>
              </div>
              <button 
                onClick={addSection}
                className="bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40 px-3 py-1.5 rounded-lg flex items-center text-xs font-bold uppercase transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Section
              </button>
            </div>
            
            <div className="space-y-6">
              {sections.map((sec, index) => {
                const det = results.sectionDetails.find(d => d.id === sec.id);
                return (
                  <div key={sec.id} className="bg-slate-950/50 rounded-xl border border-slate-850 p-4">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800/60 pb-2">
                      <input
                        type="text"
                        value={sec.name}
                        onChange={e => updateSection(sec.id, 'name', e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-200 focus:outline-none focus:text-indigo-400 w-1/2"
                      />
                      <div className="flex items-center space-x-4">
                        {det && (
                          <div className="flex space-x-3 text-[10px] font-mono text-slate-500">
                            <span>V: <strong className="text-indigo-400">{det.velocity.toFixed(1)}</strong> {velUnit}</span>
                            <span>Pv: <strong className="text-indigo-400">{det.pv.toFixed(isMetric ? 1 : 3)}</strong> {pressUnit}</span>
                          </div>
                        )}
                        {sections.length > 1 && (
                          <button onClick={() => removeSection(sec.id)} className="text-slate-500 hover:text-red-400 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <TooltipLabel label={`Airflow (${flowUnit})`} className="text-[10px] text-slate-400 uppercase font-bold mb-1 block" />
                        <input
                          type="number" min="1"
                          value={sec.airflow || ''}
                          onChange={e => updateSection(sec.id, 'airflow', Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none border border-slate-800 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <TooltipLabel label={`Width/Dia (${ductDimUnit})`} className="text-[10px] text-slate-400 uppercase font-bold mb-1 block" />
                        <input
                          type="number" min="1"
                          value={sec.width || ''}
                          onChange={e => updateSection(sec.id, 'width', Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none border border-slate-800 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <TooltipLabel label={`Height (${ductDimUnit})`} className="text-[10px] text-slate-400 uppercase font-bold mb-1 block" />
                        <input
                          type="number" min="1"
                          value={sec.height || ''}
                          onChange={e => updateSection(sec.id, 'height', Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none border border-slate-800 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <TooltipLabel label={`Length (${lenUnit})`} className="text-[10px] text-slate-400 uppercase font-bold mb-1 block" />
                        <input
                          type="number" min="0" step="0.1"
                          value={sec.length || ''}
                          onChange={e => updateSection(sec.id, 'length', Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none border border-slate-800 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-900/80 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Fittings (Loss = C × Pv)</span>
                        <button 
                          onClick={() => addFittingToSection(sec.id)}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 uppercase font-bold flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add Fitting
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {sec.fittings.map(fit => (
                          <div key={fit.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                            <select
                              value={fit.typeIndex}
                              onChange={e => updateFitting(sec.id, fit.id, 'typeIndex', Number(e.target.value))}
                              className="flex-grow bg-slate-950 text-slate-200 text-xs px-2 py-1.5 rounded border border-slate-800 focus:outline-none min-w-[150px]"
                            >
                              {COMMON_FITTINGS.map((f, i) => (
                                <option key={i} value={i}>{f.name}</option>
                              ))}
                            </select>
                            
                            <div className="flex items-center space-x-2 w-full md:w-auto">
                              <div className="w-16">
                                <TooltipLabel label="C-Val" className="text-[8px] text-slate-500 uppercase block ml-1" />
                                <input
                                  type="number" step="0.01"
                                  value={fit.customC}
                                  onChange={e => updateFitting(sec.id, fit.id, 'customC', Number(e.target.value) || 0)}
                                  className="w-full bg-slate-950 text-slate-200 text-xs px-2 py-1.5 rounded border border-slate-800 focus:outline-none font-mono text-center"
                                />
                              </div>
                              <div className="w-12">
                                <TooltipLabel label="Qty" className="text-[8px] text-slate-500 uppercase block ml-1" />
                                <input
                                  type="number" min="1"
                                  value={fit.qty || ''}
                                  onChange={e => updateFitting(sec.id, fit.id, 'qty', Number(e.target.value) || 0)}
                                  className="w-full bg-slate-950 text-slate-200 text-xs px-2 py-1.5 rounded border border-slate-800 focus:outline-none font-mono text-center"
                                />
                              </div>
                              <button onClick={() => removeFitting(sec.id, fit.id)} className="text-slate-500 hover:text-red-400 mt-3 p-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {sec.fittings.length === 0 && (
                          <span className="text-[10px] text-slate-500 italic block mt-1">No fittings in this section.</span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center space-x-2 mb-6 border-b border-slate-800 pb-3">
              <Wind className="h-4.5 w-4.5 text-rose-400" />
              <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Equipment Pressure Drops</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Filters ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={filterDrop || ''}
                  onChange={(e) => setFilterDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Coils ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={coilDrop || ''}
                  onChange={(e) => setCoilDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Dampers ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={damperDrop || ''}
                  onChange={(e) => setDamperDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Diffusers ({pressUnit})</label>
                <input
                  type="number" step="0.01" min="0"
                  value={diffuserDrop || ''}
                  onChange={(e) => setDiffuserDrop(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white rounded-lg px-2.5 py-1.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-rose-500/50 border border-slate-800"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Results */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-6 border-b border-indigo-500/20 pb-3">
              Total System Static Pressure
            </h3>
            <div className="space-y-5">
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Total Straight Loss</span>
                <span className="text-sm font-mono text-slate-200">{results.totalStraightLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-slate-500">{pressUnit}</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Total Fittings Loss</span>
                <span className="text-sm font-mono text-slate-200">{results.totalFittingLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-slate-500">{pressUnit}</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2">
                <span className="text-xs text-slate-400">Equipment Drops</span>
                <span className="text-sm font-mono text-rose-300">{results.equipmentLoss.toFixed(isMetric ? 0 : 3)} <span className="text-[10px] text-rose-500/60">{pressUnit}</span></span>
              </div>

            </div>

            <div className="mt-8 pt-5 border-t border-indigo-500/30">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase">System Static Pressure</span>
                <span className="text-[10px] text-slate-500">Unadjusted</span>
              </div>
              <div className="flex items-baseline space-x-2 text-indigo-100">
                <span className="text-3xl font-black font-mono tracking-tighter shadow-indigo-500/20">{results.totalStaticPressure.toFixed(isMetric ? 0 : 2)}</span>
                <span className="text-sm font-bold text-indigo-400">{pressUnit}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-950/50 border border-indigo-900/50 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-indigo-300 uppercase">Design / Fan Selection SP</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-indigo-400/60">+ Safety Factor</span>
                  <input
                    type="number" min="0" max="100"
                    value={safetyFactor || ''}
                    onChange={(e) => setSafetyFactor(Number(e.target.value) || 0)}
                    className="w-12 bg-slate-900 text-indigo-300 rounded px-1.5 py-1 text-xs font-mono focus:outline-none border border-indigo-800 text-center"
                  />
                  <span className="text-[10px] text-indigo-400/60">%</span>
                </div>
              </div>
              
              <div className="flex items-baseline space-x-2 text-white drop-shadow-md">
                <span className="text-4xl font-black font-mono tracking-tighter">{results.designStaticPressure.toFixed(isMetric ? 0 : 2)}</span>
                <span className="text-sm font-bold text-indigo-400">{pressUnit}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-start space-x-2 text-[10px] text-indigo-200/60 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-indigo-400/80" />
              <p>ASHRAE Dynamic Pressure method. Pressure losses are calculated via velocity pressure ($P_v$) and loss coefficients ($C$).</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
