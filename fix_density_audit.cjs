const fs = require('fs');
let code = fs.readFileSync('src/calculations/services/AirDensityService.ts', 'utf-8');

code = code.replace(
  "  static removeDensityCorrection(actualFlow: number, erho: number): number {\n    if (!erho || erho <= 0) return actualFlow;\n    return actualFlow / erho;\n  }",
  `  static removeDensityCorrection(actualFlow: number, erho: number): number {
    if (!erho || erho <= 0) return actualFlow;
    return actualFlow / erho;
  }
  
  static getDensityAuditTrail(densityRatio: number, isMetric: boolean): any[] {
    return [
      {
        symbol: 'Eρ',
        name: 'Density Ratio',
        formula: 'ρ_standard / ρ_actual',
        value: densityRatio.toFixed(3),
        unit: ''
      },
      {
        symbol: 'Vot_actual',
        name: 'Density Corrected Required Outdoor Air',
        formula: 'Vot_standard × Eρ',
        value: undefined, // this needs to be populated by the caller
        unit: isMetric ? 'L/s' : 'CFM'
      }
    ];
  }`
);

fs.writeFileSync('src/calculations/services/AirDensityService.ts', code);
