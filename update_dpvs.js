import fs from 'fs';

const path = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { Ashrae621ExhaustType } from')) {
    content = content.replace("import { Ashrae621SpaceType, Ashrae621Ez, DataProvenance, SourceType } from '../../data/ventilation/ashrae621/types';", "import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, DataProvenance, SourceType } from '../../data/ventilation/ashrae621/types';");
}

const exhaustMethod = `
  static validateExhaustData(
    exhaustType: Ashrae621ExhaustType,
    expectedStandard: string,
    expectedEdition: string
  ): DataProvenanceValidationResult {
    const reasons: string[] = [];
    
    if (exhaustType.standard !== expectedStandard) reasons.push('Invalid Standard Configuration');
    if (exhaustType.edition !== expectedEdition) reasons.push('Edition Mismatch');
    
    if (exhaustType.revisionState?.standard !== expectedStandard || exhaustType.revisionState?.edition !== expectedEdition) {
      reasons.push('Revision Mismatch');
    }
    
    if (!exhaustType.reference) {
      reasons.push('Missing Reference');
    }

    if (!this.isValidSourceType(exhaustType.revisionState?.source)) {
      reasons.push('Unverified Exhaust');
    }
    if (!this.isValidSourceType(exhaustType.sourceType)) {
      reasons.push('Unverified Exhaust');
    }

    if (exhaustType.verificationStatus === 'VERIFIED') {
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.sourceType)) reasons.push('Unverified Exhaust');
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.revisionState?.source as SourceType)) reasons.push('Unverified Exhaust');
      if (!exhaustType.verificationDate) reasons.push('Unverified Exhaust');
    } else {
      reasons.push('Unverified Exhaust');
    }
    
    const valid = reasons.length === 0;
    let status: ValidationStatus = 'PASS';
    
    if (!valid) {
      if (reasons.some(r => r.includes('Missing') || r.includes('Mismatch') || r.includes('Invalid'))) {
        status = reasons.includes('Missing Reference') ? 'BLOCKED' : 'INCOMPLETE';
      }
      if (reasons.some(r => r.includes('Unverified') || r.includes('Contradictory'))) {
        status = 'BLOCKED';
      }
    }

    return { valid, status, reasons };
  }
`;

if (!content.includes('validateExhaustData')) {
    content = content.replace("export class DataProvenanceValidationService {", "export class DataProvenanceValidationService {" + exhaustMethod);
    fs.writeFileSync(path, content);
    console.log("Updated DataProvenanceValidationService.ts");
} else {
    console.log("Already updated DataProvenanceValidationService.ts");
}
