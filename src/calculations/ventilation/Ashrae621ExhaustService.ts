import { ValidationStatus } from './VentilationValidationService';
import { Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/types';
import { DataProvenanceValidationService } from './DataProvenanceValidationService';

export interface ExhaustInput {
  expectedStandard: string;
  expectedEdition: string;
  exhaustType: Ashrae621ExhaustType | null;
  qty: number | null; // Quantity depending on unitType
  designExhaust: number | null; // User's design value
}

export interface ExhaustResult {
  requiredExhaust: number | null; // L/s
  designExhaust: number | null; // L/s
  unitType: string;
  exhaustClass: number | null;
  status: ValidationStatus;
}

export class Ashrae621ExhaustService {
  static calculate(input: ExhaustInput): ExhaustResult {
    // 1. missing exhaust type check
    if (!input.exhaustType) {
      return { requiredExhaust: null, designExhaust: null, unitType: 'unknown', exhaustClass: null, status: 'NOT_EVALUATED' };
    }
    
    // 2. provenance validation
    const provResult = DataProvenanceValidationService.validateExhaustData(
      input.exhaustType,
      input.expectedStandard,
      input.expectedEdition
    );
    
    // 9. BLOCKED RESULT SAFETY
    if (!provResult.valid || provResult.status === 'BLOCKED') {
      const isDesignValid = typeof input.designExhaust === 'number' && Number.isFinite(input.designExhaust) && input.designExhaust >= 0;
      return { 
        requiredExhaust: null, 
        designExhaust: isDesignValid ? input.designExhaust : null, 
        unitType: input.exhaustType.unitType, 
        exhaustClass: input.exhaustType.exhaustClass, 
        status: 'BLOCKED' 
      };
    }

    // 3. quantity validation
    // 10. NEGATIVE / NON-FINITE INPUTS
    if (input.qty === null || input.qty === undefined || Number.isNaN(input.qty)) {
      // Qty NaN should be FAIL according to 'NaN quantity => FAIL or INCOMPLETE according to documented input semantics'. Let's say FAIL for invalid numbers, INCOMPLETE for null.
      if (typeof input.qty === 'number' && Number.isNaN(input.qty)) {
         return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'FAIL' };
      }
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'INCOMPLETE' };
    }
    if (typeof input.qty !== 'number' || !Number.isFinite(input.qty) || input.qty < 0) {
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'FAIL' };
    }

    // 4. design exhaust validation
    if (input.designExhaust === null || input.designExhaust === undefined) {
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'INCOMPLETE' };
    }
    if (typeof input.designExhaust !== 'number' || !Number.isFinite(input.designExhaust) || input.designExhaust < 0) {
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'FAIL' };
    }

    // 5. calculation
    const requiredExhaust = input.exhaustType.rate * input.qty;
    const designExhaust = input.designExhaust;
    
    // 6. result status
    let status: ValidationStatus = 'PASS';
    
    if (designExhaust < requiredExhaust) {
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
