import { ValidationStatus } from '../calculations/ventilation/VentilationValidationService';
import { AuditTrailItem } from '../calculations/ventilation/Ashrae621ZoneService';

export interface DensityInput {
  elevation: number | null; // meters
  temperature: number | null; // °C
  relativeHumidity?: number; // %, defaults to 0 (dry air) if omitted
}

export interface DensityResult {
  elevation: number;
  temperature: number;
  relativeHumidity: number;
  pressureAtm: number; // kPa
  density: number; // kg/m³
  humidityRatioKgKg: number;
  eRho: number;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class DensityCorrectionService {
  static STANDARD_PRESSURE_KPA = 101.325;
  static STANDARD_TEMP_C = 20.0;
  static R_DRY_AIR_KJ = 0.287058;
  static R_VAPOR_KJ = 0.461495;
  static STANDARD_DENSITY = 1.204; // kg/m³, dry air at 20°C, 101.325 kPa per ASHRAE 62.1

  /**
   * Calculates air density and Eρ (Density Correction Factor)
   * Eρ = ρ_standard / ρ_actual
   */
  static calculate(input: DensityInput | null): DensityResult {
    const auditTrail: AuditTrailItem[] = [];
    
    let elevation = 0;
    let temperature = 20.0;
    let rh = 0;
    let status: ValidationStatus = 'PASS';

    // Check for missing data
    if (!input || input.elevation === null || input.temperature === null || 
        isNaN(input.elevation) || isNaN(input.temperature)) {
      status = 'WARNING';
      auditTrail.push({
        symbol: 'Assumed Data',
        name: 'Missing Density Inputs',
        formula: 'Default to Sea Level, 20°C',
        inputs: {},
        result: 'ASSUMED',
        unit: '',
        reference: 'Missing site elevation or design temperature'
      });
    } else {
      elevation = input.elevation;
      temperature = input.temperature;
      rh = input.relativeHumidity && !isNaN(input.relativeHumidity) ? input.relativeHumidity : 0;
    }

    // Barometric pressure equation: P = 101.325 * (1 - 2.25577e-5 * Z)^5.2559
    const pressureAtm = this.STANDARD_PRESSURE_KPA * Math.pow(1 - 2.25577e-5 * elevation, 5.2559);
    
    const tKelvin = temperature + 273.15;
    
    let pv = 0;
    if (rh > 0) {
      let psat = 0;
      if (temperature >= 0) {
        psat = 0.61078 * Math.exp((17.27 * temperature) / (temperature + 237.3)); // kPa
      } else {
        psat = 0.61078 * Math.exp((21.875 * temperature) / (temperature + 265.5)); // kPa
      }
      const rhFraction = Math.max(0, Math.min(100, rh)) / 100;
      pv = rhFraction * psat;
    }
    
    const pd = pressureAtm - pv;
    const density = (pd / (this.R_DRY_AIR_KJ * tKelvin)) + (pv / (this.R_VAPOR_KJ * tKelvin));
    const humidityRatioKgKg = pd > 0 ? 0.621945 * (pv / pd) : 0;
    
    const eRho = this.STANDARD_DENSITY / density;

    auditTrail.push({
      symbol: 'Eρ',
      name: 'Air Density Factor',
      formula: 'ρ_standard / ρ_actual',
      inputs: {
        'Z (m)': elevation,
        'T (°C)': temperature,
        'ρ_actual (kg/m³)': density,
        'ρ_standard': this.STANDARD_DENSITY
      },
      result: eRho,
      unit: '',
      reference: 'ASHRAE 62.1-2025 Section 6.2.4.4 (Errata)'
    });

    return {
      elevation,
      temperature,
      relativeHumidity: rh,
      pressureAtm,
      density,
      humidityRatioKgKg,
      eRho,
      status,
      auditTrail
    };
  }

  /**
   * Compatibility adapter for legacy AirDensityService usages
   */
  static getAirProperties(elevationM: number, temperatureC: number, relativeHumidity: number = 0) {
    const res = this.calculate({
        elevation: elevationM,
        temperature: temperatureC,
        relativeHumidity: relativeHumidity
    });
    
    return {
        elevationM: res.elevation,
        temperatureC: res.temperature,
        relativeHumidity: res.relativeHumidity,
        pressurePa: res.pressureAtm * 1000,
        densityKgM3: res.density,
        densityRatio: res.eRho,
        standardDensityKgM3: this.STANDARD_DENSITY,
        humidityRatioKgKg: res.humidityRatioKgKg
    };
  }
}
