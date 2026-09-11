import fs from 'fs';

const path = 'src/calculations/ventilation/Ashrae621ExhaustService.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `
import { ValidationStatus, VentilationValidationService } from './VentilationValidationService';
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
    if (!input.exhaustType) {
      return { requiredExhaust: null, designExhaust: null, unitType: 'unknown', exhaustClass: null, status: 'NOT_EVALUATED' };
    }
    
    const provResult = DataProvenanceValidationService.validateExhaustData(
      input.exhaustType,
      input.expectedStandard,
      input.expectedEdition
    );
    
    if (!provResult.valid || provResult.status === 'BLOCKED') {
      return { 
        requiredExhaust: null, 
        designExhaust: input.designExhaust !== null && !isNaN(input.designExhaust) ? input.designExhaust : null, 
        unitType: input.exhaustType.unitType, 
        exhaustClass: input.exhaustType.exhaustClass, 
        status: 'BLOCKED' 
      };
    }

    if (input.qty === null || isNaN(input.qty)) {
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'INCOMPLETE' };
    }

    if (input.qty < 0) {
      return { requiredExhaust: null, designExhaust: null, unitType: input.exhaustType.unitType, exhaustClass: input.exhaustType.exhaustClass, status: 'FAIL' };
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
`;

fs.writeFileSync(path, replacement.trim());
console.log("Updated Ashrae621ExhaustService.ts");
