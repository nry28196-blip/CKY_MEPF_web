const fs = require('fs');

let service = fs.readFileSync('src/calculations/ventilation/SystemPerformanceService.ts', 'utf8');

const targetService = `export interface SystemPerformanceResult {
  qSupplyStandard: number; // Standard airflow
  qSupplyActual: number; // Density-corrected airflow
  totalStaticPressure: number; // TSP in in.wg. or Pa
  fanBrakeHorsepower: number; // BHP (Imperial) or Shaft kW (Metric)
  motorElectricalPower: number; // Total electrical kW
}`;
const replaceService = `export interface SystemPerformanceResult {
  qSupplyStandard: number; // Standard airflow
  qSupplyActual: number; // Density-corrected airflow
  totalStaticPressure: number; // TSP in in.wg. or Pa
  fanBrakeHorsepower: number; // BHP (Imperial) or Shaft kW (Metric)
  motorElectricalPower: number; // Total electrical kW
  turndownAirflow?: number;
  turndownStaticPressure?: number;
  turndownMotorElectricalPower?: number;
}`;
service = service.replace(targetService, replaceService);

const targetReturn = `    return {
      qSupplyStandard,
      qSupplyActual,
      totalStaticPressure,
      fanBrakeHorsepower,
      motorElectricalPower
    };`;
const replaceReturn = `    // 5. Fan Affinity Law Calculation (VFD Turndown Example - default 50% flow)
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
    };`;
service = service.replace(targetReturn, replaceReturn);
fs.writeFileSync('src/calculations/ventilation/SystemPerformanceService.ts', service);
console.log("Patched SystemPerformanceService");
