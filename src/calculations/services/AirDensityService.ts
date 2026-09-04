export interface AirProperties {
  elevationM: number;
  temperatureC: number;
  relativeHumidity: number;
  absoluteTemperatureK: number;
  pressurePa: number;
  standardPressurePa: number;
  densityKgM3: number;
  densityRatio: number; // 62.1-2025 Erho (Standard Density / Actual Density)
  standardDensityKgM3: number;
  humidityRatioKgKg: number;
}

export class AirDensityService {
  static STANDARD_PRESSURE_PA = 101325;
  
  // ASHRAE standard air: 20°C (68°F) or 21.1°C (70°F) dry air at 101.325 kPa.
  // 1.204 kg/m3 is standard for 20°C.
  static STANDARD_TEMP_C = 20.0; 
  static R_DRY_AIR = 287.058;
  static R_VAPOR = 461.495;

  static getAirProperties(elevationM: number, temperatureC: number, relativeHumidity: number = 0): AirProperties {
    const tempK = temperatureC + 273.15;
    
    // Barometric formula
    const L = 0.0065; // K/m
    const T0 = 288.15; // Sea level standard temp in K (15°C)
    const g = 9.80665;
    const M = 0.0289644; 
    const R0 = 8.3144598; 
    
    let pressurePa = AirDensityService.STANDARD_PRESSURE_PA;
    if (elevationM > 0) {
       pressurePa = AirDensityService.STANDARD_PRESSURE_PA * Math.pow(1 - (L * elevationM) / T0, (g * M) / (R0 * L));
    }

    let psat = 0;
    if (temperatureC >= 0) {
      psat = 610.78 * Math.exp((17.27 * temperatureC) / (temperatureC + 237.3));
    } else {
      psat = 610.78 * Math.exp((21.875 * temperatureC) / (temperatureC + 265.5));
    }

    const rhFraction = Math.max(0, Math.min(100, relativeHumidity)) / 100;
    const pv = rhFraction * psat; 
    const pd = pressurePa - pv;   

    const densityKgM3 = (pd / (AirDensityService.R_DRY_AIR * tempK)) + (pv / (AirDensityService.R_VAPOR * tempK));
    
    const standardTempK = AirDensityService.STANDARD_TEMP_C + 273.15;
    const standardDensityKgM3 = AirDensityService.STANDARD_PRESSURE_PA / (AirDensityService.R_DRY_AIR * standardTempK);

    // Erho (Air Density Correction Factor) = Standard Density / Actual Density
    // Required because you need a higher actual volume of air to deliver the standard mass flow.
    const erho = standardDensityKgM3 / densityKgM3;

    const humidityRatioKgKg = pd > 0 ? 0.621945 * (pv / pd) : 0;

    return {
      humidityRatioKgKg,
      elevationM,
      temperatureC,
      relativeHumidity,
      absoluteTemperatureK: tempK,
      pressurePa,
      standardPressurePa: AirDensityService.STANDARD_PRESSURE_PA,
      densityKgM3,
      densityRatio: erho, // Erho
      standardDensityKgM3
    };
  }

  static applyDensityCorrection(vou: number, erho: number): number {
    if (!erho || erho <= 0) return vou;
    // According to 62.1-2025: Vot = (Vou / Ev) * Erho
    // So actual flow = standard flow * Erho
    return vou * erho; 
  }

  static removeDensityCorrection(actualFlow: number, erho: number): number {
    if (!erho || erho <= 0) return actualFlow;
    return actualFlow / erho;
  }
}
