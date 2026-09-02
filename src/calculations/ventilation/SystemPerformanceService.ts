export interface SystemPerformanceInput {
  qOutdoorAir: number; // Q_OA (from 62.1 Vot)
  qReturnAir: number;  // Q_return
  densityRatio: number; // Density correction E_rho
  criticalDuctLength: number; // Length of critical path (ft or m)
  ductFrictionRate: number; // e.g. 0.1 in.wg./100ft or Pa/m
  fittingLosses: number; // Total dynamic fitting losses (in.wg. or Pa)
  equipmentPressureDrop: number; // Coils, filters, etc. (in.wg. or Pa)
  fanEfficiency: number; // 0 to 1 (e.g. 0.65)
  motorEfficiency: number; // 0 to 1 (e.g. 0.85)
  isMetric: boolean;
}

export interface SystemPerformanceResult {
  qSupplyStandard: number; // Standard airflow
  qSupplyActual: number; // Density-corrected airflow
  totalStaticPressure: number; // TSP in in.wg. or Pa
  fanBrakeHorsepower: number; // BHP (Imperial) or Shaft kW (Metric)
  motorElectricalPower: number; // Total electrical kW
  turndownAirflow?: number;
  turndownStaticPressure?: number;
  turndownMotorElectricalPower?: number;
}

export class SystemPerformanceService {
  /**
   * Calculates the coherent fan performance chain:
   * Q_OA -> Q_supply -> duct network -> critical path -> SP -> fan duty
   */
  static calculateFanPerformance(input: SystemPerformanceInput): SystemPerformanceResult {
    // 1. Calculate Standard Supply Air
    const qSupplyStandard = input.qOutdoorAir + input.qReturnAir;

    // 2. Apply Air Density Integration (E_rho) to find Actual Supply Air
    // Q_actual = Q_standard / densityRatio
    const densityRatio = input.densityRatio > 0 ? input.densityRatio : 1.0;
    const qSupplyActual = qSupplyStandard / densityRatio;

    // 3. Duct Network & Critical Path Static Pressure
    // Pressure loss = (Friction Rate * Length / 100) + Fitting Losses + Equipment Drops
    let ductFrictionLoss = 0;
    if (input.isMetric) {
      // Metric: friction rate is typically Pa/m
      ductFrictionLoss = input.ductFrictionRate * input.criticalDuctLength;
    } else {
      // Imperial: friction rate is typically in.wg. / 100 ft
      ductFrictionLoss = input.ductFrictionRate * (input.criticalDuctLength / 100.0);
    }
    
    // Total Static Pressure (TSP)
    // SP changes slightly with density: SP_actual = SP_standard * densityRatio
    // Assuming inputs are standard conditions, we correct them to actual
    const standardTSP = ductFrictionLoss + input.fittingLosses + input.equipmentPressureDrop;
    const totalStaticPressure = standardTSP * densityRatio;

    // 4. Fan Duty (Power)
    const fanEff = Math.max(0.01, input.fanEfficiency);
    const motorEff = Math.max(0.01, input.motorEfficiency);
    
    let fanBrakeHorsepower = 0;
    let motorElectricalPower = 0;

    if (input.isMetric) {
      // Metric power calculation:
      // Air Power (W) = Q (m3/s) * P (Pa)
      // Note: If input airflow is L/s, convert to m3/s
      const qM3s = qSupplyActual / 1000.0;
      const airPowerWatts = qM3s * totalStaticPressure;
      
      const shaftPowerWatts = airPowerWatts / fanEff;
      fanBrakeHorsepower = shaftPowerWatts / 1000.0; // Return shaft kW in metric mode
      motorElectricalPower = fanBrakeHorsepower / motorEff; 
    } else {
      // Imperial power calculation:
      // Air Power (HP) = Q (CFM) * P (in.wg.) / 6356
      const airPowerHP = (qSupplyActual * totalStaticPressure) / 6356.0;
      fanBrakeHorsepower = airPowerHP / fanEff;
      
      // Convert BHP to electrical kW (1 HP = 0.7457 kW)
      motorElectricalPower = (fanBrakeHorsepower * 0.7457) / motorEff;
    }

    // 5. Fan Affinity Law Calculation (VFD Turndown Example - default 50% flow)
    // Flow ∝ RPM, SP ∝ RPM^2, Power ∝ RPM^3
    const turndownRatio = 0.5; 
    const turndownAirflow = qSupplyActual * turndownRatio;
    const turndownStaticPressure = totalStaticPressure * Math.pow(turndownRatio, 2);
    // Real VFDs don't follow perfect cube law due to static pressure setpoints and efficiency drops
    // A more realistic empirical exponent for VAV is 2.5 to 2.7 instead of 3.0
    const turndownMotorElectricalPower = motorElectricalPower * Math.pow(turndownRatio, 2.5);

    return {
      qSupplyStandard,
      qSupplyActual,
      totalStaticPressure,
      fanBrakeHorsepower,
      motorElectricalPower,
      turndownAirflow,
      turndownStaticPressure,
      turndownMotorElectricalPower
    };
  }
}
