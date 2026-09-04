export interface DensityProperties {
  atmosphericPressure: number; // kPa
  actualDensity: number; // kg/m3
  standardDensity: number; // kg/m3
  erho: number; // 62.1-2025 Erho
}

export class Ashrae621DensityService {
  static getDensityProperties(elevationMeters: number, tempC: number): DensityProperties {
    // Atmospheric pressure in kPa
    const pAtm = 101.325 * Math.pow(1 - 2.25577e-5 * elevationMeters, 5.2559);
    
    // Gas constant for dry air in J/(kg*K)
    const R_da = 287.058;
    
    // Temperature in Kelvin
    const T_K = tempC + 273.15;
    
    // Density of dry air (kg/m3)
    const densityActual = (pAtm * 1000) / (R_da * T_K);
    
    // Standard conditions: 101.325 kPa, 20°C (293.15 K) or 21.1°C (70°F)? 
    // Usually standard air density is 1.204 kg/m3 at 20°C or 1.225 kg/m3 at 15°C.
    // ASHRAE standard air is 1.204 kg/m3 (dry air at 20°C, 101.325 kPa).
    const standardDensity = 1.2041; 

    // Erho = standard_density / actual_density
    const erho = standardDensity / densityActual;

    return {
      atmosphericPressure: pAtm,
      actualDensity: densityActual,
      standardDensity: standardDensity,
      erho: erho
    };
  }
}
