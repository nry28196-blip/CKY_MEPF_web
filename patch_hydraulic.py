import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add states around line 85 (after sumpInflow)
search_state = """  const [sumpInflow, setSumpInflow] = useState<number>(150); // Liters/min peak storm/waste flow"""
replace_state = """  const [sumpInflow, setSumpInflow] = useState<number>(150); // Liters/min peak storm/waste flow

  // Hydraulic Pipe Sizing States
  const [pipeMaterial, setPipeMaterial] = useState<'pvc'|'copper'|'steel'>('pvc');
  const [pipeLength, setPipeLength] = useState<number>(30); // meters
  const [elevationChange, setElevationChange] = useState<number>(5); // meters
  const [availablePressure, setAvailablePressure] = useState<number>(4.0); // bar
  const [requiredResidual, setRequiredResidual] = useState<number>(1.5); // bar
  const [elbow90Count, setElbow90Count] = useState<number>(6);
  const [teeCount, setTeeCount] = useState<number>(4);"""
content = content.replace(search_state, replace_state)

# 2. Add applied states after appliedSumpInflow
search_applied_state = """  const [appliedSumpInflow, setAppliedSumpInflow] = useState<number>(150);"""
replace_applied_state = """  const [appliedSumpInflow, setAppliedSumpInflow] = useState<number>(150);
  const [appliedPipeMaterial, setAppliedPipeMaterial] = useState<'pvc'|'copper'|'steel'>('pvc');
  const [appliedPipeLength, setAppliedPipeLength] = useState<number>(30);
  const [appliedElevationChange, setAppliedElevationChange] = useState<number>(5);
  const [appliedAvailablePressure, setAppliedAvailablePressure] = useState<number>(4.0);
  const [appliedRequiredResidual, setAppliedRequiredResidual] = useState<number>(1.5);
  const [appliedElbow90Count, setAppliedElbow90Count] = useState<number>(6);
  const [appliedTeeCount, setAppliedTeeCount] = useState<number>(4);"""
content = content.replace(search_applied_state, replace_applied_state)

# 3. Add to autoCalculate useEffect
search_auto_calc = """      setAppliedSumpInflow(sumpInflow);"""
replace_auto_calc = """      setAppliedSumpInflow(sumpInflow);
      setAppliedPipeMaterial(pipeMaterial);
      setAppliedPipeLength(pipeLength);
      setAppliedElevationChange(elevationChange);
      setAppliedAvailablePressure(availablePressure);
      setAppliedRequiredResidual(requiredResidual);
      setAppliedElbow90Count(elbow90Count);
      setAppliedTeeCount(teeCount);"""
content = content.replace(search_auto_calc, replace_auto_calc)

search_auto_deps = """    consumptionRate, storageDays, septicDischarge, septicDesludgeInterval, sumpInflow,"""
replace_auto_deps = """    consumptionRate, storageDays, septicDischarge, septicDesludgeInterval, sumpInflow,
    pipeMaterial, pipeLength, elevationChange, availablePressure, requiredResidual, elbow90Count, teeCount,"""
content = content.replace(search_auto_deps, replace_auto_deps)

# 4. Add to hasPendingChanges
search_pending = """    sumpInflow !== appliedSumpInflow ||"""
replace_pending = """    sumpInflow !== appliedSumpInflow ||
    pipeMaterial !== appliedPipeMaterial ||
    pipeLength !== appliedPipeLength ||
    elevationChange !== appliedElevationChange ||
    availablePressure !== appliedAvailablePressure ||
    requiredResidual !== appliedRequiredResidual ||
    elbow90Count !== appliedElbow90Count ||
    teeCount !== appliedTeeCount ||"""
content = content.replace(search_pending, replace_pending)

# 5. Add to handleApplyCalculations
search_apply = """    setAppliedSumpInflow(sumpInflow);"""
replace_apply = """    setAppliedSumpInflow(sumpInflow);
    setAppliedPipeMaterial(pipeMaterial);
    setAppliedPipeLength(pipeLength);
    setAppliedElevationChange(elevationChange);
    setAppliedAvailablePressure(availablePressure);
    setAppliedRequiredResidual(requiredResidual);
    setAppliedElbow90Count(elbow90Count);
    setAppliedTeeCount(teeCount);"""
content = content.replace(search_apply, replace_apply)

# 6. Add hydraulic calculation logic after `recommendedWaterPipe`
search_calc = """  const recommendedWaterPipe = getNominalPipeSize(calculatedWaterPipeDia);"""
replace_calc = """  const recommendedWaterPipe = getNominalPipeSize(calculatedWaterPipeDia);

  // Advanced Hydraulic Sizing (IPC Appendix E Style)
  const calculateHydraulicPipe = () => {
    if (peakFlowLps <= 0) return null;
    const cFactor = appliedPipeMaterial === 'pvc' ? 150 : appliedPipeMaterial === 'copper' ? 140 : 120;
    const q_m3s = peakFlowLps / 1000;
    const sizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200];
    const minVelocityDiaMm = Math.sqrt((4 * q_m3s) / (Math.PI * appliedDesignVelocity)) * 1000;

    let finalDiaMm = sizes[sizes.length - 1];
    let hydraulicDetails = null;

    for (const dia of sizes) {
      if (dia < minVelocityDiaMm) continue; // Start checking from velocity-compliant size

      const d_m = dia / 1000;
      // Equivalent length calculation (Simplified L/D ratios: 90 elbow ~30, Tee ~60)
      const equivFittings = (appliedElbow90Count * 30 * d_m) + (appliedTeeCount * 60 * d_m);
      const totalLength = appliedPipeLength + equivFittings;

      // Metric Hazen-Williams
      const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
      const frictionLossM = Hf * totalLength;
      
      const totalHeadLossM = frictionLossM + appliedElevationChange;
      const totalHeadLossBar = totalHeadLossM / 10.197;
      
      const residualBar = appliedAvailablePressure - totalHeadLossBar;

      if (residualBar >= appliedRequiredResidual) {
        finalDiaMm = dia;
        hydraulicDetails = {
          size: `${dia} mm (DN${dia})`,
          frictionLossBar: (frictionLossM / 10.197).toFixed(2),
          elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
          residualBar: residualBar.toFixed(2),
          totalLength: totalLength.toFixed(1),
          equivFittings: equivFittings.toFixed(1),
          velocity: (q_m3s / (Math.PI * Math.pow(d_m / 2, 2))).toFixed(2)
        };
        break;
      }
    }

    if (!hydraulicDetails) {
      // Failed to find a size that works, use max
      const d_m = finalDiaMm / 1000;
      const equivFittings = (appliedElbow90Count * 30 * d_m) + (appliedTeeCount * 60 * d_m);
      const totalLength = appliedPipeLength + equivFittings;
      const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
      const totalHeadLossBar = (Hf * totalLength + appliedElevationChange) / 10.197;
      
      hydraulicDetails = {
        size: `> DN200`,
        frictionLossBar: (Hf * totalLength / 10.197).toFixed(2),
        elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),
        residualBar: (appliedAvailablePressure - totalHeadLossBar).toFixed(2),
        totalLength: totalLength.toFixed(1),
        equivFittings: equivFittings.toFixed(1),
        velocity: (q_m3s / (Math.PI * Math.pow(d_m / 2, 2))).toFixed(2),
        failed: true
      };
    }
    
    return hydraulicDetails;
  };
  
  const hydraulicResult = calculateHydraulicPipe();"""
content = content.replace(search_calc, replace_calc)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
