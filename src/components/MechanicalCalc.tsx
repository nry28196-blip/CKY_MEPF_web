import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, PieChart, Pie } from 'recharts';
import { Chart } from 'react-google-charts';
import React, { useState, useEffect } from 'react';
import { Wind, Layers, Sliders, Thermometer, Info, Bookmark, CheckCircle2, FileSpreadsheet, Mail, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import DuctSizingCalc from './DuctSizingCalc';
import VentilationCalc from './VentilationCalc';
import TrendVisualizer from './TrendVisualizer';
import VrfTopologyCanvas from './VrfTopologyCanvas';
import TooltipLabel from './TooltipLabel';
import FormulaVisualizer, { FormulaDef } from './FormulaVisualizer';
import { useLanguage } from '../lib/translations';
import { exportCoolingLoadToCsv, exportVrfToCsv } from '../lib/exportCsv';

type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation';

interface MechanicalCalcProps {
  restoredParams?: any;
  onSaveCalculation?: any;
  autoCalculate?: boolean;
  isDarkMode?: boolean;
}

export default function MechanicalCalc({ restoredParams, onSaveCalculation, autoCalculate, isDarkMode }: MechanicalCalcProps) {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTab>('ductSizing'); // Default to the highly advanced requested module!

  // --- NEW ADVANCED ASHRAE STATE ---
  const [outdoorTemp, setOutdoorTemp] = useState<number>(35);
  const [indoorTemp, setIndoorTemp] = useState<number>(24);
  const [height, setHeight] = useState<number>(3);
  const [sensiblePerPerson, setSensiblePerPerson] = useState<number>(75);
  const [latentPerPerson, setLatentPerPerson] = useState<number>(55);
  const [lightingWpm2, setLightingWpm2] = useState<number>(12);
  const [equipmentWatts, setEquipmentWatts] = useState<number>(500);
  const [wallArea, setWallArea] = useState<number>(40);
  const [wallUValue, setWallUValue] = useState<number>(2.0);
  const [roofArea, setRoofArea] = useState<number>(50);
  const [roofUValue, setRoofUValue] = useState<number>(0.5);
  const [windowArea, setWindowArea] = useState<number>(10);
  const [windowUValue, setWindowUValue] = useState<number>(3.0);
  const [windowShgc, setWindowShgc] = useState<number>(0.6);
  const [ventilationLps, setVentilationLps] = useState<number>(25);
  const [infiltrationACH, setInfiltrationACH] = useState<number>(0.5);
  const [safetyFactor, setSafetyFactor] = useState<number>(10);

  const [estimationBasis, setEstimationBasis] = useState<'area' | 'volume'>('area');
  const [area, setArea] = useState<number | ''>(50);
  const [volume, setVolume] = useState<number | ''>(150);
  const [occupants, setOccupants] = useState<number | ''>(5);
  const [chartMode, setChartMode] = useState<'bar' | 'pie'>('pie');
  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Constants
  const baseLoadPerSqm = 150; 
  const baseLoadPerCum = 50;
  const loadPerPerson = 100;

  // VRF state variables
  const [isVrf, setIsVrf] = useState<boolean>(false);
  const [diversityFactor, setDiversityFactor] = useState<number>(1.15);
  const [pipingLength, setPipingLength] = useState<number>(98); // 25 + 12 + 28 + 18 + 15 = 98m
  const [refrigerantType, setRefrigerantType] = useState<'R410A' | 'R32'>('R410A');
  const [pipeMaterial, setPipeMaterial] = useState<'Copper' | 'Steel' | 'PVC'>('Copper');
  const [isOduAuto, setIsOduAuto] = useState<boolean>(true);
  const [customOduHp, setCustomOduHp] = useState<number>(24);
  const [maxAllowedCr, setMaxAllowedCr] = useState<number>(130);
  const [mainPipingLength, setMainPipingLength] = useState<number>(25);
  const [customPipesTotal, setCustomPipesTotal] = useState<number | null>(null);
  const [autoCalcPiping, setAutoCalcPiping] = useState<boolean>(true);

  const calcRoomTonsAndWatts = (basis: 'area' | 'volume', size: number, occupants: number) => {
    const watts = (basis === 'area' ? size * baseLoadPerSqm : size * baseLoadPerCum) + (occupants * loadPerPerson);
    const btu = watts * 3.412;
    const tons = btu / 12000;
    return { watts, tons };
  };

  const [vrfRooms, setVrfRooms] = useState<Array<{
    id: string;
    name: string;
    basis: 'area' | 'volume';
    size: number;
    occupants: number;
    tons: number;
    watts: number;
    pipeLength?: number;
  }>>([
    { id: '1', name: 'Executive Suite', basis: 'area', size: 35, occupants: 3, pipeLength: 12, ...calcRoomTonsAndWatts('area', 35, 3) },
    { id: '2', name: 'Open Office Area', basis: 'area', size: 150, occupants: 18, pipeLength: 28, ...calcRoomTonsAndWatts('area', 150, 18) },
    { id: '3', name: 'Conference Zone', basis: 'area', size: 45, occupants: 12, pipeLength: 18, ...calcRoomTonsAndWatts('area', 45, 12) },
    { id: '4', name: 'Reception & Lobby', basis: 'area', size: 30, occupants: 4, pipeLength: 15, ...calcRoomTonsAndWatts('area', 30, 4) }
  ]);

  // Synchronize piping length automatically based on canvas line sets
  useEffect(() => {
    if (autoCalcPiping) {
      if (customPipesTotal !== null) {
        setPipingLength(customPipesTotal);
      } else {
        const totalBranchLength = vrfRooms.reduce((sum, r) => sum + (r.pipeLength ?? 15), 0);
        setPipingLength(mainPipingLength + totalBranchLength);
      }
    }
  }, [autoCalcPiping, mainPipingLength, vrfRooms, customPipesTotal]);

  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomBasis, setNewRoomBasis] = useState<'area' | 'volume'>('area');
  const [newRoomSize, setNewRoomSize] = useState<number | ''>('');
  const [newRoomOccupants, setNewRoomOccupants] = useState<number | ''>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (restoredParams && restoredParams.tab === 'mechanical' && restoredParams.id !== loadedHistoryId) {
      setLoadedHistoryId(restoredParams.id);
      if (restoredParams.subType) {
        setSubTab(restoredParams.subType as SubTab);
      }
      if (restoredParams.subType === 'cooling') {
        const p = restoredParams.parameters;
        if (p) {
          if (p.isVrf !== undefined) setIsVrf(p.isVrf);
          if (p.vrfRooms !== undefined) setVrfRooms(p.vrfRooms);
          if (p.diversityFactor !== undefined) setDiversityFactor(p.diversityFactor);
          if (p.pipingLength !== undefined) setPipingLength(p.pipingLength);
          if (p.refrigerantType !== undefined) setRefrigerantType(p.refrigerantType);
          if (p.pipeMaterial !== undefined) setPipeMaterial(p.pipeMaterial);
          if (p.isOduAuto !== undefined) setIsOduAuto(p.isOduAuto);
          if (p.customOduHp !== undefined) setCustomOduHp(p.customOduHp);
          if (p.maxAllowedCr !== undefined) setMaxAllowedCr(p.maxAllowedCr);
          if (p.mainPipingLength !== undefined) setMainPipingLength(p.mainPipingLength);
          if (p.autoCalcPiping !== undefined) setAutoCalcPiping(p.autoCalcPiping);
          if (p.area !== undefined) setArea(p.area);
          if (p.volume !== undefined) setVolume(p.volume);
          if (p.estimationBasis !== undefined) setEstimationBasis(p.estimationBasis);
          if (p.occupants !== undefined) setOccupants(p.occupants);
          triggerToast('Cooling / VRF parameters loaded!');
        }
      }
    }
  }, [restoredParams, loadedHistoryId]);

  const calculateCoolingLoad = () => {
    const dT = outdoorTemp - indoorTemp;
    const numArea = Number(area) || 0;
    const numOccupants = Number(occupants) || 0;

    // 1. People
    const peopleSensible = numOccupants * sensiblePerPerson;
    const peopleLatent = numOccupants * latentPerPerson;
    
    // 2. Lighting
    const lightingSensible = numArea * lightingWpm2;
    
    // 3. Equipment
    const equipmentSensible = equipmentWatts;
    
    // 4. Envelope (Walls, Roof, Window Conduction)
    const wallSensible = wallArea * wallUValue * dT;
    const roofSensible = roofArea * roofUValue * dT;
    const windowCondSensible = windowArea * windowUValue * dT;
    
    // 5. Solar (Window SHGC)
    const solarIrradiance = 400; // Peak solar irradiance assumption W/m2
    const solarSensible = windowArea * windowShgc * solarIrradiance;
    
    // 6. Ventilation (Sensible & Latent)
    const ventSensible = 1.21 * ventilationLps * dT;
    // Latent assumption: outdoor humidity ratio approx 0.016, indoor 0.009 -> dw = 0.007
    const dw = 0.007; 
    const ventLatent = 3010 * ventilationLps * dw;
    
    // 7. Infiltration
    const numVolume = numArea * height;
    const infiltrationLps = (infiltrationACH * numVolume * 1000) / 3600;
    const infiltrationSensible = 1.21 * infiltrationLps * dT;
    const infiltrationLatent = 3010 * infiltrationLps * dw;

    const totalSensible = peopleSensible + lightingSensible + equipmentSensible + wallSensible + roofSensible + windowCondSensible + solarSensible + ventSensible + infiltrationSensible;
    const totalLatent = peopleLatent + ventLatent + infiltrationLatent;
    const calculatedTotal = totalSensible + totalLatent;
    const finalTotal = calculatedTotal * (1 + safetyFactor / 100);

    return {
      peopleSensible, peopleLatent, lightingSensible, equipmentSensible,
      wallSensible, roofSensible, windowCondSensible, solarSensible,
      ventSensible, ventLatent, infiltrationSensible, infiltrationLatent, 
      totalSensible, totalLatent,
      calculatedTotal, finalTotal,
      watts: finalTotal,
      btu: finalTotal * 3.412142,
      tons: finalTotal / 3516.85284
    };
  };

  const results = calculateCoolingLoad();

  const getVrfCalculations = () => {
    let totalConnectedTons = 0;
    let totalConnectedWatts = 0;
    let totalOccupants = 0;
    
    vrfRooms.forEach(r => {
      totalConnectedTons += r.tons;
      totalConnectedWatts += r.watts;
      totalOccupants += r.occupants;
    });
    
    const coincidentTons = totalConnectedTons / diversityFactor;
    const coincidentWatts = totalConnectedWatts / diversityFactor;
    
    // Recommend ODU HP size
    const vrfOduSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60];
    const targetHP = coincidentTons / 0.8;
    
    let autoHP = vrfOduSizes[0];
    for (const size of vrfOduSizes) {
      if (size >= targetHP) {
        autoHP = size;
        break;
      }
      autoHP = size;
    }

    const selectedHP = isOduAuto ? autoHP : customOduHp;
    
    const oduCapacityTons = selectedHP * 0.8;
    const oduCapacityWatts = selectedHP * 2800; // 1 HP ≈ 2800 Watts thermal
    const combinationRatio = oduCapacityTons > 0 ? (totalConnectedTons / oduCapacityTons) * 100 : 0;
    
    // Refrigerant additional charge
    const chargePerMeter = refrigerantType === 'R32' ? 0.050 : 0.055;
    const additionalCharge = pipingLength * chargePerMeter;

    // Derating capacity calculation
    const deratingPercentPerMeter = 0.0015;
    const deratingFactor = Math.max(0.65, 1.0 - Math.max(0, pipingLength - 7.5) * deratingPercentPerMeter);
    const deratedOduCapacityTons = oduCapacityTons * deratingFactor;
    const capacityDeficit = coincidentTons - deratedOduCapacityTons;
    const hasCapacityDeficit = capacityDeficit > 0 && vrfRooms.length > 0;

    // Safety limit concentration check (ASHRAE 15 / ISO 5149)
    let toxicLimitExceeded = false;
    let toxicConcentration = 0;
    let smallestRoomName = '';
    let smallestRoomVol = 0;
    const baseOduCharge = selectedHP * 0.3; // kg pre-charge approximation
    const totalCharge = additionalCharge + baseOduCharge;

    if (vrfRooms.length > 0) {
      const roomVolumes = vrfRooms.map(r => ({
        name: r.name,
        vol: r.basis === 'volume' ? r.size : r.size * 3
      }));
      const sortedRoomsByVol = [...roomVolumes].sort((a, b) => a.vol - b.vol);
      if (sortedRoomsByVol.length > 0) {
        smallestRoomName = sortedRoomsByVol[0].name;
        smallestRoomVol = sortedRoomsByVol[0].vol;
        toxicConcentration = totalCharge / (smallestRoomVol || 1);
        const safeLimit = refrigerantType === 'R32' ? 0.30 : 0.44; // kg/m³
        if (toxicConcentration > safeLimit) {
          toxicLimitExceeded = true;
        }
      }
    }
    
    return {
      totalConnectedTons,
      totalConnectedWatts,
      totalOccupants,
      coincidentTons,
      coincidentWatts,
      oduHP: selectedHP,
      oduTons: oduCapacityTons,
      oduWatts: oduCapacityWatts,
      combinationRatio,
      additionalCharge,
      autoHP,
      deratingFactor,
      deratedOduCapacityTons,
      hasCapacityDeficit,
      capacityDeficit,
      toxicLimitExceeded,
      toxicConcentration,
      smallestRoomName,
      smallestRoomVol,
      baseOduCharge,
      totalCharge
    };
  };

  const vrfResults = getVrfCalculations();

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs toggle */}
      <div className="flex border-b border-slate-800 pb-1 gap-2">
        <button
          onClick={() => setSubTab('ductSizing')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === 'ductSizing'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {t('mechDuctSizingTitle')}
        </button>
        <button
          onClick={() => setSubTab('ventilation')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === 'ventilation'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {t('mechVentilationTitle') || 'Ventilation'}
        </button>
        <button
          onClick={() => setSubTab('cooling')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === 'cooling'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {t('mechCoolingTitle')}
        </button>
        <button
          onClick={() => setSubTab('formulas')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === 'formulas'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Formulas
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg shadow-xl shadow-emerald-950/20 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Conditional Rendering */}
      {subTab === 'ventilation' ? (
        <VentilationCalc />
      ) : subTab === 'formulas' ? (
        <FormulaVisualizer
          category="Mechanical & HVAC"
          formulas={[
                        {
              id: 'ventilation',
              title: 'Eq 1 — Breathing Zone Outdoor Airflow',
              description: 'Calculates the breathing zone outdoor airflow based on occupant and floor area components.',
              equation: 'V_{bz} = (R_p \cdot P_z) + (R_a \cdot A_z)',
              variables: [
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'R_p', meaning: 'Outdoor airflow rate required per person' },
                { symbol: 'P_z', meaning: 'Zone population (number of people)' },
                { symbol: 'R_a', meaning: 'Outdoor airflow rate required per unit area' },
                { symbol: 'A_z', meaning: 'Net occupiable zone floor area' }
              ]
            },
            {
              id: 'zone_outdoor_air',
              title: 'Eq 2 — Zone Outdoor Airflow',
              description: 'Calculates the required zone outdoor airflow by applying the zone air distribution effectiveness.',
              equation: 'V_{oz} = \frac{V_{bz}}{E_z}',
              variables: [
                { symbol: 'V_{oz}', meaning: 'Zone outdoor airflow required' },
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'E_z', meaning: 'Zone air distribution effectiveness' }
              ]
            },
            {
              id: 'sensible_heat',
              title: 'Sensible Heat Load (Air)',
              description: 'Calculates the sensible cooling or heating capacity required to change the temperature of the air.',
              equation: 'Q_s = 1.2 \\cdot q_v \\cdot \\Delta T',
              variables: [
                { symbol: 'Q_s', meaning: 'Sensible heat load (W)' },
                { symbol: 'q_v', meaning: 'Air volume flow rate (L/s)' },
                { symbol: '\\Delta T', meaning: 'Temperature difference (°C)' }
              ]
            },
            {
              id: 'darcy_weisbach',
              title: 'Duct Pressure Drop (Darcy-Weisbach)',
              description: 'Calculates frictional pressure loss in ducts and pipes.',
              equation: '\\Delta P = f \\cdot \\frac{L}{D_h} \\cdot \\frac{\\rho V^2}{2}',
              variables: [
                { symbol: '\\Delta P', meaning: 'Pressure loss (Pa)' },
                { symbol: 'f', meaning: 'Friction factor (dimensionless)' },
                { symbol: 'L', meaning: 'Length of duct (m)' },
                { symbol: 'D_h', meaning: 'Hydraulic diameter (m)' },
                { symbol: '\\rho', meaning: 'Density of air (kg/m³)' },
                { symbol: 'V', meaning: 'Air velocity (m/s)' }
              ]
            },
            {
              id: 'continuity',
              title: 'Continuity Equation (Duct Sizing)',
              description: 'Relates air volume flow rate to duct cross-sectional area and velocity.',
              equation: 'q_v = A \\cdot V',
              variables: [
                { symbol: 'q_v', meaning: 'Volume flow rate (m³/s)' },
                { symbol: 'A', meaning: 'Cross-sectional area (m²)' },
                { symbol: 'V', meaning: 'Air velocity (m/s)' }
              ]
            }
          ]}
        />
      ) : subTab === 'ductSizing' ? (
        <DuctSizingCalc restoredParams={restoredParams} onSaveCalculation={onSaveCalculation} autoCalculate={autoCalculate} />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50" />
                <h2 className="text-lg font-bold uppercase tracking-tight text-white">{t('mechCoolingTitle')}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">Configure thermal loads for standard rooms or optimize complete VRF systems.</p>
            </div>

            {/* Sizing Mode Toggle */}
            <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-xl text-[10px] font-bold uppercase w-fit">
              <button
                type="button"
                onClick={() => setIsVrf(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isVrf ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Individual Space Load
              </button>
              <button
                type="button"
                onClick={() => setIsVrf(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isVrf ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Multi-Space VRF System
              </button>
            </div>
          </div>

          {!isVrf ? (
            /* INDIVIDUAL SPACE MODE */
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 google-pro-border-emerald">
                <div className="flex items-center space-x-2 mb-2 border-b border-slate-800 pb-3">
                  <Thermometer className="h-4.5 w-4.5 text-emerald-400" />
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Thermal Inputs</h3>
                </div>

                <div>
                  <TooltipLabel 
                    label={t('estimationBasis')} 
                    tooltip="Estimation basis logic per ASHRAE Fundamentals Chapter 18 (Non-residential Cooling and Heating Load Calculations)."
                    className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider" 
                  />
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setEstimationBasis('area')}
                      className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                        estimationBasis === 'area'
                          ? 'bg-emerald-650 text-white shadow-md shadow-emerald-950/25 border border-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('floorArea')} (m²)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEstimationBasis('volume')}
                      className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                        estimationBasis === 'volume'
                          ? 'bg-emerald-650 text-white shadow-md shadow-emerald-950/25 border border-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t('roomVolume')} (m³)
                    </button>
                  </div>
                </div>
                
                {estimationBasis === 'area' ? (
                  <div>
                    <TooltipLabel 
                      label={`${t('floorArea')} (m²)`}
                      tooltip="Total conditioned floor area. Used to estimate generalized sensible cooling loads (W/m²) per ASHRAE 90.1 standard building types."
                      className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase" 
                    />
                    <input
                      type="number"
                    min="5"
                    max="2000"
                      value={area}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setArea(val);
                        if (typeof val === 'number') {
                          setVolume(val * 3); // standard 3-meter ceiling height conversion
                        }
                      }}
                      placeholder="e.g., 50"
                      className={`w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border ${
                        area !== '' && (Number(area) < 5 || Number(area) > 2000)
                          ? 'border-red-500/70 focus:ring-2 focus:ring-red-500/20 text-red-200'
                          : 'border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                      } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                    />
                    {area !== '' && (Number(area) < 5 || Number(area) > 2000) && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 leading-normal">
                        ⚠️ Safe engineering range: 5 to 2,000 m²
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <TooltipLabel 
                      label={`${t('roomVolume')} (m³)`}
                      tooltip="Room volumetric footprint used for psychrometric air change rates (ACH) and precise infiltration load estimations."
                      className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase" 
                    />
                    <input
                      type="number"
                    min="15"
                    max="6000"
                      value={volume}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setVolume(val);
                        if (typeof val === 'number') {
                          setArea(Number((val / 3).toFixed(1)));
                        }
                      }}
                      placeholder="e.g., 150"
                      className={`w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border ${
                        volume !== '' && (Number(volume) < 15 || Number(volume) > 6000)
                          ? 'border-red-500/70 focus:ring-2 focus:ring-red-500/20 text-red-200'
                          : 'border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                      } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                    />
                    {volume !== '' && (Number(volume) < 15 || Number(volume) > 6000) && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 leading-normal">
                        ⚠️ Safe engineering range: 15 to 6,000 m³
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <TooltipLabel 
                    label={t('occupantDensity')}
                    tooltip="ASHRAE Standard 62.1 dictates breathing zone outdoor air per person. Adjust to calculate precise sensible and latent human loads."
                    className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase" 
                  />
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={occupants}
                    onChange={(e) => setOccupants(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g., 5"
                    className={`w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border ${
                      occupants !== '' && (Number(occupants) < 1 || Number(occupants) > 1000)
                        ? 'border-red-500/70 focus:ring-2 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {occupants !== '' && (Number(occupants) < 1 || Number(occupants) > 1000) && (
                    <p className="text-[10px] text-red-400 font-mono mt-1 leading-normal">
                      ⚠️ Safe engineering range: 1 to 1,000 people
                    </p>
                  )}
                </div>
              </div>

              <motion.div
                key={`${results.tons.toFixed(4)}-${results.btu}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-center space-y-5 relative overflow-hidden google-pro-border-emerald"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t('coolingLoadResult')}</h3>
                  <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase w-fit z-10 relative">
                    <button
                      onClick={() => setChartMode('bar')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        chartMode === 'bar' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Benchmarks
                    </button>
                    <button
                      onClick={() => setChartMode('pie')}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        chartMode === 'pie' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3D Breakdown
                    </button>
                  </div>
                </div>
                
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Calculated Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.calculatedTotal || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Sensible Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.totalSensible || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Latent Load</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round(results.totalLatent || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">W</span></p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Final Design Load</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">{Math.round(results.watts || 0).toLocaleString()} <span className="text-xs font-normal text-emerald-500/50">W (+{safetyFactor}%)</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('btuHr')}</p>
                    <p className="text-xl font-bold text-white mt-1 font-mono">{Math.round(results.btu || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">BTU/h</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Cooling Capacity</p>
                    <p className="text-2xl font-black text-white mt-1 font-mono">{(results.tons || 0).toFixed(2)} <span className="text-xs font-normal text-slate-400">TR</span></p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rec. AC Capacity</p>
                    <p className="text-xl font-bold text-sky-400 mt-1 font-mono">{Math.ceil((results.tons || 0) * 2) / 2} <span className="text-xs font-normal text-sky-500/50">TR</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Outdoor Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{ventilationLps} <span className="text-xs font-normal text-slate-500">L/s</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Req. Supply Air</p>
                    <p className="text-xl font-bold text-slate-200 mt-1 font-mono">{Math.round((results.totalSensible || 0) / 13.31 * 2.11888).toLocaleString()} <span className="text-xs font-normal text-slate-500">CFM</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Est. Electrical Input</p>
                    <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{Math.round((results.watts || 0) / 3.5).toLocaleString()} <span className="text-xs font-normal text-amber-500/50">W (COP 3.5)</span></p>
                  </div>
                </div>


                {results.watts > 0 && (
                  <div className="pt-4 border-t border-slate-800">
                    {chartMode === 'bar' ? (
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="min-w-0 flex-grow">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Load Breakdown</p>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Space Thermal Load', value: Math.round(results.calculatedTotal - (results.peopleSensible + results.peopleLatent)) },
                                { name: 'Occupant Load', value: Math.round(results.peopleSensible + results.peopleLatent) }
                              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={110} />
                                <Tooltip 
                                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                                  formatter={(value) => [`${value} W`, 'Thermal Load']}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                  {
                                    [0,1].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6'][index]} />
                                    ))
                                  }
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-grow">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Efficiency Benchmarks</p>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={[
                                { metric: 'W/m²', current: Math.round(results.watts / (Number(area) || 1)), standard: 150 },
                                { metric: 'W/Person', current: Math.round(results.watts / (Number(occupants) || 1)), standard: 100 },
                                { metric: 'm²/Person', current: Math.round((Number(area) || 1) / (Number(occupants) || 1)), standard: 10 }
                              ]}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 9 }} />
                                <Radar name="Current" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                <Radar name="Standard" dataKey="standard" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div className="h-64 w-full relative -mt-4 mb-2">
                          <Chart
                            chartType="PieChart"
                            data={[
                              ["Category", "Estimated Cooling Capacity"],
                              ['People', results.peopleSensible + results.peopleLatent],
                              ['Lighting', results.lightingSensible],
                              ['Equipment', results.equipmentSensible],
                              ['Envelope', results.wallSensible + results.roofSensible + results.windowCondSensible],
                              ['Solar', results.solarSensible],
                              ['Ventilation', results.ventSensible + results.ventLatent],
                              ['Infiltration', results.infiltrationSensible + results.infiltrationLatent]
                            ]}
                            options={{
                              is3D: true,
                              backgroundColor: 'transparent',
                              legend: 'none',
                              colors: ['#f43f5e', '#facc15', '#818cf8', '#4ade80', '#fb923c', '#38bdf8', '#94a3b8'],
                              pieSliceTextStyle: { color: '#0f172a', fontSize: 11, bold: true },
                              chartArea: { width: '100%', height: '100%' },
                            }}
                            width={"100%"}
                            height={"100%"}
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 mt-[-20px] mb-2 relative z-10">
                           <div className="text-[10px] font-bold uppercase text-sky-400 tracking-wider">Data Series: Estimated Cooling Capacity</div>
                           <div className="flex justify-center flex-wrap gap-4 text-[10px] font-bold uppercase">
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#f43f5e]" /> <span className="text-slate-400">People</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#facc15]" /> <span className="text-slate-400">Lighting</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#818cf8]" /> <span className="text-slate-400">Equipment</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#4ade80]" /> <span className="text-slate-400">Envelope</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#fb923c]" /> <span className="text-slate-400">Solar</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#38bdf8]" /> <span className="text-slate-400">Vent</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#94a3b8]" /> <span className="text-slate-400">Infil</span></div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <div className="text-[10px] font-mono text-slate-500 bg-slate-950/40 p-3 rounded-xl border border-slate-850 w-full flex flex-col gap-2">
                    <span className="text-slate-400 font-bold uppercase">Calculation Reference:</span>
                    <ul className="flex flex-col gap-1.5 list-none">
                      <li className="flex gap-2 items-start">
                        <span className="text-slate-600 shrink-0">•</span>
                        <span>{estimationBasis === 'area' ? '150W/m² area rule-of-thumb' : '50W/m³ volume rule-of-thumb'}</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-slate-600 shrink-0">•</span>
                        <span>100W per person occupant gain</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-slate-600 shrink-0">•</span>
                        <span>COP (Coefficient of Performance) = 3.5 standard</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      if (onSaveCalculation) {
                        const numArea = Number(area) || 0;
                        const numVol = Number(volume) || 0;
                        const numOcc = Number(occupants) || 0;
                        onSaveCalculation({
                          tab: 'mechanical',
                          subType: 'cooling',
                          title: estimationBasis === 'area' ? `Cooling Load (${numArea} m²)` : `Cooling Load (${numVol} m³)`,
                          summary: estimationBasis === 'area' 
                            ? `${numArea} m² | ${numOcc} Occ. | ${results.tons.toFixed(1)} TR`
                            : `${numVol} m³ | ${numOcc} Occ. | ${results.tons.toFixed(1)} TR`,
                          parameters: { 
                            isVrf: false,
                            area: numArea, 
                            volume: numVol, 
                            estimationBasis, 
                            occupants: numOcc 
                          }
                        });
                        triggerToast(t('toastCalculationSaved'));
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{t('saveCalculation')}</span>
                  </button>
                  <button
                    onClick={() => {
                      exportCoolingLoadToCsv({
                        basis: estimationBasis,
                        area: Number(area) || 0,
                        volume: Number(volume) || 0,
                        occupants: Number(occupants) || 0,
                        tons: results.tons,
                        btu: results.btu,
                        watts: results.watts
                      });
                      triggerToast('Cooling load data exported!');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>{t('exportCsv')}</span>
                  </button>
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`CKY_MEPF - Cooling Load Estimate Report`);
                      const body = encodeURIComponent(
                        `Dear Team,\n\nHere is the Cooling Load Estimate Report generated from CKY_MEPF:\n\n` +
                        `- Estimation Basis: ${estimationBasis === 'area' ? 'Floor Area' : 'Room Volume'}\n` +
                        `- Size: ${estimationBasis === 'area' ? area : volume} ${estimationBasis === 'area' ? 'm²' : 'm³'}\n` +
                        `- Occupant Count: ${occupants}\n` +
                        `- Estimated Cooling Capacity: ${results.tons.toFixed(2)} TR (${Math.round(results.btu).toLocaleString()} BTU/hr)\n` +
                        `- Total Power: ${Math.round(results.watts).toLocaleString()} W th\n` +
                        `- Estimated Electrical Input: ${Math.round(results.watts / 3.5).toLocaleString()} W (COP 3.5)\n\n` +
                        `Generated on ${new Date().toLocaleString()}\n` +
                        `Regards,\n` +
                        `Design Team`
                      );
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <Mail className="h-4 w-4 text-sky-400" />
                    <span>{t('shareEmail')}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* MULTI-SPACE VRF/VRV SYSTEM MODE */
            
            <div className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="w-full h-full">
                  
                {/* System Parameters Card */}
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800/80 h-full flex flex-col">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                    <Sliders className="h-4.5 w-4.5 text-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">VRF System Design Settings</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diversity Factor Selector */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400 uppercase">Diversity / Coincidence Factor</span>
                        <span className="font-mono text-emerald-400 font-bold">{diversityFactor.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="1.4"
                        step="0.05"
                        value={diversityFactor}
                        onChange={(e) => setDiversityFactor(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Accounts for non-coincidence of peak loads across multiple zones (Standard: 1.1 - 1.25).
                      </p>
                    </div>

                    {/* Piping & Refrigerant Type */}
                    <div className="space-y-3">
                      <div>
                        <TooltipLabel 
                          label="Refrigerant Chemistry"
                          tooltip="Select refrigerant fluid type to adjust density and global warming potential (GWP) thresholds based on modern compliance standards."
                          className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                        />
                        <div className="grid grid-cols-2 gap-2 p-0.5 bg-slate-950 rounded-lg border border-slate-850 text-[10px] font-bold uppercase">
                          <button
                            type="button"
                            onClick={() => setRefrigerantType('R410A')}
                            className={`py-1 rounded-md transition-all cursor-pointer ${
                              refrigerantType === 'R410A' ? 'bg-emerald-650 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            R-410A
                          </button>
                          <button
                            type="button"
                            onClick={() => setRefrigerantType('R32')}
                            className={`py-1 rounded-md transition-all cursor-pointer ${
                              refrigerantType === 'R32' ? 'bg-emerald-650 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            R-32
                          </button>
                        </div>
                      </div>
                      <div>
                        <TooltipLabel 
                          label="Pipe Material"
                          tooltip="Type of piping material. Determines internal roughness coefficient for pressure drop calculations and refrigerant friction losses."
                          className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                        />
                        <select
                          value={pipeMaterial}
                          onChange={(e) => setPipeMaterial(e.target.value as any)}
                          className="w-full bg-slate-950 text-slate-300 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-800 transition-colors"
                        >
                          <option value="Copper">Copper</option>
                          <option value="Steel">Steel</option>
                          <option value="PVC">PVC</option>
                        </select>
                      </div>
                    </div>
                  </div>

                   <div>
                     <div className="flex justify-between items-center text-xs font-semibold mb-1">
                       <span className="text-slate-400 uppercase">Total Liquid Piping Length (m)</span>
                       <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                         <input
                           id="auto-calc-piping-toggle"
                           type="checkbox"
                           checked={autoCalcPiping}
                           onChange={(e) => setAutoCalcPiping(e.target.checked)}
                           className="w-3 h-3 accent-emerald-500 cursor-pointer"
                         />
                         <label htmlFor="auto-calc-piping-toggle" className="text-[9px] text-emerald-400 font-bold uppercase cursor-pointer select-none">Auto-Calculate from Canvas</label>
                       </div>
                     </div>
                     {autoCalcPiping ? (
                       <div className="w-full bg-slate-950 text-emerald-400 rounded-lg px-3 py-1.5 text-xs font-mono border border-emerald-900/30 flex justify-between items-center">
                         <span>{pipingLength} m (Canvas-driven)</span>
                         <span className="text-[9px] text-slate-500 italic">{customPipesTotal !== null ? `Custom Drawn Pipes: ${customPipesTotal}m` : `Main: ${mainPipingLength}m + Branches: ${vrfRooms.reduce((sum, r) => sum + (r.pipeLength ?? 15), 0)}m`}</span>
                       </div>
                     ) : (
                        <div>
                          <input
                            type="number"
                    min="5"
                    max="1000"
                            value={pipingLength}
                            onChange={(e) => setPipingLength(e.target.value === '' ? '' : Number(e.target.value) as any)}
                            placeholder="e.g., 80"
                            className={`w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                              pipingLength !== '' && (Number(pipingLength) < 5 || Number(pipingLength) > 1000)
                                ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                                : 'border-slate-800 focus:border-emerald-500'
                            } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                          />
                          {pipingLength !== '' && (Number(pipingLength) < 5 || Number(pipingLength) > 1000) && (
                            <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe engineering range: 5 to 1,000 meters</p>
                          )}
                        </div>
                      )}
                     <p className="text-[10px] text-slate-500 mt-1">
                       {autoCalcPiping 
                         ? "Summed up automatically from your main pipe line set and indoor unit branches." 
                         : "Used to approximate required additional pre-commissioning liquid line refrigerant charge."
                       }
                     </p>
                   </div>

                  {/* Outdoor Unit Sizing Control & Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                    {/* ODU Sizing Mode */}
                    <div>
                      <TooltipLabel 
                        label="ODU Sizing Selection"
                        tooltip="Auto-sized logic applies standard diversity factoring. Manual override lets you specify exact HP condensing unit hardware."
                        className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                      />
                      <div className="grid grid-cols-2 gap-2 p-0.5 bg-slate-950 rounded-lg border border-slate-850 text-[10px] font-bold uppercase">
                        <button
                          type="button"
                          onClick={() => setIsOduAuto(true)}
                          className={`py-1 rounded-md transition-all cursor-pointer ${
                            isOduAuto ? 'bg-emerald-650 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Auto Sized
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOduAuto(false)}
                          className={`py-1 rounded-md transition-all cursor-pointer ${
                            !isOduAuto ? 'bg-emerald-650 text-white font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Manual override
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Select whether the system automatically finds the recommended unit size or uses your manual selection.
                      </p>
                    </div>

                    {/* Manual HP Select or Max CR limit selection */}
                    {!isOduAuto ? (
                      <div>
                        <TooltipLabel 
                          label="Manual ODU HP Override"
                          tooltip="Standard industry capacities for variable refrigerant flow condensing units. Overriding may trigger capacity ratio warnings."
                          className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                        />
                        <select
                          value={customOduHp}
                          onChange={(e) => setCustomOduHp(Number(e.target.value))}
                          className="w-full bg-slate-950 text-white rounded-lg px-3 py-1.5 text-xs font-mono border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          {[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60].map(hp => (
                            <option key={hp} value={hp}>{hp} HP ({ (hp * 0.8).toFixed(1) } TR)</option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Forces the design to validate against a specific hardware profile.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-400 uppercase text-[10px]">Max allowed CR limit</span>
                          <span className="font-mono text-emerald-400 font-bold">{maxAllowedCr}%</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="150"
                          step="5"
                          value={maxAllowedCr}
                          onChange={(e) => setMaxAllowedCr(Number(e.target.value))}
                          className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          The absolute maximum allowable ratio of connected IDU to ODU capacity.
                        </p>
                      </div>
                    )}
                  </div>

                  {!isOduAuto && (
                    <div className="pt-3 border-t border-slate-800/40">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400 uppercase text-[10px]">Max allowed CR limit</span>
                        <span className="font-mono text-emerald-400 font-bold">{maxAllowedCr}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="150"
                        step="5"
                        value={maxAllowedCr}
                        onChange={(e) => setMaxAllowedCr(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        The absolute maximum allowable ratio of connected IDU to ODU capacity.
                      </p>
                    </div>
                  )}
                </div>

                
                </div>
                {/* Right Side: VRF System Sizing Output */}
              <div className="w-full h-full">
                <motion.div
                  key={`${vrfResults.totalConnectedTons.toFixed(4)}-${vrfResults.coincidentTons.toFixed(4)}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-center space-y-5 relative overflow-hidden google-pro-border-emerald h-full"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">VRF System Coincidence Sizing</h3>
                  
                  {/* Results Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Total IDU connected</p>
                      <p className="text-2xl font-black text-white mt-1 font-mono">
                        {vrfResults.totalConnectedTons.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-slate-400">TR</span>
                      </p>
                    </div>
                    <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Coincident peak load</p>
                      <p className="text-2xl font-black text-white mt-1 font-mono text-emerald-400">
                        {vrfResults.coincidentTons.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-slate-400">TR</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Recommended ODU Size</p>
                      <p className="text-xl font-black text-white mt-1 font-mono">
                        {vrfResults.oduHP}{' '}
                        <span className="text-xs font-normal text-slate-400">HP</span>
                        <span className="block text-[10px] text-slate-500 font-normal font-sans">({vrfResults.oduTons.toFixed(1)} TR capacity)</span>
                      </p>
                    </div>
                    <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-850/50">
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">Combination Ratio (CR)</p>
                      <p className={`text-xl font-black mt-1 font-mono ${
                        vrfResults.combinationRatio > maxAllowedCr
                          ? 'text-rose-400 font-extrabold animate-pulse'
                          : vrfResults.combinationRatio < 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {vrfResults.combinationRatio.toFixed(1)}{' '}
                        <span className="text-xs font-normal text-slate-400">%</span>
                      </p>
                    </div>
                  </div>

                  {/* Real-time Design Validation & Safety Center */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/60">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        vrfResults.combinationRatio <= maxAllowedCr && !vrfResults.hasCapacityDeficit && !vrfResults.toxicLimitExceeded
                          ? 'bg-emerald-400'
                          : 'bg-rose-400 animate-ping'
                      }`} />
                      VRF Design Validation Center
                    </h4>

                    {/* Sizing Connection Ratio Check Card */}
                    <div className={`p-3 rounded-xl text-[10px] leading-relaxed border transition-all duration-200 ${
                      vrfResults.combinationRatio <= maxAllowedCr && vrfResults.combinationRatio >= 50
                        ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-300'
                        : vrfResults.combinationRatio > maxAllowedCr
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-xs">
                          {vrfResults.combinationRatio <= maxAllowedCr && vrfResults.combinationRatio >= 50 ? '✅' : vrfResults.combinationRatio > maxAllowedCr ? '❌' : '⚠️'}
                        </span>
                        <div>
                          <span className={`font-bold uppercase block mb-0.5 ${
                            vrfResults.combinationRatio <= maxAllowedCr && vrfResults.combinationRatio >= 50 ? 'text-emerald-400' : vrfResults.combinationRatio > maxAllowedCr ? 'text-rose-400 font-extrabold' : 'text-amber-400'
                          }`}>
                            Connection Ratio: {vrfResults.combinationRatio.toFixed(1)}% (Max Allowed: {maxAllowedCr}%)
                          </span>
                          {vrfResults.combinationRatio <= maxAllowedCr && vrfResults.combinationRatio >= 50 ? (
                            <span>Sizing meets manufacturer tolerances. Combination ratio is within safe limits (50% – {maxAllowedCr}%).</span>
                          ) : vrfResults.combinationRatio > maxAllowedCr ? (
                            <span>
                              <strong>CRITICAL EXCEEDED:</strong> Combined indoor unit capacity exceeds the maximum allowable connection ratio of {maxAllowedCr}%. 
                              <span className="block mt-1 text-rose-400 font-medium">To resolve, either increase the outdoor unit capacity, decrease diversity factor, or remove/downsize connected indoor units.</span>
                            </span>
                          ) : (
                            <span>
                              <strong>UNDER-CONNECTED:</strong> Connection ratio is below 50%. The compressor may short-cycle frequently, leading to poor COP efficiency and potential compressor life-cycle wear.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Piping Capacity Loss / Derating Check Card */}
                    {vrfRooms.length > 0 && (
                      <div className={`p-3 rounded-xl text-[10px] leading-relaxed border transition-all duration-200 ${
                        !vrfResults.hasCapacityDeficit
                          ? 'bg-emerald-950/10 border-emerald-500/15 text-emerald-300/90'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-xs">{!vrfResults.hasCapacityDeficit ? '✅' : '❌'}</span>
                          <div>
                            <span className={`font-bold uppercase block mb-0.5 ${!vrfResults.hasCapacityDeficit ? 'text-emerald-400' : 'text-rose-400 font-extrabold'}`}>
                              Piping Derating & Sufficiency
                            </span>
                            {!vrfResults.hasCapacityDeficit ? (
                              <span>
                                Delivered capacity is safe. ODU maintains {vrfResults.deratedOduCapacityTons.toFixed(2)} TR capacity after a {Math.round((1 - vrfResults.deratingFactor) * 100)}% piping loss penalty (Design Peak: {vrfResults.coincidentTons.toFixed(2)} TR).
                              </span>
                            ) : (
                              <span>
                                <strong>CAPACITY PENALTY DEFICIT:</strong> Due to a {pipingLength}m long piping length, a {Math.round((1 - vrfResults.deratingFactor) * 100)}% friction/suction drop capacity loss occurred. 
                                Actual delivered capacity is only {vrfResults.deratedOduCapacityTons.toFixed(2)} TR, failing to satisfy the {vrfResults.coincidentTons.toFixed(2)} TR peak target.
                                <span className="block mt-1 text-rose-400 font-medium">To resolve, upgrade outdoor unit capacity or shorten piping lines.</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Safety limit concentration check (ASHRAE 15 / ISO 5149) Card */}
                    {vrfRooms.length > 0 && (
                      <div className={`p-3 rounded-xl text-[10px] leading-relaxed border transition-all duration-200 ${
                        !vrfResults.toxicLimitExceeded
                          ? 'bg-emerald-950/10 border-emerald-500/15 text-emerald-300/90'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-xs">{!vrfResults.toxicLimitExceeded ? '✅' : '⚠️'}</span>
                          <div>
                            <span className={`font-bold uppercase block mb-0.5 ${!vrfResults.toxicLimitExceeded ? 'text-emerald-400' : 'text-rose-400 font-extrabold'}`}>
                              ASHRAE 15 / ISO 5149 Safety
                            </span>
                            {!vrfResults.toxicLimitExceeded ? (
                              <span>
                                Pass. A leak into the smallest room ({vrfResults.smallestRoomName}) produces a concentration of {vrfResults.toxicConcentration.toFixed(3)} kg/m³ (limit: {refrigerantType === 'R32' ? '0.30' : '0.44'} kg/m³).
                              </span>
                            ) : (
                              <span>
                                <strong>REFRIGERANT SAFETY WARNING:</strong> Smallest volume room ({vrfResults.smallestRoomName}, {vrfResults.smallestRoomVol} m³) faces toxic/flammable concentration risk of {vrfResults.toxicConcentration.toFixed(3)} kg/m³ if a complete system rupture happens. Limit is {refrigerantType === 'R32' ? '0.30' : '0.44'} kg/m³.
                                <span className="block mt-1 text-rose-400 font-medium">To resolve: Break into separate circuits or increase room volume.</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Piping & Additional Charge Estimate */}
                  <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850 text-[10px] space-y-1.5 text-slate-300">
                    <span className="font-bold uppercase text-slate-400 block">Refrigerant Additional Charge:</span>
                    <div className="flex justify-between">
                      <span>Chemistry Model:</span>
                      <span className="font-mono text-emerald-400 font-bold">{refrigerantType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base unit pre-charged limit:</span>
                      <span className="text-slate-400">Depends on pipe lines length</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800/40 pt-1.5 font-bold">
                      <span className="text-white">Est. Additional Charge:</span>
                      <span className="font-mono text-sky-400 text-xs">{vrfResults.additionalCharge.toFixed(2)} kg</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (onSaveCalculation) {
                          onSaveCalculation({
                            tab: 'mechanical',
                            subType: 'cooling',
                            title: `VRF System (${vrfRooms.length} Zones)`,
                            summary: `${vrfRooms.length} Zones | ${vrfResults.totalConnectedTons.toFixed(1)} TR | Rec: ${vrfResults.oduHP} HP`,
                            parameters: {
                              isVrf: true,
                              vrfRooms,
                              diversityFactor,
                              pipingLength,
                              mainPipingLength,
                              autoCalcPiping,
                              refrigerantType,
                              pipeMaterial,
                              isOduAuto,
                              customOduHp,
                              maxAllowedCr,
                              // Fallback support
                              area: 120,
                              volume: 360,
                              estimationBasis,
                              occupants: vrfResults.totalOccupants
                            }
                          });
                          triggerToast('VRF system configuration saved!');
                        }
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>{t('saveCalculation')}</span>
                    </button>
                    <button
                      onClick={() => {
                        exportVrfToCsv({
                          rooms: vrfRooms.map(r => ({ name: r.name, size: r.size, basis: r.basis, occupants: r.occupants, tons: r.tons })),
                          diversityFactor,
                          totalConnectedTons: vrfResults.totalConnectedTons,
                          coincidentTons: vrfResults.coincidentTons,
                          oduSizeHp: vrfResults.oduHP,
                          oduSizeTons: vrfResults.oduTons,
                          combinationRatio: vrfResults.combinationRatio,
                          pipingLength,
                          refrigerantCharge: vrfResults.additionalCharge
                        });
                        triggerToast('VRF calculation exported to CSV!');
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                      <span>{t('exportCsv')}</span>
                    </button>
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent(`CKY_MEPF - Multi-Zone VRF System Sizing Report`);
                        const body = encodeURIComponent(
                          `Dear Team,\n\nHere is the Multi-Zone VRF/VRV Sizing Report generated from CKY_MEPF:\n\n` +
                          `- Total Connected Zones: ${vrfRooms.length}\n` +
                          `- Total Connected IDU Capacity: ${vrfResults.totalConnectedTons.toFixed(2)} TR\n` +
                          `- Diversity / Coincidence Factor: ${diversityFactor}x\n` +
                          `- Coincident Design Peak ODU Load: ${vrfResults.coincidentTons.toFixed(2)} TR\n` +
                          `- Recommended VRF Outdoor Unit: ${vrfResults.oduHP} HP (${vrfResults.oduTons.toFixed(1)} TR capacity)\n` +
                          `- Sizing Connection Ratio: ${vrfResults.combinationRatio.toFixed(1)}%\n` +
                          `- Liquid Line Piping: ${pipingLength} meters\n` +
                          `- Est. Additional Charge: ${vrfResults.additionalCharge.toFixed(2)} kg (${refrigerantType})\n\n` +
                          `Generated on ${new Date().toLocaleString()}\n` +
                          `Regards,\n` +
                          `Engineering Team`
                        );
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-sky-400" />
                      <span>{t('shareEmail')}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
              </div>
              
              <div className="w-full">
                {/* 2D System Topology Canvas */}
                <VrfTopologyCanvas isDarkMode={isDarkMode} 
                  vrfRooms={vrfRooms}
                  setVrfRooms={setVrfRooms}
                  vrfResults={vrfResults}
                  maxAllowedCr={maxAllowedCr}
                  diversityFactor={diversityFactor}
                  refrigerantType={refrigerantType}
                  pipeMaterial={pipeMaterial}
                  pipingLength={pipingLength}
                  mainPipingLength={mainPipingLength}
                  setMainPipingLength={setMainPipingLength}
                  calcRoomTonsAndWatts={calcRoomTonsAndWatts}
                  onCustomPipesChange={setCustomPipesTotal}
                  triggerToast={triggerToast}
                />

                
              </div>

              <div className="w-full">
                {/* Zones / Indoor Units Sizing Table */}
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800/80">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Wind className="h-4.5 w-4.5 text-emerald-400" />
                      <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Connected Indoor Units ({vrfRooms.length})</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-950/40 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold font-mono">
                      Sum IDU: {vrfResults.totalConnectedTons.toFixed(2)} TR
                    </span>
                  </div>

                  {/* Zones Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/40 max-h-[220px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="p-3">Space/Zone Name</th>
                          <th className="p-3">Basis / Sizing</th>
                          <th className="p-3 text-center">Occupants</th>
                          <th className="p-3 text-center">Branch Pipe (m)</th>
                          <th className="p-3 text-right">Est. Load (TR)</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50">
                        {vrfRooms.map((room, index) => (
                          <tr key={room.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="p-3 font-semibold text-white truncate max-w-[140px]">{room.name}</td>
                            <td className="p-3 font-mono text-slate-400">
                              {room.basis === 'area' ? `${room.size} m²` : `${room.size} m³`}
                            </td>
                            <td className="p-3 text-center font-mono text-slate-400">{room.occupants}</td>
                            <td className="p-3 text-center">
                              <input
                                type="number"
                                min="1"
                                value={room.pipeLength ?? 15}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const updatedLength = val > 0 ? val : 1;
                                  setVrfRooms(vrfRooms.map(r => r.id === room.id ? { ...r, pipeLength: updatedLength } : r));
                                }}
                                className="w-14 bg-slate-950 text-sky-400 border border-slate-800 rounded px-1.5 py-0.5 text-center font-mono text-xs focus:outline-none focus:border-emerald-500 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                              />
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-400">
                              {room.tons.toFixed(2)} TR
                            </td>
                            <td className="p-3 text-center flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (index === 0) return;
                                  const newRooms = [...vrfRooms];
                                  [newRooms[index - 1], newRooms[index]] = [newRooms[index], newRooms[index - 1]];
                                  setVrfRooms(newRooms);
                                }}
                                disabled={index === 0}
                                className="text-slate-500 hover:text-sky-400 p-1 rounded-lg hover:bg-sky-950/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                title="Move Up in Sequence"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (index === vrfRooms.length - 1) return;
                                  const newRooms = [...vrfRooms];
                                  [newRooms[index + 1], newRooms[index]] = [newRooms[index], newRooms[index + 1]];
                                  setVrfRooms(newRooms);
                                }}
                                disabled={index === vrfRooms.length - 1}
                                className="text-slate-500 hover:text-sky-400 p-1 rounded-lg hover:bg-sky-950/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                title="Move Down in Sequence"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setVrfRooms(vrfRooms.filter((r) => r.id !== room.id));
                                  triggerToast(`Removed "${room.name}" zone.`);
                                }}
                                className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {vrfRooms.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                              No zones defined. Add indoor unit zones using the builder form below.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Zone Interactive Builder Row */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850 space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Add Custom Indoor Unit Zone</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="e.g., Conference Rm"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                      
                      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-bold uppercase gap-1">
                        <button
                          type="button"
                          onClick={() => setNewRoomBasis('area')}
                          className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                            newRoomBasis === 'area' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Area (m²)
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewRoomBasis('volume')}
                          className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                            newRoomBasis === 'volume' ? 'bg-emerald-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Vol (m³)
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                    min="5"
                    max="2000"
                          placeholder={newRoomBasis === 'area' ? "Area (m²)" : "Volume (m³)"}
                          value={newRoomSize}
                          onChange={(e) => setNewRoomSize(e.target.value === '' ? '' : Number(e.target.value))}
                          className={`w-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                            newRoomSize !== '' && (
                              newRoomBasis === 'area' 
                                ? (Number(newRoomSize) < 5 || Number(newRoomSize) > 2000)
                                : (Number(newRoomSize) < 15 || Number(newRoomSize) > 6000)
                            )
                              ? 'border-red-500/70 text-red-200'
                              : 'border-slate-800 focus:border-emerald-500'
                          } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                        />
                        {newRoomSize !== '' && (
                          newRoomBasis === 'area' 
                            ? (Number(newRoomSize) < 5 || Number(newRoomSize) > 2000)
                            : (Number(newRoomSize) < 15 || Number(newRoomSize) > 6000)
                        ) && (
                          <p className="absolute left-0 top-full text-[8px] text-red-400 font-mono mt-0.5 whitespace-nowrap z-10 bg-slate-950 px-1.5 py-0.5 rounded border border-red-500/20">
                            ⚠️ Out of bounds ({newRoomBasis === 'area' ? '5-2000 m²' : '15-6000 m³'})
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                    min="0"
                    max="1000"
                          placeholder="People"
                          value={newRoomOccupants}
                          onChange={(e) => setNewRoomOccupants(e.target.value === '' ? '' : Number(e.target.value))}
                          className={`w-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                            newRoomOccupants !== '' && (Number(newRoomOccupants) < 0 || Number(newRoomOccupants) > 1000)
                              ? 'border-red-500/70 text-red-200'
                              : 'border-slate-800 focus:border-emerald-500'
                          } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                        />
                        {newRoomOccupants !== '' && (Number(newRoomOccupants) < 0 || Number(newRoomOccupants) > 1000) && (
                          <p className="absolute left-0 top-full text-[8px] text-red-400 font-mono mt-0.5 whitespace-nowrap z-10 bg-slate-950 px-1.5 py-0.5 rounded border border-red-500/20">
                            ⚠️ Out of bounds (0-1000)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const name = newRoomName.trim() || `Zone ${vrfRooms.length + 1}`;
                          const size = Number(newRoomSize) || 0;
                          const occupantsCount = Number(newRoomOccupants) || 0;
                          
                          if (size <= 0) {
                            triggerToast("Please enter a valid space size");
                            return;
                          }
                          
                          const newId = String(Date.now());
                          const newRoom = {
                            id: newId,
                            name,
                            basis: newRoomBasis,
                            size,
                            occupants: occupantsCount,
                            pipeLength: 15,
                            ...calcRoomTonsAndWatts(newRoomBasis, size, occupantsCount)
                          };
                          
                          setVrfRooms([...vrfRooms, newRoom]);
                          setNewRoomName('');
                          setNewRoomSize('');
                          setNewRoomOccupants('');
                          triggerToast(`Zone "${name}" added successfully!`);
                        }}
                        className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-all duration-150 active:scale-95 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Zone to System</span>
                      </button>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          )}

          {/* Interactive Trend Chart Section */}
          <TrendVisualizer 
            type="cooling" 
            currentParams={{
              isVrf: isVrf,
              area: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'area' ? r.size : r.size / 3), 0)) : area,
              volume: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'volume' ? r.size : r.size * 3), 0)) : volume,
              estimationBasis: isVrf ? 'area' : estimationBasis,
              occupants: isVrf ? vrfRooms.reduce((acc, r) => acc + r.occupants, 0) : occupants,
              calculatedWatts: isVrf ? vrfResults.totalConnectedWatts : results.watts,
              results: results
            }} 
          />
        </div>
      )}
    </div>
  );
}
