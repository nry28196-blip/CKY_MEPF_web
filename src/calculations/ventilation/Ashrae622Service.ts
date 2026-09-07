import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae622Coefficients } from '../../data/ventilation/ashrae622/2025/data';

export interface LocalExhaustInput {
  kitchenRequired: number; // L/s
  kitchenInstalled: number; // L/s
  bathRequired: number; // L/s
  bathInstalled: number; // L/s
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

    if (input.infiltrationCredit !== null && input.infiltrationCredit > 0) {
      if (!input.infiltrationVerified) {
        status = 'WARNING'; // Credit not verified
      } else {
        qInf = input.infiltrationCredit;
      }
    }
    
    let qDeficit = 0;
    if (input.localExhaust) {
      const kitchenDeficit = Math.max(0, input.localExhaust.kitchenRequired - input.localExhaust.kitchenInstalled);
      const bathDeficit = Math.max(0, input.localExhaust.bathRequired - input.localExhaust.bathInstalled);
      qDeficit = 0.25 * (kitchenDeficit + bathDeficit);
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
