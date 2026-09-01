const fs = require('fs');
let file = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');

// Add density methods to Ashrae621Service
const densityMethods = `
  // --- Density Correction Utilities ---

  /** Standard sea level pressure in Pa */
  static STANDARD_PRESSURE_PA = 101325;
  /** Gas constant for dry air in J/(kg·K) */
  static R_AIR = 287.058;
  /** Standard HVAC sea level temperature */
  static STANDARD_TEMP_C = 21.11; // 70 F

  /**
   * Consolidates air density ratio (Eρ) calculation into a single standard utility.
   * Ensures identical elevation adjustments across outdoor, supply, and exhaust logic.
   * @param elevation - Elevation (meters if isMetric, feet otherwise)
   * @param temperature - Temperature (C if isMetric, F otherwise)
   * @param isMetric - True for SI units, False for Imperial
   */
  static getDensityRatio(elevation: number, temperature: number, isMetric: boolean): number {
    const elevationM = isMetric ? elevation : elevation * 0.3048;
    const tempC = isMetric ? temperature : (temperature - 32) * 5 / 9;
    const tempK = tempC + 273.15;
    
    // Standard lapse rate and gravity
    const L = 0.0065; // K/m
    const T0 = 288.15; // Sea level standard temp in K (15 C)
    const g = 9.80665;
    const M = 0.0289644; // Molar mass of dry air kg/mol
    const R0 = 8.3144598; // Universal gas constant
    
    let pressurePa = this.STANDARD_PRESSURE_PA;
    if (elevationM > 0) {
       pressurePa = this.STANDARD_PRESSURE_PA * Math.pow(1 - (L * elevationM) / T0, (g * M) / (R0 * L));
    }
    
    const densityKgM3 = pressurePa / (this.R_AIR * tempK);
    const standardTempK = this.STANDARD_TEMP_C + 273.15;
    const standardDensityKgM3 = this.STANDARD_PRESSURE_PA / (this.R_AIR * standardTempK);
    
    return densityKgM3 / standardDensityKgM3;
  }

  /**
   * Applies density ratio to convert standard flow to actual volumetric flow.
   * Q_actual = Q_standard / densityRatio
   */
  static applyDensityCorrection(standardFlow: number, densityRatio: number): number {
    if (!densityRatio || densityRatio <= 0) return standardFlow;
    return standardFlow / densityRatio;
  }
`;

file = file.replace(/static getSpacesByEdition/, densityMethods + '\n  static getSpacesByEdition');

// Add densityRatio to ZoneVentilationInput
file = file.replace(
  /isMetric: boolean;\s*\}/, 
  'isMetric: boolean;\n  densityRatio?: number;\n}'
);

// Add actual flows to ZoneVentilationResult
file = file.replace(
  /occupancySource: 'design' \| 'default';\s*\}/,
  `occupancySource: 'design' | 'default';\n  vozActual?: number;\n}`
);

// Modify calculateZoneVentilation signature handling
file = file.replace(
  /const { spaceType, area, designOccupancy, useDefaultOccupancy, ezConfig, isMetric } = input;/,
  `const { spaceType, area, designOccupancy, useDefaultOccupancy, ezConfig, isMetric, densityRatio = 1.0 } = input;`
);

file = file.replace(
  /const voz = ez > 0 \? vbz \/ ez : 0;/,
  `const voz = ez > 0 ? vbz / ez : 0;\n    const vozActual = Ashrae621Service.applyDensityCorrection(voz, densityRatio);`
);

file = file.replace(
  /occupancyUsed: pz,\n\s+occupancySource\n\s+\};/,
  `occupancyUsed: pz,\n      occupancySource,\n      vozActual\n    };`
);

// Modify calculateSystemVentilation
file = file.replace(
  /static calculateSystemVentilation\(systemId: string, zones: ZoneVentilationData\[\]\): SystemOutdoorAirRequirements \{/,
  `static calculateSystemVentilation(systemId: string, zones: ZoneVentilationData[], densityRatio: number = 1.0): SystemOutdoorAirRequirements {`
);

file = file.replace(
  /const vot = ev > 0 \? vou \/ ev : 0;/,
  `const vot = ev > 0 ? vou / ev : 0;\n    const votActual = Ashrae621Service.applyDensityCorrection(vot, densityRatio);`
);

// wait we also need to add votActual to SystemOutdoorAirRequirements interface in VentilationModels.ts
fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', file);
