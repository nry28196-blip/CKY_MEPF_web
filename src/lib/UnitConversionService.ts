export function ft2ToM2(sqft: number): number { return sqft * 0.092903; }

export class UnitConversionService {
  // Area
  static ft2ToM2(ft2: number): number { return ft2ToM2(ft2); }
  
  // Airflow
  static cfmToLs(cfm: number): number { return cfm * 0.471947; }
  static lsToCfm(ls: number): number { return ls / 0.471947; }
  static cfmToM3s(cfm: number): number { return cfm * 0.000471947; }
  static m3sToCfm(m3s: number): number { return m3s / 0.000471947; }

  // Length/Elevation
  static ftToM(ft: number): number { return ft * 0.3048; }
  static mToFt(m: number): number { return m / 0.3048; }
  static inToM(inch: number): number { return inch * 0.0254; }
  static mToIn(m: number): number { return m / 0.0254; }

  // Volume
  static ft3ToM3(ft3: number): number { return ft3 * 0.0283168; }
  static m3ToFt3(m3: number): number { return m3 / 0.0283168; }

  // Temperature
  static fToC(f: number): number { return (f - 32) * (5 / 9); }
  static cToF(c: number): number { return (c * 9 / 5) + 32; }

  // Composite
  static cfmFt2ToLsM2(cfmFt2: number): number { return cfmFt2 * 5.08; }
  static lsM2ToCfmFt2(lsM2: number): number { return lsM2 / 5.08; }

  // Velocity
  static fpmToMs(fpm: number): number { return fpm * 0.00508; }
  static msToFpm(ms: number): number { return ms / 0.00508; }

  // Pressure
  static inWgToPa(inwg: number): number { return inwg * 249.0889; }
  static paToInWg(pa: number): number { return pa / 249.0889; }

  // Density
  static lbFt3ToKgM3(lbft3: number): number { return lbft3 * 16.0185; }
  static kgM3ToLbFt3(kgm3: number): number { return kgm3 / 16.0185; }
}
