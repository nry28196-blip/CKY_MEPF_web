import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae622Coefficients } from '../../data/ventilation/ashrae622/2025/data';

export interface Ashrae622WholeDwellingInput {
  floorArea: number; // m2
  bedrooms: number;
  infiltrationCredit: number | null; // L/s
  infiltrationVerified: boolean;
  coefficients: Ashrae622Coefficients;
}

export interface Ashrae622WholeDwellingResult {
  qTot: number; // L/s
  qInf: number; // L/s
  qFan: number; // L/s
  status: ValidationStatus;
}

export class Ashrae622Service {
  static calculateWholeDwelling(input: Ashrae622WholeDwellingInput): Ashrae622WholeDwellingResult {
    if (input.floorArea < 0 || isNaN(input.floorArea) || input.bedrooms < 0 || isNaN(input.bedrooms)) {
      return { qTot: 0, qInf: 0, qFan: 0, status: 'FAIL' };
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

    // Qfan = Qtot - Qinf (must be >= 0)
    let qFan = qTot - qInf;
    if (qFan < 0) qFan = 0;

    return {
      qTot,
      qInf,
      qFan,
      status
    };
  }
}
