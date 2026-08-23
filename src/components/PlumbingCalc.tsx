/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Droplet, AlertTriangle, CheckCircle2, Compass, Bookmark, 
  Trash2, Layers, ShieldCheck, Activity, Info, HelpCircle, FileSpreadsheet, Mail
} from 'lucide-react';
import { motion } from 'motion/react';
import TrendVisualizer from './TrendVisualizer';
import TooltipLabel from './TooltipLabel';
import { useLanguage } from '../lib/translations';
import { exportPlumbingToCsv } from '../lib/exportCsv';
import FormulaVisualizer from './FormulaVisualizer';

type SubTab = 'fixtures' | 'tanks' | 'pumps' | 'formulas';

interface PlumbingCalcProps {
  restoredParams?: any;
  onSaveCalculation?: any;
  autoCalculate?: boolean;
}

interface FixtureRow {
  id: string;
  name: string;
  wsfu: number; // Water Supply Fixture Unit (IPC)
  dfu: number;  // Drainage Fixture Unit (IPC)
  lu: number;   // Loading Unit (BS 8558 / BS EN 806)
  du: number;   // Discharge Unit (BS EN 12056)
  qty: number;
}

export default function PlumbingCalc({ restoredParams, onSaveCalculation, autoCalculate = true }: PlumbingCalcProps) {
  const { t } = useLanguage();
  const [subTab, setSubTab] = useState<SubTab>('fixtures');
  const [standard, setStandard] = useState<'ipc' | 'bs'>('ipc');
  
  // TOAST state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State 1: Fixtures
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc', name: 'Water Closet (Toilet)', wsfu: 10, dfu: 6, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'lav', name: 'Lavatory Sink (Bathroom)', wsfu: 1.5, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'shower', name: 'Shower Head (Domestic)', wsfu: 2, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'sink', name: 'Kitchen Sink', wsfu: 2.5, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal', name: 'Urinal (Flushometer/Bowl)', wsfu: 5, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
  ]);

  const [systemType, setSystemType] = useState<'valve' | 'tank'>('valve'); // IPC Curve style
  const [designVelocity, setDesignVelocity] = useState<number>(1.2); // m/s
  const [slope, setSlope] = useState<number>(2); // %, standard slopes are 1%, 2%, 4%

  // State 2: Tanks Sizing
  const [occupants, setOccupants] = useState<number>(120);
  const [consumptionRate, setConsumptionRate] = useState<number>(120); // Liters per person per day (Typical standard)
  const [storageDays, setStorageDays] = useState<number>(2); // Sizing buffer days
  
  const [septicDischarge, setSepticDischarge] = useState<number>(80); // L/person/day
  const [septicDesludgeInterval, setSepticDesludgeInterval] = useState<number>(3); // years
  const [sumpInflow, setSumpInflow] = useState<number>(150); // Liters/min peak storm/waste flow
  
  // State 3: Pumps Sizing
  const [boosterStaticHead, setBoosterStaticHead] = useState<number>(35); // meters (height of building)
  const [boosterResidualPress, setBoosterResidualPress] = useState<number>(2.0); // bar at remote fixture (IPC minimum)
  const [boosterFrictionPercent, setBoosterFrictionPercent] = useState<number>(15); // % of height
  const [boosterEfficiency, setBoosterEfficiency] = useState<number>(68); // %
  
  const [transferFillTime, setTransferFillTime] = useState<number>(90); // minutes to fill roof tank
  const [transferStaticHead, setTransferStaticHead] = useState<number>(45); // meters total vertical lift
  
  const [sumpStaticHead, setSumpStaticHead] = useState<number>(6); // meters sump to gravity sewer line

  const [loadedHistoryId, setLoadedHistoryId] = useState<string | null>(null);

  // Decoupled applied states
  const [appliedStandard, setAppliedStandard] = useState<'ipc' | 'bs'>('ipc');
  const [appliedFixtures, setAppliedFixtures] = useState<FixtureRow[]>(fixtures);
  const [appliedSystemType, setAppliedSystemType] = useState<'valve' | 'tank'>('valve');
  const [appliedDesignVelocity, setAppliedDesignVelocity] = useState<number>(1.2);
  const [appliedSlope, setAppliedSlope] = useState<number>(2);
  const [appliedOccupants, setAppliedOccupants] = useState<number>(120);
  const [appliedConsumptionRate, setAppliedConsumptionRate] = useState<number>(120);
  const [appliedStorageDays, setAppliedStorageDays] = useState<number>(2);
  const [appliedSepticDischarge, setAppliedSepticDischarge] = useState<number>(80);
  const [appliedSepticDesludgeInterval, setAppliedSepticDesludgeInterval] = useState<number>(3);
  const [appliedSumpInflow, setAppliedSumpInflow] = useState<number>(150);
  const [appliedBoosterStaticHead, setAppliedBoosterStaticHead] = useState<number>(35);
  const [appliedBoosterResidualPress, setAppliedBoosterResidualPress] = useState<number>(2.0);
  const [appliedBoosterFrictionPercent, setAppliedBoosterFrictionPercent] = useState<number>(15);
  const [appliedBoosterEfficiency, setAppliedBoosterEfficiency] = useState<number>(68);
  const [appliedTransferFillTime, setAppliedTransferFillTime] = useState<number>(90);
  const [appliedTransferStaticHead, setAppliedTransferStaticHead] = useState<number>(45);
  const [appliedSumpStaticHead, setAppliedSumpStaticHead] = useState<number>(6);

  // Sync state automatically when autoCalculate is true
  useEffect(() => {
    if (autoCalculate) {
      setAppliedStandard(standard);
      setAppliedFixtures(fixtures);
      setAppliedSystemType(systemType);
      setAppliedDesignVelocity(designVelocity);
      setAppliedSlope(slope);
      setAppliedOccupants(occupants);
      setAppliedConsumptionRate(consumptionRate);
      setAppliedStorageDays(storageDays);
      setAppliedSepticDischarge(septicDischarge);
      setAppliedSepticDesludgeInterval(septicDesludgeInterval);
      setAppliedSumpInflow(sumpInflow);
      setAppliedBoosterStaticHead(boosterStaticHead);
      setAppliedBoosterResidualPress(boosterResidualPress);
      setAppliedBoosterFrictionPercent(boosterFrictionPercent);
      setAppliedBoosterEfficiency(boosterEfficiency);
      setAppliedTransferFillTime(transferFillTime);
      setAppliedTransferStaticHead(transferStaticHead);
      setAppliedSumpStaticHead(sumpStaticHead);
    }
  }, [
    autoCalculate, standard, fixtures, systemType, designVelocity, slope, occupants,
    consumptionRate, storageDays, septicDischarge, septicDesludgeInterval, sumpInflow,
    boosterStaticHead, boosterResidualPress, boosterFrictionPercent, boosterEfficiency,
    transferFillTime, transferStaticHead, sumpStaticHead
  ]);

  // Load state from parameters history
  useEffect(() => {
    if (restoredParams && restoredParams.tab === 'plumbing' && restoredParams.id !== loadedHistoryId) {
      setLoadedHistoryId(restoredParams.id);
      const p = restoredParams.parameters;
      if (p) {
        if (p.subTab) setSubTab(p.subTab as SubTab);
        if (p.standard) { setStandard(p.standard); setAppliedStandard(p.standard); }
        if (Array.isArray(p.fixtures)) { setFixtures(p.fixtures); setAppliedFixtures(p.fixtures); }
        if (p.systemType) { setSystemType(p.systemType); setAppliedSystemType(p.systemType); }
        if (p.designVelocity) { setDesignVelocity(p.designVelocity); setAppliedDesignVelocity(p.designVelocity); }
        if (p.slope) { setSlope(p.slope); setAppliedSlope(p.slope); }
        if (p.occupants) { setOccupants(p.occupants); setAppliedOccupants(p.occupants); }
        if (p.consumptionRate) { setConsumptionRate(p.consumptionRate); setAppliedConsumptionRate(p.consumptionRate); }
        if (p.storageDays) { setStorageDays(p.storageDays); setAppliedStorageDays(p.storageDays); }
        if (p.septicDischarge) { setSepticDischarge(p.septicDischarge); setAppliedSepticDischarge(p.septicDischarge); }
        if (p.septicDesludgeInterval) { setSepticDesludgeInterval(p.septicDesludgeInterval); setAppliedSepticDesludgeInterval(p.septicDesludgeInterval); }
        if (p.sumpInflow) { setSumpInflow(p.sumpInflow); setAppliedSumpInflow(p.sumpInflow); }
        if (p.boosterStaticHead) { setBoosterStaticHead(p.boosterStaticHead); setAppliedBoosterStaticHead(p.boosterStaticHead); }
        if (p.boosterResidualPress) { setBoosterResidualPress(p.boosterResidualPress); setAppliedBoosterResidualPress(p.boosterResidualPress); }
        if (p.boosterFrictionPercent) { setBoosterFrictionPercent(p.boosterFrictionPercent); setAppliedBoosterFrictionPercent(p.boosterFrictionPercent); }
        if (p.boosterEfficiency) { setBoosterEfficiency(p.boosterEfficiency); setAppliedBoosterEfficiency(p.boosterEfficiency); }
        if (p.transferFillTime) { setTransferFillTime(p.transferFillTime); setAppliedTransferFillTime(p.transferFillTime); }
        if (p.transferStaticHead) { setTransferStaticHead(p.transferStaticHead); setAppliedTransferStaticHead(p.transferStaticHead); }
        if (p.sumpStaticHead) { setSumpStaticHead(p.sumpStaticHead); setAppliedSumpStaticHead(p.sumpStaticHead); }
        
        triggerToast('Plumbing parameters loaded!');
      }
    }
  }, [restoredParams, loadedHistoryId]);

  // Fixture helpers
  const handleQtyChange = (id: string, value: number) => {
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, qty: Math.max(0, value) } : f));
  };

  const hasPendingChanges = !autoCalculate && (
    standard !== appliedStandard ||
    JSON.stringify(fixtures) !== JSON.stringify(appliedFixtures) ||
    systemType !== appliedSystemType ||
    designVelocity !== appliedDesignVelocity ||
    slope !== appliedSlope ||
    occupants !== appliedOccupants ||
    consumptionRate !== appliedConsumptionRate ||
    storageDays !== appliedStorageDays ||
    septicDischarge !== appliedSepticDischarge ||
    septicDesludgeInterval !== appliedSepticDesludgeInterval ||
    sumpInflow !== appliedSumpInflow ||
    boosterStaticHead !== appliedBoosterStaticHead ||
    boosterResidualPress !== appliedBoosterResidualPress ||
    boosterFrictionPercent !== appliedBoosterFrictionPercent ||
    boosterEfficiency !== appliedBoosterEfficiency ||
    transferFillTime !== appliedTransferFillTime ||
    transferStaticHead !== appliedTransferStaticHead ||
    sumpStaticHead !== appliedSumpStaticHead
  );

  const handleApplyCalculations = () => {
    setAppliedStandard(standard);
    setAppliedFixtures(fixtures);
    setAppliedSystemType(systemType);
    setAppliedDesignVelocity(designVelocity);
    setAppliedSlope(slope);
    setAppliedOccupants(occupants);
    setAppliedConsumptionRate(consumptionRate);
    setAppliedStorageDays(storageDays);
    setAppliedSepticDischarge(septicDischarge);
    setAppliedSepticDesludgeInterval(septicDesludgeInterval);
    setAppliedSumpInflow(sumpInflow);
    setAppliedBoosterStaticHead(boosterStaticHead);
    setAppliedBoosterResidualPress(boosterResidualPress);
    setAppliedBoosterFrictionPercent(boosterFrictionPercent);
    setAppliedBoosterEfficiency(boosterEfficiency);
    setAppliedTransferFillTime(transferFillTime);
    setAppliedTransferStaticHead(transferStaticHead);
    setAppliedSumpStaticHead(sumpStaticHead);
    triggerToast('Calculations updated!');
  };

  // Calculations
  const totalWSFU = appliedFixtures.reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
  const totalDFU = appliedFixtures.reduce((sum, f) => sum + (f.dfu * f.qty), 0);
  
  // BS 8558 Loading Units and BS EN 12056 Discharge Units
  const totalLU = appliedFixtures.reduce((sum, f) => sum + (f.lu * f.qty), 0);
  const totalDU = appliedFixtures.reduce((sum, f) => sum + (f.du * f.qty), 0);

  // Hunter's Curve Peak Demand Estimation (GPM)
  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    if (type === 'valve') {
      // Commercial Flushometer Valve Curve
      if (wsfu <= 5) return 10 + (2.5 * wsfu);
      if (wsfu <= 20) return 22 + (1.2 * (wsfu - 5));
      if (wsfu <= 100) return 40 + (0.45 * (wsfu - 20));
      return 76 + (0.22 * (wsfu - 100));
    } else {
      // Residential Flush Tank Curve
      if (wsfu <= 5) return 1.5 * wsfu;
      if (wsfu <= 20) return 5 + (0.8 * (wsfu - 5));
      if (wsfu <= 100) return 17 + (0.35 * (wsfu - 20));
      return 45 + (0.18 * (wsfu - 100));
    }
  };

  // Peak water supply flow rate calculation
  const peakFlowLps = appliedStandard === 'bs' 
    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0) // BS EN 806-3 loading units formula
    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309); // Hunter's curve converted to L/s
  const peakFlowGPM = peakFlowLps / 0.06309;

  // Pipe Sizing Logic
  const calcDiameter = (flowLps: number, velocityMs: number) => {
    if (flowLps <= 0 || velocityMs <= 0) return 0;
    const q_m3s = flowLps / 1000;
    // Area = Q / V
    const area = q_m3s / velocityMs;
    // D = sqrt(4 * A / pi)
    const d_m = Math.sqrt((4 * area) / Math.PI);
    return d_m * 1000; // to mm
  };

  const calculatedWaterPipeDia = calcDiameter(peakFlowLps, appliedDesignVelocity);

  const getNominalPipeSize = (diaMm: number) => {
    if (diaMm <= 0) return 'N/A';
    const sizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 150, 200];
    const match = sizes.find(s => s >= diaMm);
    return match ? `${match} mm (DN${match})` : 'DN250+';
  };

  const recommendedWaterPipe = getNominalPipeSize(calculatedWaterPipeDia);

  // Sewage Pipe size based on IPC Table 710.1(1) and slope
  const getSewagePipeSize = (dfu: number, slopePercent: number) => {
    if (dfu <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // Light Loads
    if (dfu <= 3) return { size: 'DN40 (1.5")', reason: 'IPC Table 710.1 compliant (Branch size limit)' };
    if (dfu <= 6) return { size: 'DN50 (2")', reason: 'IPC Table 710.1 compliant' };
    if (dfu <= 20) return { size: 'DN75 (3")', reason: 'IPC Table 710.1 compliant (Minimum size for WCs)' };
    
    // High Loads depending on slope
    if (slopePercent === 0.5) {
      if (dfu <= 180) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 0.5% slope' };
      if (dfu <= 700) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 0.5% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else if (slopePercent === 1) {
      if (dfu <= 160) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 1% slope' };
      if (dfu <= 960) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 1% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else if (slopePercent === 2) {
      if (dfu <= 216) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 2% slope' };
      if (dfu <= 1400) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 2% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    } else { // 4% slope
      if (dfu <= 250) return { size: 'DN100 (4")', reason: 'IPC Table 710.1 at 4% slope' };
      if (dfu <= 2200) return { size: 'DN150 (6")', reason: 'IPC Table 710.1 at 4% slope' };
      return { size: 'DN200 (8")', reason: 'High capacity drainage standard' };
    }
  };

  // BS EN 12056: Gravity drainage systems inside buildings Sizing
  const getBSSewagePipeSize = (du: number, slopePercent: number) => {
    if (du <= 0) return { size: 'N/A', reason: 'No drainage load' };
    
    // BS EN 12056 Peak wastewater flow: Q = K * sqrt(Sum DU)
    // K = 0.7 for standard commercial/public buildings
    const peakDrainageFlow = 0.7 * Math.sqrt(du);
    
    // Minimum diameter for branches serving any WC is DN100 according to BS standards
    if (du <= 4) {
      return { 
        size: 'DN75 (3")', 
        reason: `BS EN 12056 compliant (Light waste branch. Peak: ${peakDrainageFlow.toFixed(2)} L/s)` 
      };
    }
    
    // Capacity limits based on slope and standard drainage tables
    if (slopePercent === 0.5) { // 1:200
      if (peakDrainageFlow <= 3.0) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 10.0) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:200 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else if (slopePercent === 1) { // 1:100
      if (peakDrainageFlow <= 4.2) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 14.5) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:100 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    } else { // 2% and above (1:50)
      if (peakDrainageFlow <= 5.8) return { size: 'DN100 (4")', reason: `BS EN 12056 compliant at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      if (peakDrainageFlow <= 18.0) return { size: 'DN150 (6")', reason: `BS EN 12056 compliant at 1:50 slope (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
      return { size: 'DN200 (8")', reason: `BS EN 12056 high load capacity (Peak: ${peakDrainageFlow.toFixed(2)} L/s)` };
    }
  };

  const sewagePipe = appliedStandard === 'bs' 
    ? getBSSewagePipeSize(totalDU, appliedSlope) 
    : getSewagePipeSize(totalDFU, appliedSlope);

  // Water Tank calculations
  const totalWaterStorageLiters = appliedOccupants * appliedConsumptionRate * appliedStorageDays;
  const totalWaterStorageM3 = totalWaterStorageLiters / 1000;
  
  // Standard building setup divides water into Underground Reservoir (2/3) and Roof Elevated Tank (1/3)
  const ugTankVolume = totalWaterStorageM3 * (2/3);
  const roofTankVolume = totalWaterStorageM3 * (1/3);

  // Septic tank capacity calculation (IPC/EPA guidelines)
  // Liquid Volume (L) = Daily Sewage Discharge = Occupants * SepticDischarge * RetentionTime (usually 1.5 days)
  const septicDailyFlow = appliedOccupants * appliedSepticDischarge;
  const septicLiquidVol = septicDailyFlow * 1.5; // Liters
  
  // Sludge accumulation = Occupants * Sludge Accumulation Rate (30L/year) * Desludging interval (years)
  const septicSludgeVol = appliedOccupants * 30 * appliedSepticDesludgeInterval;
  const totalSepticVolumeLiters = septicLiquidVol + septicSludgeVol;
  const totalSepticVolumeM3 = totalSepticVolumeLiters / 1000;

  // Submersible Sump Tank sizing
  // Buffer capacity of 15-30 minutes of peak drainage flow inflow
  const sumpVolumeLiters = appliedSumpInflow * 20; // 20 minutes storage
  const sumpVolumeM3 = sumpVolumeLiters / 1000;

  // Pumps Sizing
  // 1. Booster Pump (Flow is Hunter's Peak Demand, Head = Static Head + Friction Loss + Residual Pressure requirement)
  // Convert residual pressure in bar to meters of head: 1 bar ≈ 10.197 meters
  const boosterHeadMeters = appliedBoosterStaticHead + (appliedBoosterStaticHead * (appliedBoosterFrictionPercent / 100)) + (appliedBoosterResidualPress * 10.197);
  const boosterFlowLpm = peakFlowLps * 60; // L/s to L/min
  // Hydraulic power (kW) = Flow(m3/s) * density(1000) * g(9.81) * Head(m) / 1000
  const boosterHydraulicPower = (peakFlowLps * 9.81 * boosterHeadMeters) / 1000; // kW
  const boosterShaftPower = boosterHydraulicPower / (appliedBoosterEfficiency / 100); // kW
  const boosterHP = boosterShaftPower * 1.341; // kW to HP

  // 2. Transfer Pump (Ground Tank to Roof Tank)
  // Capacity: roof tank size filled in target time
  const transferFlowLpm = (roofTankVolume * 1000) / appliedTransferFillTime;
  const transferFlowLps = transferFlowLpm / 60;
  const transferHeadMeters = appliedTransferStaticHead * 1.15; // 15% estimated friction loss
  const transferHydraulicPower = (transferFlowLps * 9.81 * transferHeadMeters) / 1000;
  const transferHP = (transferHydraulicPower / 0.65) * 1.341; // Assuming standard 65% efficiency

  // 3. Submersible Sump Pump
  // Standard sizing is 1.2x peak inflow rate
  const sumpFlowLpm = appliedSumpInflow * 1.2;
  const sumpFlowLps = sumpFlowLpm / 60;
  const sumpHeadMeters = appliedSumpStaticHead * 1.2; // 20% friction
  const sumpHydraulicPower = (sumpFlowLps * 9.81 * sumpHeadMeters) / 1000;
  const sumpHP = (sumpHydraulicPower / 0.55) * 1.341; // Sump pump efficiency average 55%

  // Recommended Pump-to-Service Main Pipe Sizing (Suction @ 1.2 m/s, Discharge/Service @ 1.8 m/s)
  const boosterSuctionPipe = getNominalPipeSize(calcDiameter(peakFlowLps, 1.2));
  const boosterDischargePipe = getNominalPipeSize(calcDiameter(peakFlowLps, 1.8));

  const transferSuctionPipe = getNominalPipeSize(calcDiameter(transferFlowLps, 1.2));
  const transferDischargePipe = getNominalPipeSize(calcDiameter(transferFlowLps, 1.8));

  const sumpDischargePipe = getNominalPipeSize(calcDiameter(sumpFlowLps, 1.8));

  const handleSave = () => {
    if (onSaveCalculation) {
      let title = '';
      let summary = '';
      let parameters: any = { subTab, standard };
 
      if (subTab === 'fixtures') {
        title = standard === 'bs' 
          ? `BS Pipe Sizing (${totalLU} LU)` 
          : `IPC Pipe Sizing (${totalWSFU} WSFU)`;
        summary = standard === 'bs'
          ? `${totalLU} LU | Flow: ${peakFlowLps.toFixed(2)} L/s | Rec: ${recommendedWaterPipe}`
          : `${totalWSFU} WSFU | Flow: ${peakFlowLps.toFixed(1)} L/s | Rec: ${recommendedWaterPipe}`;
        parameters = {
          ...parameters,
          fixtures,
          systemType,
          designVelocity,
          slope,
        };
      } else if (subTab === 'tanks') {
        title = `Water/Septic Sizing (${occupants} Occ)`;
        summary = `Potable: ${totalWaterStorageM3.toFixed(0)}m³ | Septic: ${totalSepticVolumeM3.toFixed(1)}m³`;
        parameters = {
          ...parameters,
          occupants,
          consumptionRate,
          storageDays,
          septicDischarge,
          septicDesludgeInterval,
          sumpInflow,
        };
      } else {
        title = `Plumbing Pumps (Elev. ${boosterStaticHead}m)`;
        summary = `Booster: ${boosterHP.toFixed(1)} HP | Transfer: ${transferHP.toFixed(1)} HP`;
        parameters = {
          ...parameters,
          boosterStaticHead,
          boosterResidualPress,
          boosterFrictionPercent,
          boosterEfficiency,
          transferFillTime,
          transferStaticHead,
          sumpStaticHead,
        };
      }
 
      onSaveCalculation({
        tab: 'plumbing',
        subType: subTab,
        title,
        summary,
        parameters,
      });
      triggerToast(t('toastCalculationSaved'));
    }
  };

  const handleExportCSV = () => {
    if (subTab === 'fixtures') {
      exportPlumbingToCsv({
        standard,
        fixtures: appliedFixtures.map(f => ({
          name: f.name,
          qty: f.qty,
          value: standard === 'bs' ? f.lu : f.wsfu,
          unitType: standard === 'bs' ? 'LU' : 'WSFU'
        })),
        totalUnits: standard === 'bs' ? totalLU : totalWSFU,
        flowRate: peakFlowLps,
        velocity: designVelocity,
        pipeDiameter: calculatedWaterPipeDia
      });
    } else if (subTab === 'tanks') {
      const rows = [
        { section: "Tanks Input", parameter: "Occupants Count", value: occupants, unit: "Persons", notes: "" },
        { section: "Tanks Input", parameter: "Daily Potable Use Rate", value: consumptionRate, unit: "L/person/day", notes: "" },
        { section: "Tanks Input", parameter: "Storage Days Margin", value: storageDays, unit: "Days", notes: "Emergency buffer" },
        { section: "Tanks Input", parameter: "Daily Septic Load Rate", value: septicDischarge, unit: "L/person/day", notes: "Greywater + blackwater discharge" },
        { section: "Tanks Input", parameter: "Septic Desludge Interval", value: septicDesludgeInterval, unit: "Years", notes: "Sludge accumulation cycle" },
        
        { section: "Tanks Sizing Output", parameter: "Daily Potable Water Demand", value: totalWaterStorageLiters / storageDays, unit: "Liters", notes: "Average consumption per 24 hours" },
        { section: "Tanks Sizing Output", parameter: "Potable Tank Capacity Required", value: totalWaterStorageLiters, unit: "Liters", notes: `Sized for ${storageDays} days` },
        { section: "Tanks Sizing Output", parameter: "Potable Tank Volume", value: totalWaterStorageM3.toFixed(2), unit: "m³", notes: "" },
        { section: "Tanks Sizing Output", parameter: "Septic Sludge Storage Zone", value: (septicSludgeVol / 1000).toFixed(2), unit: "m³", notes: "" },
        { section: "Tanks Sizing Output", parameter: "Septic Settling Liquid Volume", value: (septicLiquidVol / 1000).toFixed(2), unit: "m³", notes: "" },
        { section: "Tanks Sizing Output", parameter: "Total Septic Tank Volume Required", value: totalSepticVolumeM3.toFixed(2), unit: "m³", notes: "Total tank interior clearance volume" }
      ];
      import('../lib/exportCsv').then(({ downloadCsv }) => {
        downloadCsv("plumbing_tank_sizing", "Plumbing Water and Septic Tank Sizing", rows);
      });
    } else {
      const rows = [
        { section: "Pump Input", parameter: "Building Static Height", value: boosterStaticHead, unit: "meters", notes: "Vertical static head" },
        { section: "Pump Input", parameter: "Remote Fixture Residual Press", value: boosterResidualPress, unit: "bar", notes: "IPC/BS minimum target pressure" },
        { section: "Pump Input", parameter: "Friction Loss Allowance", value: boosterFrictionPercent, unit: "%", notes: "Allowance added to static rise" },
        { section: "Pump Input", parameter: "Pump Mech. Efficiency", value: boosterEfficiency, unit: "%", notes: "Used to determine electric motor HP" },
        
        { section: "Booster Pump Output", parameter: "Booster Total Head (TDH)", value: boosterHeadMeters.toFixed(1), unit: "meters", notes: "" },
        { section: "Booster Pump Output", parameter: "Booster Required Power", value: boosterHP.toFixed(2), unit: "HP (Horsepower)", notes: "Electric motor rating" },
        
        { section: "Transfer Pump Output", parameter: "Transfer Target Fill Time", value: transferFillTime, unit: "minutes", notes: "" },
        { section: "Transfer Pump Output", parameter: "Transfer Pump Flow Rate", value: transferFlowLps.toFixed(2), unit: "L/s", notes: "" },
        { section: "Transfer Pump Output", parameter: "Transfer Head (TDH)", value: transferHeadMeters.toFixed(1), unit: "meters", notes: "" },
        { section: "Transfer Pump Output", parameter: "Transfer Required Power", value: transferHP.toFixed(2), unit: "HP (Horsepower)", notes: "" },
        
        { section: "Sump Pump Output", parameter: "Sump Peak Inflow Rate", value: sumpInflow, unit: "L/min", notes: "Stormwater or drainage peak load" },
        { section: "Sump Pump Output", parameter: "Sump Head (TDH)", value: sumpHeadMeters.toFixed(1), unit: "meters", notes: "" },
        { section: "Sump Pump Output", parameter: "Sump Required Power", value: sumpHP.toFixed(2), unit: "HP (Horsepower)", notes: "" },
      ];
      import('../lib/exportCsv').then(({ downloadCsv }) => {
        downloadCsv("plumbing_pump_sizing", "Plumbing Water Booster and Transfer Pump Sizing", rows);
      });
    }
    triggerToast('Plumbing calculations exported!');
  };
 
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-slate-100">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-400 px-4 py-3 rounded-lg shadow-xl shadow-cyan-950/20 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse shadow-md shadow-cyan-500/50" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">
              {standard === 'bs' ? 'BS Plumbing Suite (BS 8558)' : '2018 IPC Plumbing Suite'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {standard === 'bs'
              ? 'British Standard loading units (LU), gravity drainage discharge units (DU) BS EN 12056, septic BS 6297, and pumping design.'
              : 'Compliant water load, drainage pipe sizing, municipal/private septic capacity, and booster/submersible pump specifications.'}
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setStandard('ipc')}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              standard === 'ipc'
                ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IPC Standard
          </button>
          <button
            onClick={() => setStandard('bs')}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
              standard === 'bs'
                ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BS STANDARD
          </button>
        </div>
      </div>

      {/* Internal Sub-Tabs */}
      <div className="flex flex-wrap bg-slate-950/80 p-1 rounded-xl border border-slate-850 gap-1">
        <button
          onClick={() => setSubTab('fixtures')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'fixtures' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Fixtures & Pipe Sizing
        </button>
        <button
          onClick={() => setSubTab('tanks')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'tanks' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Water & Septic Tanks
        </button>
        <button
          onClick={() => setSubTab('pumps')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'pumps' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Pumps & Flow Rates
        </button>
        <button
          onClick={() => setSubTab('formulas')}
          className={`flex-1 py-2.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            subTab === 'formulas' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Formulas
        </button>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* LEFT COLUMN: MODULE SPECIFIC INPUTS (7 cols) */}
        <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-6 google-pro-border-cyan">
          
          {subTab === 'formulas' && (
            <FormulaVisualizer
              category="Plumbing"
              formulas={[
                {
                  id: 'velocity',
                  title: 'Pipe Water Velocity',
                  description: 'Calculates the velocity of water through a pipe based on flow rate and internal diameter.',
                  equation: 'V = \\frac{4 \\cdot Q}{\\pi \\cdot D_{int}^2}',
                  variables: [
                    { symbol: 'V', meaning: 'Velocity (m/s)' },
                    { symbol: 'Q', meaning: 'Flow rate (m³/s)' },
                    { symbol: 'D_{int}', meaning: 'Internal pipe diameter (m)' }
                  ]
                },
                {
                  id: 'hazen_williams',
                  title: 'Friction Loss (Hazen-Williams)',
                  description: 'Empirical formula used to calculate pressure drop in closed water pipes.',
                  equation: 'H_f = 10.67 \\cdot L \\cdot \\left(\\frac{Q}{C}\\right)^{1.852} \\cdot \\frac{1}{D^{4.87}}',
                  variables: [
                    { symbol: 'H_f', meaning: 'Friction head loss (m)' },
                    { symbol: 'L', meaning: 'Length of pipe (m)' },
                    { symbol: 'Q', meaning: 'Flow rate (m³/s)' },
                    { symbol: 'C', meaning: 'Roughness coefficient (e.g. 150 for PVC)' },
                    { symbol: 'D', meaning: 'Pipe internal diameter (m)' }
                  ]
                },
                {
                  id: 'pump_power',
                  title: 'Pump Brake Horsepower',
                  description: 'Calculates the required motor power to drive a water pump.',
                  equation: 'P = \\frac{\\rho \\cdot g \\cdot Q \\cdot H}{\\eta}',
                  variables: [
                    { symbol: 'P', meaning: 'Power (Watts)' },
                    { symbol: '\\rho', meaning: 'Fluid density (1000 kg/m³ for water)' },
                    { symbol: 'g', meaning: 'Gravity (9.81 m/s²)' },
                    { symbol: 'Q', meaning: 'Flow rate (m³/s)' },
                    { symbol: 'H', meaning: 'Total dynamic head (m)' },
                    { symbol: '\\eta', meaning: 'Pump efficiency (0.0 to 1.0)' }
                  ]
                }
              ]}
            />
          )}

          {subTab === 'fixtures' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4.5 w-4.5 text-cyan-400" />
                  <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">
                    {standard === 'bs' ? 'Plumbing Fixtures (BS EN 806 Schedule)' : 'Plumbing Fixtures (IPC Schedule)'}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {standard === 'bs' ? (
                    <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 rounded px-2.5 py-1 font-mono font-bold">
                      BS EN 806-3 Demand Curve
                    </span>
                  ) : (
                    <>
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Curve Style:</label>
                      <select
                        value={systemType}
                        onChange={(e) => setSystemType(e.target.value as 'valve' | 'tank')}
                        className="bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-cyan-400 rounded px-2.5 py-1 focus:outline-none"
                      >
                        <option value="valve">Flush Valves (Commercial)</option>
                        <option value="tank">Flush Tanks (Residential)</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              {/* Fixtures Table Grid */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
                {fixtures.map((fix) => (
                  <div key={fix.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors">
                    <div className="min-w-0 pr-3">
                      <span className="block text-xs font-bold text-slate-200 leading-snug">{fix.name}</span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {standard === 'bs'
                          ? `Loading Units (LU): ${fix.lu} | Discharge Units (DU): ${fix.du} per unit`
                          : `WSFU: ${fix.wsfu} | DFU: ${fix.dfu} per unit`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty - 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={fix.qty}
                        onChange={(e) => handleQtyChange(fix.id, Number(e.target.value))}
                        className="w-12 bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center rounded py-1 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty + 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Sizing Constraints */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">People (Occupants)</label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={occupants}
                    onChange={(e) => setOccupants(Number(e.target.value) || 0)}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      occupants !== 0 && (occupants < 1 || occupants > 5000)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {occupants !== 0 && (occupants < 1 || occupants > 5000) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 1 to 5,000</p>
                  )}
                </div>
                <div>
                  <TooltipLabel 
                    label="Water Velocity (m/s)" 
                    tooltip="Maximum allowable velocity in water distribution pipes to prevent water hammer and excessive noise. Typical range: 1.2 to 2.4 m/s (4 to 8 ft/s)." 
                    className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                  />
                  <input
                    type="number"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={designVelocity}
                    onChange={(e) => setDesignVelocity(Number(e.target.value) || 0)}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      designVelocity !== 0 && (designVelocity < 0.5 || designVelocity > 3.0)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {designVelocity !== 0 && (designVelocity < 0.5 || designVelocity > 3.0) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 0.5 to 3.0 m/s</p>
                  )}
                </div>
                <div>
                  <TooltipLabel 
                    label="Sewage Slope (%)"
                    tooltip="Minimum slope per IPC to maintain self-cleansing velocity. Typical design range: 1% (1/8 in/ft) for pipes ≥ 3 inches, or 2% (1/4 in/ft) for pipes < 3 inches."
                    className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                  />
                  <select
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                  >
                    <option value={0.5}>0.5% Slope (1:200)</option>
                    <option value={1}>1% Slope (1:100)</option>
                    <option value={2}>2% Slope (1:50)</option>
                    <option value={4}>4% Slope (1:25)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {subTab === 'tanks' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Storage & Tank Parameters</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Building Occupants Count</label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={occupants || ''}
                    onChange={(e) => setOccupants(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      occupants !== 0 && (occupants < 1 || occupants > 5000)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {occupants !== 0 && (occupants < 1 || occupants > 5000) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Safe range: 1 to 5,000 occupants
                    </p>
                  )}
                </div>
                <div>
                  <TooltipLabel 
                    label="Daily Consump. (Liters/person/day)"
                    tooltip="Average daily domestic cold water consumption. Values vary by building class (e.g. 150-250 L/p/d for residential)."
                    className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                  />
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={consumptionRate || ''}
                    onChange={(e) => setConsumptionRate(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      consumptionRate !== 0 && (consumptionRate < 20 || consumptionRate > 500)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {consumptionRate !== 0 && (consumptionRate < 20 || consumptionRate > 500) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Standard range: 20 to 500 L/p/d
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Water Storage Buffer (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={storageDays || ''}
                    onChange={(e) => setStorageDays(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      storageDays !== 0 && (storageDays < 1 || storageDays > 7)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {storageDays !== 0 && (storageDays < 1 || storageDays > 7) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Safe range: 1 to 7 days
                    </p>
                  )}
                </div>
                <div>
                  <TooltipLabel 
                    label="Septic Discharge Rate (L/p/day)"
                    tooltip="Soil absorption rate per person. Used to size primary anaerobic breakdown chambers per WHO/local health standards."
                    className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase" 
                  />
                  <input
                    type="number"
                    min="20"
                    max="400"
                    value={septicDischarge || ''}
                    onChange={(e) => setSepticDischarge(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      septicDischarge !== 0 && (septicDischarge < 20 || septicDischarge > 400)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {septicDischarge !== 0 && (septicDischarge < 20 || septicDischarge > 400) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Safe range: 20 to 400 L/p/d
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Desludging Interval (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={septicDesludgeInterval || ''}
                    onChange={(e) => setSepticDesludgeInterval(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      septicDesludgeInterval !== 0 && (septicDesludgeInterval < 1 || septicDesludgeInterval > 10)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {septicDesludgeInterval !== 0 && (septicDesludgeInterval < 1 || septicDesludgeInterval > 10) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Safe range: 1 to 10 years
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Peak Sump Sump Inflow (L/min)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={sumpInflow || ''}
                    onChange={(e) => setSumpInflow(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-950 text-white rounded-lg px-3.5 py-2 text-xs font-mono focus:outline-none transition-colors border ${
                      sumpInflow !== 0 && (sumpInflow < 10 || sumpInflow > 1000)
                        ? 'border-red-500/70 focus:ring-1 focus:ring-red-500/20 text-red-200'
                        : 'border-slate-800 focus:ring-1 focus:ring-cyan-500/30 focus:border-cyan-500'
                    } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                  />
                  {sumpInflow !== 0 && (sumpInflow < 10 || sumpInflow > 1000) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">
                      ⚠️ Safe range: 10 to 1,000 L/min
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {subTab === 'pumps' && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Activity className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Pumps Head & Sizing Parameters</h3>
              </div>

              <div className="space-y-4">
                {/* Section A: Booster */}
                <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-3.5">
                  <h4 className="text-[11px] font-bold uppercase text-cyan-400 tracking-wide">1. Domestic Water Booster Pump Set</h4>
                  <div className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Building Static Height (m)</label>
                      <input
                        type="number"
                    min="1"
                    max="250"
                        value={boosterStaticHead || ''}
                        onChange={(e) => setBoosterStaticHead(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                          boosterStaticHead !== 0 && (boosterStaticHead < 1 || boosterStaticHead > 250)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {boosterStaticHead !== 0 && (boosterStaticHead < 1 || boosterStaticHead > 250) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 1 - 250 m</p>
                      )}
                    </div>
                    <div>
                      <TooltipLabel 
                        label="IPC Target Press. (bar)"
                        tooltip="Required residual pressure at the highest/most hydraulically remote fixture per IPC (typically 1.0 - 2.0 bar)."
                        className="block text-[9px] text-slate-400 font-bold uppercase mb-1" 
                      />
                      <input
                        type="number"
                    min="1.0"
                    max="6.0"
                        step="0.5"
                        value={boosterResidualPress || ''}
                        onChange={(e) => setBoosterResidualPress(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                          boosterResidualPress !== 0 && (boosterResidualPress < 1.0 || boosterResidualPress > 6.0)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {boosterResidualPress !== 0 && (boosterResidualPress < 1.0 || boosterResidualPress > 6.0) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 1.0 - 6.0 bar</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Friction Loss Allowance (%)</label>
                      <input
                        type="number"
                    min="5"
                    max="45"
                        value={boosterFrictionPercent || ''}
                        onChange={(e) => setBoosterFrictionPercent(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                          boosterFrictionPercent !== 0 && (boosterFrictionPercent < 5 || boosterFrictionPercent > 45)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {boosterFrictionPercent !== 0 && (boosterFrictionPercent < 5 || boosterFrictionPercent > 45) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 5% - 45%</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Pump Set Efficiency (%)</label>
                      <input
                        type="number"
                    min="40"
                    max="95"
                        value={boosterEfficiency || ''}
                        onChange={(e) => setBoosterEfficiency(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-colors border ${
                          boosterEfficiency !== 0 && (boosterEfficiency < 40 || boosterEfficiency > 95)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {boosterEfficiency !== 0 && (boosterEfficiency < 40 || boosterEfficiency > 95) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 40% - 95%</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section B: Transfer & Sump */}
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-3">
                    <h4 className="text-[11px] font-bold uppercase text-cyan-400 tracking-wide">2. Transfer Pump Sizing</h4>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Roof Sump target fill time (mins)</label>
                      <input
                        type="number"
                    min="10"
                    max="180"
                        value={transferFillTime || ''}
                        onChange={(e) => setTransferFillTime(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1 text-xs font-mono focus:outline-none transition-colors border ${
                          transferFillTime !== 0 && (transferFillTime < 10 || transferFillTime > 180)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {transferFillTime !== 0 && (transferFillTime < 10 || transferFillTime > 180) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 10 - 180 mins</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Vertical Sump Lift (m)</label>
                      <input
                        type="number"
                    min="1"
                    max="150"
                        value={transferStaticHead || ''}
                        onChange={(e) => setTransferStaticHead(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1 text-xs font-mono focus:outline-none transition-colors border ${
                          transferStaticHead !== 0 && (transferStaticHead < 1 || transferStaticHead > 150)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {transferStaticHead !== 0 && (transferStaticHead < 1 || transferStaticHead > 150) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 1 - 150 m</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl space-y-3">
                    <h4 className="text-[11px] font-bold uppercase text-cyan-400 tracking-wide">3. Submersible Sump Pump</h4>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Peak Waste Inflow (Lpm)</label>
                      <p className="bg-slate-950 border border-slate-850 text-slate-400 rounded px-2.5 py-1 text-xs font-mono">
                        {sumpInflow} L/min
                      </p>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Static Lift to sewer (m)</label>
                      <input
                        type="number"
                    min="1"
                    max="50"
                        value={sumpStaticHead || ''}
                        onChange={(e) => setSumpStaticHead(e.target.value === '' ? 0 : Number(e.target.value))}
                        className={`w-full bg-slate-950 text-white rounded px-2.5 py-1 text-xs font-mono focus:outline-none transition-colors border ${
                          sumpStaticHead !== 0 && (sumpStaticHead < 1 || sumpStaticHead > 50)
                            ? 'border-red-500/70 text-red-200'
                            : 'border-slate-800 focus:border-cyan-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                      />
                      {sumpStaticHead !== 0 && (sumpStaticHead < 1 || sumpStaticHead > 50) && (
                        <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 1 - 50 m</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {!autoCalculate && (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleApplyCalculations}
                disabled={!hasPendingChanges}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  hasPendingChanges
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                }`}
              >
                <span>{hasPendingChanges ? 'Apply & Calculate' : 'Calculations Up To Date'}</span>
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MODULE SPECIFIC RESULTS & REPORTS (5 cols) */}
        <motion.div
          key={`${subTab}-${peakFlowLps.toFixed(4)}-${sumpVolumeLiters.toFixed(2)}-${totalWaterStorageLiters.toFixed(2)}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden google-pro-border-cyan"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Calculated Output Dynamics</span>
              <span className="text-[9px] text-slate-500 font-mono">Active Run</span>
            </h3>

            {subTab === 'fixtures' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl">
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold">
                      {standard === 'bs' ? 'Total Loading Units' : 'Total Water Load'}
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5 font-mono">
                      {standard === 'bs' ? (
                        <>
                          {totalLU.toFixed(1)} <span className="text-xs text-slate-400">LU</span>
                        </>
                      ) : (
                        <>
                          {totalWSFU} <span className="text-xs text-slate-400">WSFU</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl">
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold">
                      {standard === 'bs' ? 'Total Discharge Units' : 'Total Drainage'}
                    </span>
                    <p className="text-xl font-bold text-white mt-0.5 font-mono">
                      {standard === 'bs' ? (
                        <>
                          {totalDU.toFixed(1)} <span className="text-xs text-slate-400">DU</span>
                        </>
                      ) : (
                        <>
                          {totalDFU} <span className="text-xs text-slate-400">DFU</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3.5 border-t border-slate-800">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'BS EN 806 Peak Flow (QD)' : "Hunter's Peak Flow"}
                    </span>
                    <p className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5">
                      {peakFlowLps.toFixed(2)} <span className="text-xs text-slate-400 font-semibold">L/s</span>{' '}
                      <span className="text-xs text-slate-500">({peakFlowGPM.toFixed(1)} GPM)</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      Suggested Cold Water Pipe
                    </span>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {recommendedWaterPipe}{' '}
                      <span className="text-[10px] text-slate-500 font-mono font-normal">({calculatedWaterPipeDia.toFixed(1)} mm calculated)</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-850">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'BS EN 12056 Main Drain' : 'Sewage Sewer Design Size'}
                    </span>
                    <p className="text-sm font-extrabold text-cyan-400 mt-1">
                      {sewagePipe.size}
                    </p>
                    <span className="block text-[9px] text-slate-500 leading-normal mt-0.5">
                      * {sewagePipe.reason}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'tanks' && (
              <div className="space-y-4">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Potable Water Tank Capacity</span>
                  <p className="text-2xl font-black text-cyan-400 font-mono mt-1">
                    {totalWaterStorageM3.toFixed(1)} <span className="text-sm font-normal text-slate-400">m³</span>
                  </p>
                  <span className="block text-[10px] text-slate-400 font-mono mt-1">
                    ({totalWaterStorageLiters.toLocaleString()} Liters for {storageDays} days)
                  </span>
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                  <div className="bg-slate-950/30 p-2.5 rounded border border-slate-850">
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Ground Reservoir (2/3)</span>
                    <span className="block text-xs font-bold font-mono text-white mt-1">{ugTankVolume.toFixed(1)} m³</span>
                  </div>
                  <div className="bg-slate-950/30 p-2.5 rounded border border-slate-850">
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Roof Elev. Tank (1/3)</span>
                    <span className="block text-xs font-bold font-mono text-white mt-1">{roofTankVolume.toFixed(1)} m³</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'BS 6297 Septic Tank Volume' : 'IPC/EPA Septic Tank Volume'}
                    </span>
                    <p className="text-lg font-black text-white font-mono mt-1">
                      {totalSepticVolumeM3.toFixed(2)} <span className="text-xs text-slate-400 font-semibold">m³</span>
                    </p>
                    <span className="block text-[9px] text-slate-500 leading-normal mt-1">
                      {standard === 'bs' ? (
                        <>* Complies with BS 6297 Code of Practice. Includes {septicLiquidVol.toLocaleString()}L retention + {septicSludgeVol.toLocaleString()}L sludge build-up reserve.</>
                      ) : (
                        <>* Includes {septicLiquidVol.toLocaleString()}L wastewater retention (1.5 days flow) + {septicSludgeVol.toLocaleString()}L sludge build-up storage.</>
                      )}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-850">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'Sump Receiver (BS EN 12050)' : 'Submersible / Sump Tank'}
                    </span>
                    <p className="text-lg font-bold text-cyan-400 font-mono mt-1">
                      {sumpVolumeM3.toFixed(1)} <span className="text-xs text-slate-400">m³</span>
                    </p>
                    <span className="block text-[9px] text-slate-500">
                      * Holds {sumpVolumeLiters.toLocaleString()} Liters (20 mins protection flow)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'pumps' && (
              <div className="space-y-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850 space-y-3">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">Water Booster Pump Set</span>
                    <p className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
                      {boosterHP.toFixed(2)} <span className="text-xs text-slate-400">HP</span>{' '}
                      <span className="text-xs text-slate-500">({(boosterShaftPower).toFixed(2)} kW)</span>
                    </p>
                    <div className="text-[9px] text-slate-400 font-mono mt-1 space-y-0.5">
                      <div>• Sump Peak Flow: {boosterFlowLpm.toFixed(0)} L/min ({peakFlowLps.toFixed(2)} L/s)</div>
                      <div>• Total Calc Head: {boosterHeadMeters.toFixed(1)} meters ({ (boosterHeadMeters / 10.197).toFixed(1) } bar)</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2.5">
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 space-y-1.5">
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Water Transfer Pump</span>
                    <span className="block text-sm font-bold text-white font-mono">{transferHP.toFixed(2)} HP</span>
                    <div className="text-[8px] text-slate-500 leading-normal">
                      Flow: {transferFlowLpm.toFixed(0)} Lpm<br/>Head: {transferHeadMeters.toFixed(1)}m
                    </div>
                  </div>

                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 space-y-1.5">
                    <span className="block text-[8px] text-slate-500 font-bold uppercase">Submersible Sump Pump</span>
                    <span className="block text-sm font-bold text-cyan-400 font-mono">{sumpHP.toFixed(2)} HP</span>
                    <div className="text-[8px] text-slate-500 leading-normal">
                      Flow: {sumpFlowLpm.toFixed(0)} Lpm<br/>Head: {sumpHeadMeters.toFixed(1)}m
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-850 space-y-2.5">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Pump-to-Service Recommended Main Pipes</span>
                  <div className="space-y-2 text-[10px] text-slate-300 font-mono">
                    <div className="border-b border-slate-850/60 pb-1.5">
                      <span className="text-cyan-400 font-bold">Booster Main (Flow: {peakFlowLps.toFixed(2)} L/s):</span>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 pl-2">
                        <span>• Suction Line (≤ 1.2 m/s):</span>
                        <span className="text-white font-bold">{boosterSuctionPipe}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 pl-2">
                        <span>• Discharge/Service Main:</span>
                        <span className="text-white font-bold">{boosterDischargePipe}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">Transfer Main (Flow: {transferFlowLps.toFixed(2)} L/s):</span>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 pl-2">
                        <span>• Suction Line (≤ 1.2 m/s):</span>
                        <span className="text-white font-bold">{transferSuctionPipe}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 pl-2">
                        <span>• Discharge/Service Main:</span>
                        <span className="text-white font-bold">{transferDischargePipe}</span>
                      </div>
                    </div>
                  </div>
                  <span className="block text-[8px] text-slate-500 italic mt-1 leading-normal">
                    * Sized using standard fluid velocities to prevent pipe erosion, cavitation, and dynamic water hammer.
                  </span>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                  <Info className="h-4 w-4 text-cyan-400 float-left mr-2 mt-0.5" />
                  {standard === 'bs'
                    ? 'Pump sizing features auto-calculate total dynamic hydraulic head (TDH) based on gravity elevation vertical rise, pipe friction allowances, and BS EN 806 / BS 8558 required residual discharge water pressure standards.'
                    : 'Pump sizing features auto-calculates total dynamic hydraulic head (TDH) based on gravity elevation vertical rise, pipe friction allowances, and IPC required residual discharge water pressure standards.'
                  }
                </div>
              </div>
            )}

          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>{t('saveIteration')}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/20 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 border border-cyan-500/50 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{t('exportCsv')}</span>
            </button>
            <button
              onClick={() => {
                const subject = encodeURIComponent(`CKY_MEPF - Plumbing Sizing Estimate Report`);
                let summaryText = '';
                if (subTab === 'fixtures') {
                  summaryText = `- Standard: ${standard.toUpperCase()}\n` +
                    `- Total Load: ${standard === 'bs' ? totalLU + ' LU | ' + totalDU + ' DU' : totalWSFU + ' WSFU | ' + totalDFU + ' DFU'}\n` +
                    `- Design Velocity: ${designVelocity} m/s\n` +
                    `- Sewage Slope: ${slope}%\n` +
                    `- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM)\n` +
                    `- Recommended Water Pipe: ${recommendedWaterPipe}\n` +
                    `- Recommended Sewage Pipe: ${sewagePipe.size} (${sewagePipe.reason})`;
                } else if (subTab === 'tanks') {
                  summaryText = `- Occupants: ${occupants}\n` +
                    `- Daily Water Use Rate: ${consumptionRate} L/person/day\n` +
                    `- Storage Days: ${storageDays}\n` +
                    `- Required Water Storage: ${totalWaterStorageM3.toFixed(1)} m³ (${totalWaterStorageLiters.toLocaleString()} Liters)\n` +
                    `  • Underground Tank (2/3): ${ugTankVolume.toFixed(1)} m³\n` +
                    `  • Elevated Roof Tank (1/3): ${roofTankVolume.toFixed(1)} m³\n` +
                    `- Required Septic Tank: ${totalSepticVolumeM3.toFixed(1)} m³ (${totalSepticVolumeLiters.toLocaleString()} Liters)\n` +
                    `- Sump Receiver Volume: ${sumpVolumeM3.toFixed(1)} m³`;
                } else {
                  summaryText = `- Static Booster Rise: ${boosterStaticHead} m\n` +
                    `- Booster Flow: ${boosterFlowLpm.toFixed(0)} L/min (${peakFlowLps.toFixed(2)} L/s)\n` +
                    `- Required Booster Pump: ${boosterHP.toFixed(2)} HP (${boosterShaftPower.toFixed(2)} kW)\n` +
                    `- Required Transfer Pump: ${transferHP.toFixed(2)} HP\n` +
                    `- Required Sump Pump: ${sumpHP.toFixed(2)} HP`;
                }
                const body = encodeURIComponent(
                  `Dear Team,\n\nHere is the Plumbing Sizing Estimate Report (${subTab === 'fixtures' ? 'Fixtures & Pipe Sizing' : subTab === 'tanks' ? 'Water & Septic Tanks' : 'Pumps & Flow Rates'}) generated from CKY_MEPF:\n\n` +
                  summaryText +
                  `\n\nGenerated on ${new Date().toLocaleString()}\n` +
                  `Regards,\n` +
                  `Design Team`
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>{t('shareEmail')}</span>
            </button>
          </div>
        </motion.div>

      </div>

      {/* Interactive Trend Chart Section */}
      <TrendVisualizer 
        type={subTab === 'fixtures' ? 'plumbing_fixtures' : subTab === 'tanks' ? 'plumbing_tanks' : 'plumbing_pumps'} 
        currentParams={{
          totalLU: totalLU,
          peakFlowLps: peakFlowLps,
          standard: appliedStandard,
          occupants: appliedOccupants,
          consumptionRate: appliedConsumptionRate,
          storageDays: appliedStorageDays,
          septicDischarge: appliedSepticDischarge,
          septicDesludgeInterval: appliedSepticDesludgeInterval,
          totalWaterStorageLiters: totalWaterStorageLiters,
          boosterStaticHead: appliedBoosterStaticHead,
          boosterEfficiency: appliedBoosterEfficiency,
          boosterResidualPress: appliedBoosterResidualPress,
          boosterFrictionPercent: appliedBoosterFrictionPercent,
          boosterHP: boosterHP
        }}
      />
    </div>
  );
}
