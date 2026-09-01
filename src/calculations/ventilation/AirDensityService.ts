export interface AirProperties {
  elevationM: number;
  temperatureC: number;
  absoluteTemperatureK: number;
  pressurePa: number;
  standardPressurePa: number;
  densityKgM3: number;
  densityRatio: number; // Ratio of actual density to standard density
  standardDensityKgM3: number;
}

export class AirDensityService {
  /**
   * Standard sea level pressure in Pa
   */
  static STANDARD_PRESSURE_PA = 101325;
  
  /**
   * Standard sea level temperature in C (for HVAC standard air)
   * Note: ASHRAE standard air is often defined at 20°C or 21.1°C (70°F) 
   * and 101.325 kPa dry air.
   * Let's use 20°C as standard metric, 70°F as standard imperial.
   */
  static STANDARD_TEMP_C = 21.11; // 70 F
  
  /**
   * Gas constant for dry air in J/(kg·K)
   */
  static R_AIR = 287.058;

  /**
   * Calculates air properties based on elevation and temperature.
   * Assumes dry air for simplicity (standard HVAC assumption for density correction unless psychrometrics is needed).
   */
  static getAirProperties(elevationM: number, temperatureC: number): AirProperties {
    // 1. Calculate Atmospheric Pressure at Elevation
    // Barometric formula: P = P0 * (1 - L * h / T0) ^ (g * M / (R * L))
    // Simplified standard atmosphere for troposphere:
    const tempK = temperatureC + 273.15;
    
    // Standard lapse rate and gravity
    const L = 0.0065; // K/m
    const T0 = 288.15; // Sea level standard temp in K (15°C)
    const g = 9.80665;
    const M = 0.0289644; // Molar mass of dry air kg/mol
    const R0 = 8.3144598; // Universal gas constant
    
    let pressurePa = AirDensityService.STANDARD_PRESSURE_PA;
    if (elevationM > 0) {
       pressurePa = AirDensityService.STANDARD_PRESSURE_PA * Math.pow(1 - (L * elevationM) / T0, (g * M) / (R0 * L));
    }

    // 2. Calculate Density (Ideal Gas Law: rho = P / (R_specific * T))
    const densityKgM3 = pressurePa / (AirDensityService.R_AIR * tempK);
    
    // 3. Calculate Standard Density
    const standardTempK = AirDensityService.STANDARD_TEMP_C + 273.15;
    const standardDensityKgM3 = AirDensityService.STANDARD_PRESSURE_PA / (AirDensityService.R_AIR * standardTempK);

    // 4. Density Ratio
    const densityRatio = densityKgM3 / standardDensityKgM3;

    return {
      elevationM,
      temperatureC,
      absoluteTemperatureK: tempK,
      pressurePa,
      standardPressurePa: AirDensityService.STANDARD_PRESSURE_PA,
      densityKgM3,
      densityRatio,
      standardDensityKgM3
    };
  }

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
