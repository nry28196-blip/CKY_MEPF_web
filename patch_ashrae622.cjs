const fs = require('fs');

const code = `import { ASHRAE_62_2_DATA } from '../data/ashrae622/Ashrae622Data';
import { UnitConversionService } from '../services/UnitConversionService';

export interface Ashrae622Input {
  localExhaustDeficit?: number;
  floorArea: number; // Unit depends on isMetric
  bedrooms: number;
  isMetric: boolean;
  qInf: number; // Unit depends on isMetric
  qInfSource?: string;
  qReq?: number; // Unit depends on isMetric
  phi: number;
  edition: '2019' | '2022' | '2025';
}

export interface Ashrae622Result {
  qTot: number;
  qFan: number;
  qInf: number;
  phi: number;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
  error?: string;
  infiltrationCredit: number;
  notEvaluatedItems: string[];
}

export class Ashrae622Service {
  static calculateVentilation(input: Ashrae622Input): Ashrae622Result {
    // 1. Convert inputs to Canonical Metric if they are Imperial
    const canonicalArea = input.isMetric ? input.floorArea : UnitConversionService.sqftToSqM(input.floorArea);
    const canonicalQInf = input.isMetric ? input.qInf : UnitConversionService.cfmToLs(input.qInf);
    const canonicalQReq = input.isMetric ? (input.qReq ?? 0) : UnitConversionService.cfmToLs(input.qReq ?? 0);
    const canonicalDeficit = input.localExhaustDeficit !== undefined 
      ? (input.isMetric ? input.localExhaustDeficit : UnitConversionService.cfmToLs(input.localExhaustDeficit))
      : undefined;

    // 2. Perform Canonical Metric Calculation (L/s, m²)
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;
    let error = undefined;
    const notEvaluatedItems: string[] = [];

    // Qtot Metric: 0.15 * m² + 3.5 * (bedrooms + 1)
    let qTotMetric = 0.15 * canonicalArea + 3.5 * (input.bedrooms + 1);
    
    const effectiveInfiltrationMetric = canonicalQInf - canonicalQReq;
    let infiltrationCreditMetric = 0;
    
    if (canonicalQInf > 0) {
      if (!input.qInfSource || input.qInfSource.trim() === '') {
         status = 'WARNING';
         warning = 'Infiltration credit used without specifying a source/basis (e.g., blower door test). Credit applicability unverified.';
      }
      if (input.edition === '2025') {
        notEvaluatedItems.push('2025 Strict Infiltration Verification');
      }
      infiltrationCreditMetric = effectiveInfiltrationMetric > 0 ? input.phi * effectiveInfiltrationMetric : 0;
    }
    
    if (input.edition === '2025') {
        notEvaluatedItems.push('Filtration Requirements');
        notEvaluatedItems.push('Intake/Exhaust Separation');
        notEvaluatedItems.push('Ozone-related Requirements');
    }
    
    if (canonicalDeficit === undefined) {
      status = 'INCOMPLETE';
      warning = (warning ? warning + ' ' : '') + 'Local exhaust deficit parameter is undefined.';
      return {
        qTot: input.isMetric ? qTotMetric : UnitConversionService.lsToCfm(qTotMetric),
        qFan: 0, 
        qInf: input.qInf, 
        phi: input.phi,
        status, 
        warning, 
        infiltrationCredit: input.isMetric ? infiltrationCreditMetric : UnitConversionService.lsToCfm(infiltrationCreditMetric),
        notEvaluatedItems
      };
    }

    const qFanMetric = Math.max(0, qTotMetric + canonicalDeficit - infiltrationCreditMetric);
    
    // 3. Convert results back to Imperial if needed
    const qTot = input.isMetric ? qTotMetric : UnitConversionService.lsToCfm(qTotMetric);
    const qFan = input.isMetric ? qFanMetric : UnitConversionService.lsToCfm(qFanMetric);
    const infiltrationCredit = input.isMetric ? infiltrationCreditMetric : UnitConversionService.lsToCfm(infiltrationCreditMetric);

    return {
      qTot,
      qFan,
      qInf: input.qInf,
      phi: input.phi,
      status,
      warning,
      error,
      infiltrationCredit,
      notEvaluatedItems
    };
  }

  static getLocalExhaustRequirements(edition: '2019' | '2022' | '2025', isMetric: boolean) {
    const data = ASHRAE_62_2_DATA[edition];
    
    const convert = (val: number | null) => {
       if (val === null) return null;
       // data is stored in Imperial natively (cfm)
       return isMetric ? Math.ceil(UnitConversionService.cfmToLs(val)) : val;
    };

    return {
       kitchenIntermittent: convert(data.kitchenIntermittent),
       kitchenContinuousACH: data.kitchenContinuousACH, 
       bathroomIntermittent: convert(data.bathroomIntermittent),
       bathroomContinuous: convert(data.bathroomContinuous),
       toiletRoomIntermittent: convert(data.toiletRoomIntermittent),
       toiletRoomContinuous: convert(data.toiletRoomContinuous),
    };
  }
}
`;
fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', code);
