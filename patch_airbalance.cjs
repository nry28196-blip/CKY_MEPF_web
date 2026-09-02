const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/AirBalanceService.ts', 'utf8');

const target1 = `export interface SystemBalanceInput {
  qSupply: number;
  qOutdoorAir: number;
  qReturn: number;
  qExhaust: number;
}`;
const replacement1 = `export interface SystemBalanceInput {
  qSupply: number;
  qOutdoorAir: number;
  qReturn: number;
  qExhaust: number;
  buildingVolume?: number;
  isMetric?: boolean;
}`;

content = content.replace(target1, replacement1);

const target2 = `export interface SystemBalanceResult {
  qRecirculated: number;
  qRelief: number;
  qNetBuilding: number;
  totalExhaustAndRelief: number;
  buildingPressure: 'Positive' | 'Neutral' | 'Negative';
  isValid: boolean;
  warnings: string[];
}`;
const replacement2 = `export interface SystemBalanceResult {
  qRecirculated: number;
  qRelief: number;
  qNetBuilding: number;
  totalExhaustAndRelief: number;
  buildingPressure: 'Positive' | 'Neutral' | 'Negative';
  ach?: number;
  isValid: boolean;
  warnings: string[];
}`;

content = content.replace(target2, replacement2);

const target3 = `    return {
      qRecirculated: Math.max(0, qRecirculated),
      qRelief,
      qNetBuilding,
      totalExhaustAndRelief,
      buildingPressure,
      isValid,
      warnings
    };`;
const replacement3 = `
    let ach = 0;
    if (input.buildingVolume && input.buildingVolume > 0) {
      // Net flow is in CFM or L/s. We want ACH (Air Changes per Hour).
      // If Metric (L/s & m3): ACH = (Net L/s * 3600 / 1000) / m3 = Net L/s * 3.6 / m3
      // If Imperial (CFM & ft3): ACH = (Net CFM * 60) / ft3
      if (input.isMetric) {
        ach = (Math.abs(qNetBuilding) * 3.6) / input.buildingVolume;
      } else {
        ach = (Math.abs(qNetBuilding) * 60) / input.buildingVolume;
      }
    }

    return {
      qRecirculated: Math.max(0, qRecirculated),
      qRelief,
      qNetBuilding,
      totalExhaustAndRelief,
      buildingPressure,
      ach,
      isValid,
      warnings
    };`;

content = content.replace(target3, replacement3);
fs.writeFileSync('src/calculations/ventilation/AirBalanceService.ts', content);
console.log('Patched AirBalanceService');
