import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae622Coefficients } from '../../data/ventilation/ashrae622/2025/data';

export interface LocalExhaustInput {
  kitchenRequired: number | null; // L/s
  kitchenInstalled: number | null; // L/s
  bathRequired: number | null; // L/s
  bathInstalled: number | null; // L/s
}

export interface Ashrae622WholeDwellingInput {
  floorArea: number; // m2
  bedrooms: number;
  infiltrationCredit: number | null; // L/s
  infiltrationVerified: boolean;
  localExhaust: LocalExhaustInput | null;
  coefficients: Ashrae622Coefficients;
}

export interface Ashrae622WholeDwellingResult {
  qTot: number | null; // L/s
  qInf: number | null; // L/s
  qDeficit: number | null; // L/s
  qFan: number | null; // L/s
  status: ValidationStatus;
}

export class Ashrae622Service {
  static calculateWholeDwelling(input: Ashrae622WholeDwellingInput): Ashrae622WholeDwellingResult {
    if (input.floorArea < 0 || isNaN(input.floorArea) || input.bedrooms < 0 || isNaN(input.bedrooms)) {
      return { qTot: null, qInf: null, qDeficit: null, qFan: null, status: 'FAIL' };
    }

    // SI units formula using provided coefficients
    const qTot = input.coefficients.areaCoefficientSI * input.floorArea + input.coefficients.occupancyCoefficientSI * (input.bedrooms + 1);
    
    let qInf = 0;
    let status: ValidationStatus = 'PASS';

    if (input.infiltrationCredit !== null && !isNaN(input.infiltrationCredit)) {
      if (!input.infiltrationVerified && input.infiltrationCredit > 0) {
        status = 'WARNING';
        qInf = 0; // Credit cannot be applied if unverified
      } else {
        qInf = input.infiltrationCredit;
      }
    } else {
        // Assume zero if credit isn't provided, but it's optional so PASS
        qInf = 0; 
    }
    
    let qDeficit = 0;
    if (input.localExhaust) {
        if (input.localExhaust.kitchenRequired === null || input.localExhaust.kitchenInstalled === null || 
            input.localExhaust.bathRequired === null || input.localExhaust.bathInstalled === null ||
            isNaN(input.localExhaust.kitchenRequired) || isNaN(input.localExhaust.kitchenInstalled) ||
            isNaN(input.localExhaust.bathRequired) || isNaN(input.localExhaust.bathInstalled)) {
            return { qTot: null, qInf: null, qDeficit: null, qFan: null, status: 'INCOMPLETE' };
        }
        
      const kitchenDeficit = (input.localExhaust.kitchenRequired - input.localExhaust.kitchenInstalled) > 0 ? (input.localExhaust.kitchenRequired - input.localExhaust.kitchenInstalled) : 0;
      const bathDeficit = (input.localExhaust.bathRequired - input.localExhaust.bathInstalled) > 0 ? (input.localExhaust.bathRequired - input.localExhaust.bathInstalled) : 0;
      qDeficit = input.coefficients.localExhaustDeficitCoefficient * (kitchenDeficit + bathDeficit);
    }

    // Qfan = Qtot - Qinf + Qdeficit (must be >= 0)
    let qFan = qTot - qInf + qDeficit;
    if (qFan < 0) qFan = 0;

    return {
      qTot,
      qInf,
      qDeficit,
      qFan,
      status
    };
  }
}
