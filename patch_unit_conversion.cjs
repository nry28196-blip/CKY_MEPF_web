const fs = require('fs');

const unitService = `export class UnitConversionService {
  static sqftToSqM(sqft: number): number { return sqft * 0.092903; }
  static sqMToSqft(sqm: number): number { return sqm / 0.092903; }
  
  static cfmToLs(cfm: number): number { return cfm * 0.471947; }
  static lsToCfm(ls: number): number { return ls / 0.471947; }
  
  static fToC(f: number): number { return (f - 32) * 5 / 9; }
  static cToF(c: number): number { return c * 9 / 5 + 32; }
  
  static ftToM(ft: number): number { return ft * 0.3048; }
  static mToFt(m: number): number { return m / 0.3048; }

  static cfmSqFtToLsSqM(cfmSqFt: number): number { return cfmSqFt * 5.08; }
  static lsSqMToCfmSqFt(lsSqM: number): number { return lsSqM / 5.08; }
}
`;
fs.writeFileSync('src/calculations/services/UnitConversionService.ts', unitService);
