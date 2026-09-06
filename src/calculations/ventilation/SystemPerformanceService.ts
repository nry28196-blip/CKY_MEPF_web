export interface SystemPerformanceInput {
  qOutdoorAir: number;
  qReturnAir: number;
  densityRatio: number;
  criticalDuctLength: number;
  ductFrictionRate: number;
  fittingLosses: number;
  equipmentPressureDrop: number;
  fanEfficiency: number;
  motorEfficiency: number;
  isMetric: boolean;
}

export interface SystemPerformanceResult {
  qSupplyStandard: number;
  qSupplyActual: number;
  totalStaticPressure: number;
  fanBrakeHorsepower: number;
  motorElectricalPower: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export class SystemPerformanceService {
  static calculateFanPerformance(input: SystemPerformanceInput): SystemPerformanceResult {
    const { qOutdoorAir, qReturnAir, densityRatio, criticalDuctLength, ductFrictionRate, fittingLosses, equipmentPressureDrop, fanEfficiency, motorEfficiency, isMetric } = input;
    
    // Standard total flow
    const qSupplyStandard = qOutdoorAir + qReturnAir;
    
    // Actual airflow corrected for density
    // If density decreases (altitude), actual volume flow increases to maintain same mass flow
    const qSupplyActual = densityRatio > 0 ? qSupplyStandard / densityRatio : qSupplyStandard;

    // Total Static Pressure Calculation
    let ductFriction = 0;
    if (isMetric) {
      // metric: ductFrictionRate is Pa/m, length is m
      ductFriction = criticalDuctLength * ductFrictionRate;
    } else {
      // imperial: ductFrictionRate is in.wg/100ft, length is ft
      ductFriction = (criticalDuctLength / 100) * ductFrictionRate;
    }
    
    const totalStaticPressure = ductFriction + fittingLosses + equipmentPressureDrop;

    // Fan Power Calculation
    let fanBHP = 0;
    if (isMetric) {
      fanBHP = (qSupplyActual * totalStaticPressure) / (1000 * fanEfficiency);
    } else {
      fanBHP = (qSupplyActual * totalStaticPressure) / (6356 * fanEfficiency);
    }

    let motorElectricalPower = 0;
    if (isMetric) {
      motorElectricalPower = fanBHP / motorEfficiency;
    } else {
      motorElectricalPower = (fanBHP * 0.7457) / motorEfficiency;
    }

    return {
      qSupplyStandard,
      qSupplyActual,
      totalStaticPressure,
      fanBrakeHorsepower: fanBHP,
      motorElectricalPower,
      status: 'PASS'
    };
  }
}
