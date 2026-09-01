const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/AirDensityService.ts', 'utf8');

if (!code.includes('correctVolumetricFlow')) {
  code = code.replace(/}(\s*)$/, `
  /**
   * Converts standard volumetric airflow to actual volumetric airflow at elevation.
   * Q_actual = Q_standard / densityRatio
   */
  static applyDensityCorrection(standardFlow: number, densityRatio: number): number {
    if (densityRatio <= 0) return standardFlow;
    return standardFlow / densityRatio;
  }

  /**
   * Converts actual volumetric airflow to standard volumetric airflow.
   * Q_standard = Q_actual * densityRatio
   */
  static removeDensityCorrection(actualFlow: number, densityRatio: number): number {
    return actualFlow * densityRatio;
  }
}
`);
  fs.writeFileSync('src/calculations/ventilation/AirDensityService.ts', code);
}
