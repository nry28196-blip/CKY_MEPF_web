import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
import { Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/2025/data';

export interface ExhaustInput {
  exhaustType: Ashrae621ExhaustType | null;
  qty: number | null; // Quantity depending on unitType
  designExhaust: number | null; // User's design value
}

export interface ExhaustResult {
  requiredExhaust: number; // L/s
  designExhaust: number; // L/s
  unitType: string;
  exhaustClass: number;
  status: ValidationStatus;
}

export class Ashrae621ExhaustService {
  static calculate(input: ExhaustInput): ExhaustResult {
    if (!input.exhaustType) {
      return { requiredExhaust: 0, designExhaust: 0, unitType: 'unknown', exhaustClass: 1, status: 'INCOMPLETE' };
    }

    if (input.qty === null || isNaN(input.qty)) {
      return { requiredExhaust: 0, designExhaust: 0, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'INCOMPLETE' };
    }
    if (input.qty < 0) {
      return { requiredExhaust: 0, designExhaust: 0, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'FAIL' };
    }

    const requiredExhaust = input.exhaustType.rate * input.qty;
    const designExhaust = input.designExhaust !== null && !isNaN(input.designExhaust) ? input.designExhaust : 0;
    
    let status: ValidationStatus = 'PASS';
    
    if (designExhaust === 0) {
      status = 'INCOMPLETE';
    } else if (designExhaust < requiredExhaust) {
      status = 'FAIL';
    }

    return {
      requiredExhaust,
      designExhaust,
      unitType: input.exhaustType.unitType,
      exhaustClass: input.exhaustType.exhaustClass,
      status
    };
  }
}
