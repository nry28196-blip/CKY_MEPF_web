import { ValidationStatus } from '../calculations/ventilation/VentilationValidationService';
import { AuditTrailItem } from '../calculations/ventilation/Ashrae621ZoneService';

export interface DensityInput {
  elevation: number | null; // meters
  temperature: number | null; // °C
  relativeHumidity?: number; // %, defaults to 0 (dry air) if omitted
  edition?: '2019' | '2022' | '2025';
  method?: 'TABLE' | 'ANALYTICAL';
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
  static STANDARD_PRESSURE_KPA = 101.3;
  static STANDARD_TEMP_C = 21.0;
  static R_DRY_AIR_KJ = 0.287058;
  static R_VAPOR_KJ = 0.461495;
  static STANDARD_DENSITY = 1.2; // kg/m³, dry air at 21°C, 101.3 kPa per ASHRAE 62.1 Addendum j

  static getTableERho(elevation: number): number | null {
    if (elevation <= 158) return 1.00;
    if (elevation <= 566) return 1.05;
    if (elevation <= 951) return 1.10;
    if (elevation <= 1317) return 1.15;
    if (elevation <= 1664) return 1.20;
    if (elevation <= 1994) return 1.25;
    if (elevation <= 2309) return 1.30;
    if (elevation <= 2609) return 1.35;
    if (elevation <= 2897) return 1.40;
    if (elevation <= 3173) return 1.45;
    if (elevation <= 3437) return 1.50;
    return null; // Above 3437m requires Appendix D
  }

  static calculate(input: DensityInput | null): DensityResult {
    const auditTrail: AuditTrailItem[] = [];
    
    let elevation = 0;
    let temperature = 21.0;
    let rh = 0;
    let status: ValidationStatus = 'PASS';

    if (!input || input.elevation === null || input.temperature === null) {
      status = 'INCOMPLETE';
      auditTrail.push({
        symbol: 'Assumed Data',
        name: 'Missing Density Inputs',
        formula: 'Default to Sea Level, 21°C',
        inputs: {},
        result: 'ASSUMED',
        unit: '',
        reference: 'Missing site elevation or design temperature'
      });
    } else if (isNaN(input.elevation) || isNaN(input.temperature) || !isFinite(input.temperature) || input.temperature <= -273.15) {
      status = 'FAIL';
      auditTrail.push({
        symbol: 'T',
        name: 'Invalid Temperature or Elevation',
        formula: 'T(K) > 0',
        inputs: { 'T (°C)': input.temperature, 'Z (m)': input.elevation },
        result: 'FAIL',
        unit: '',
        reference: 'Invalid numeric input'
      });
      return { elevation: input.elevation || 0, temperature: input.temperature || 0, relativeHumidity: 0, pressureAtm: 0, density: 0, humidityRatioKgKg: 0, eRho: 1.0, status, auditTrail };
    } else if (!isFinite(input.elevation)) {
      status = 'FAIL';
      auditTrail.push({
        symbol: 'Z',
        name: 'Invalid Elevation',
        formula: 'Z must be finite',
        inputs: { 'Z (m)': input.elevation },
        result: 'FAIL',
        unit: '',
        reference: 'Validation'
      });
      return { elevation: input.elevation, temperature: input.temperature, relativeHumidity: 0, pressureAtm: 0, density: 0, humidityRatioKgKg: 0, eRho: 1.0, status, auditTrail };
    } else {
      elevation = input.elevation;
      temperature = input.temperature;
      rh = input.relativeHumidity && !isNaN(input.relativeHumidity) ? input.relativeHumidity : 0;
    }

    const method = input?.method || 'TABLE';

    // Barometric pressure calculation
    // Note: ASHRAE 62.1-2022 Addendum j Erratum (May 14, 2024) corrected the Eq D-1b CZ formula.
    // Our pressure reduction uses the standard ISA model which aligns with the corrected 1 / (1 - Z*2.25577e-5)^5.2559 ratio.
    const pressureAtm = this.STANDARD_PRESSURE_KPA * Math.pow(1 - 2.25577e-5 * elevation, 5.2559);
    
    // Humidity ratio W calculation
    const tKelvin = temperature + 273.15;
    let pv = 0;
    let humidityRatioKgKg = 0;
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
    const dryAirDensity = pd / (this.R_DRY_AIR_KJ * tKelvin); // Dry-air density per ASHRAE 62.1 Addendum j Appendix D (D-5b)
    if (pd > 0) {
      humidityRatioKgKg = 0.621945 * (pv / pd);
    }

    let eRho = 1.0;

    if (method === 'TABLE') {
      const tableERho = this.getTableERho(elevation);
      if (tableERho !== null) {
        eRho = tableERho;
        auditTrail.push({
          symbol: 'Eρ',
          name: 'Air Density Factor (Table)',
          formula: 'Table 6-5 Lookup',
          inputs: { 'Z (m)': elevation },
          result: eRho,
          unit: '',
          reference: 'ASHRAE 62.1 Addendum j Table 6-5'
        });
      } else {
        // Fallback to Analytical if above 3437m
        auditTrail.push({
          symbol: 'Table Limit',
          name: 'Elevation above Table 6-5',
          formula: 'Z > 3437m, fallback to Appendix D',
          inputs: { 'Z (m)': elevation },
          result: 'FALLBACK',
          unit: '',
          reference: 'ASHRAE 62.1 Addendum j Table 6-5 Note'
        });
        eRho = this.STANDARD_DENSITY / dryAirDensity;
        auditTrail.push({
          symbol: 'Eρ',
          name: 'Air Density Factor (Analytical)',
          formula: '1.2 / ρ_da',
          inputs: { 'Z (m)': elevation, 'T (°C)': temperature, 'ρ_da (kg_da/m³)': dryAirDensity, 'ρ_standard': this.STANDARD_DENSITY },
          result: eRho,
          unit: '',
          reference: 'ASHRAE 62.1 Addendum j Normative Appendix D (Eq D-5b)'
        });
      }
    } else {
      eRho = this.STANDARD_DENSITY / dryAirDensity;
      auditTrail.push({
        symbol: 'Eρ',
        name: 'Air Density Factor (Analytical)',
        formula: '1.2 / ρ_da',
        inputs: { 'Z (m)': elevation, 'T (°C)': temperature, 'W (kg/kg)': humidityRatioKgKg, 'ρ_da (kg_da/m³)': dryAirDensity, 'ρ_standard': this.STANDARD_DENSITY },
        result: eRho,
        unit: '',
        reference: 'ASHRAE 62.1 Addendum j Normative Appendix D (Eq D-5b)'
      });
    }

    return {
      elevation,
      temperature,
      relativeHumidity: rh,
      pressureAtm,
      density: dryAirDensity,
      humidityRatioKgKg,
      eRho,
      status,
      auditTrail
    };
  }

  static getAirProperties(elevationM: number, temperatureC: number, relativeHumidity: number = 0) {
    const res = this.calculate({
        elevation: elevationM,
        temperature: temperatureC,
        relativeHumidity: relativeHumidity,
        method: 'ANALYTICAL'
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
