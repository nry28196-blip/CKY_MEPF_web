import { AuditTrailItem } from './Ashrae621ZoneService';
import { ValidationStatus } from './VentilationValidationService';

export interface DensityInput {
  elevation: number; // m
  temperature: number; // °C
}

export interface DensityResult {
  elevation: number; // m
  temperature: number; // °C
  pressureAtm: number; // kPa
  density: number; // kg/m³
  eRho: number;
  status: ValidationStatus;
  auditTrail: AuditTrailItem[];
}

export class Ashrae621DensityService {
  static calculateDensityCorrection(input: DensityInput | null): DensityResult {
    const auditTrail: AuditTrailItem[] = [];

    if (!input || isNaN(input.elevation) || isNaN(input.temperature)) {
      // Default to sea level, 20°C standard conditions if missing
      return {
        elevation: 0,
        temperature: 20,
        pressureAtm: 101.325,
        density: 1.2041,
        eRho: 1.0,
        status: 'PASS',
        auditTrail: []
      };
    }

    const { elevation, temperature } = input;
    
    // Barometric pressure equation: P = 101.325 * (1 - 2.25577e-5 * Z)^5.2559
    const pressureAtm = 101.325 * Math.pow(1 - 2.25577e-5 * elevation, 5.2559);
    
    // Ideal gas law for dry air: rho = P / (R_specific * T)
    // R_specific for dry air = 0.287058 kJ/(kg·K)
    // T in Kelvin = temp + 273.15
    const tKelvin = temperature + 273.15;
    const density = pressureAtm / (0.287058 * tKelvin);
    
    // Standard density at sea level, 20°C is ~ 1.2041 kg/m3 (or 1.2 according to ASHRAE standard typical approx)
    const rhoStandard = 1.204;
    const eRho = rhoStandard / density;

    auditTrail.push({
      symbol: 'Eρ',
      name: 'Air Density Factor',
      formula: 'ρ_standard / ρ_actual',
      inputs: {
        'Z (m)': elevation,
        'T (°C)': temperature,
        'ρ_actual (kg/m³)': density,
        'ρ_standard': rhoStandard
      },
      result: eRho,
      unit: '',
      reference: 'ASHRAE 62.1-2025 (Errata) Section 6.2.2.1.2'
    });

    return {
      elevation,
      temperature,
      pressureAtm,
      density,
      eRho,
      status: 'PASS',
      auditTrail
    };
  }
}
