export class UnitConversionService {
  // Area
  static ft2ToM2(ft2: number): number {
    return ft2 * 0.092903;
  }
  
  static m2ToFt2(m2: number): number {
    return m2 / 0.092903;
  }

  // Airflow
  static cfmToLs(cfm: number): number {
    return cfm * 0.471947;
  }
  
  static lsToCfm(ls: number): number {
    return ls / 0.471947;
  }

  // Length/Elevation
  static ftToM(ft: number): number {
    return ft * 0.3048;
  }
  
  static mToFt(m: number): number {
    return m / 0.3048;
  }

  // Volume
  static ft3ToM3(ft3: number): number {
    return ft3 * 0.0283168;
  }
  
  static m3ToFt3(m3: number): number {
    return m3 / 0.0283168;
  }

  // Temperature
  static fToC(f: number): number {
    return (f - 32) * (5 / 9);
  }
  
  static cToF(c: number): number {
    return (c * 9 / 5) + 32;
  }
}
