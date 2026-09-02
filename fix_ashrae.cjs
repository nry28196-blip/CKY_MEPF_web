const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');

// The block to remove:
const toRemove = `  /**
   * Consolidates air density ratio (Eρ) calculation into a single standard utility.
   * Ensures identical elevation adjustments across outdoor, supply, and exhaust logic.
   * @param elevation - Elevation (meters if isMetric, feet otherwise)
   * @param temperature - Temperature (C if isMetric, F otherwise)
   * @param isMetric - True for SI units, False for Imperial
   */      
    const densityKgM3 = pressurePa / (this.R_AIR * tempK);
    const standardTempK = this.STANDARD_TEMP_C + 273.15;
    const standardDensityKgM3 = this.STANDARD_PRESSURE_PA / (this.R_AIR * standardTempK);
    
    return densityKgM3 / standardDensityKgM3;
  }`;

// Actually, let's just use regex to remove everything from `/** Consolidates air density` up to `return densityKgM3 / standardDensityKgM3;\n  }`

code = code.replace(/\/\*\*[\s\S]*?return densityKgM3 \/ standardDensityKgM3;\n  \}/, '');

fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', code);
console.log("Fixed");
