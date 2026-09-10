import { Ashrae621SpaceType, Ashrae621Ez, DataProvenance, SourceType } from '../../data/ventilation/ashrae621/types';
import { ValidationStatus } from './VentilationValidationService';

export interface DataProvenanceValidationResult {
  valid: boolean;
  status: ValidationStatus;
  reasons: string[];
}

export class DataProvenanceValidationService {
  static isAshraeSourceTypeAcceptable(sourceType: SourceType): boolean {
    return sourceType === 'ASHRAE_PUBLISHED' ||
           sourceType === 'ASHRAE_PUBLISHED_ADDENDUM' ||
           sourceType === 'ASHRAE_PUBLISHED_ERRATA';
  }

  static validateProvenance(
    provenance: DataProvenance | undefined,
    expectedStandard: string,
    expectedEdition: string
  ): boolean {
    if (!provenance) return false;
    
    // 10. REFERENCE VALIDATION
    if (!provenance.reference) return false;
    
    if (provenance.standard !== expectedStandard) return false;
    if (provenance.edition !== expectedEdition) return false;
    
    // 4. REVISION MUST MATCH THE SELECTED EDITION
    if (provenance.revision !== expectedEdition) return false;
    
    if (provenance.verificationStatus !== 'VERIFIED') return false;
    
    // 5. SOURCE TYPE MUST MATCH THE STANDARD
    if (!this.isAshraeSourceTypeAcceptable(provenance.sourceType)) return false;
    
    return true;
  }

  static validateSpaceTypeData(
    spaceType: Ashrae621SpaceType,
    expectedStandard: string,
    expectedEdition: string,
    useDefaultOccupancy: boolean
  ): DataProvenanceValidationResult {
    const reasons: string[] = [];
    
    if (spaceType.standard !== expectedStandard) reasons.push('Invalid Standard Configuration');
    if (spaceType.edition !== expectedEdition) reasons.push('Edition Mismatch');
    
    if (spaceType.revisionState?.standard !== expectedStandard || spaceType.revisionState?.edition !== expectedEdition) {
      reasons.push('Revision Mismatch');
    }
    
    if (!spaceType.reference) {
      reasons.push('Missing Reference');
    }

    if (spaceType.provenance) {
      if (!this.validateProvenance(spaceType.provenance.rp, expectedStandard, expectedEdition)) reasons.push('Unverified Rp');
      if (!this.validateProvenance(spaceType.provenance.ra, expectedStandard, expectedEdition)) reasons.push('Unverified Ra');
      if (useDefaultOccupancy && !this.validateProvenance(spaceType.provenance.defaultOccupancy, expectedStandard, expectedEdition)) {
        reasons.push('Unverified Occupancy Density');
      }
      if (spaceType.provenance.reference && !this.validateProvenance(spaceType.provenance.reference, expectedStandard, expectedEdition)) {
        reasons.push('Missing Reference');
      }
    } else {
      if (spaceType.verificationStatus !== 'VERIFIED' || !this.isAshraeSourceTypeAcceptable(spaceType.sourceType)) {
        reasons.push('Unverified Space Type');
      }
    }
    
    // 18. CONTRADICTORY DATA - Reject notes = "Verified" while verificationStatus = NOT_VERIFIED
    // The prompt says: Reject notes="Verified" while verificationStatus=NOT_VERIFIED.
    // If the record claims to be verified via notes but lacks structural verification, it fails.
    if (spaceType.notes?.toLowerCase().includes('verified') && spaceType.verificationStatus !== 'VERIFIED') {
        reasons.push('Contradictory Verification Status');
    }
    
    const valid = reasons.length === 0;
    let status: ValidationStatus = 'PASS';
    
    if (!valid) {
      if (reasons.some(r => r.includes('Missing') || r.includes('Mismatch') || r.includes('Invalid'))) {
        status = reasons.includes('Missing Reference') ? 'NOT_VERIFIED' : 'INCOMPLETE';
      }
      if (reasons.some(r => r.includes('Unverified') || r.includes('Contradictory'))) {
        status = 'NOT_VERIFIED';
      }
    }

    return { valid, status, reasons };
  }

  static validateEzData(
    ezConfig: Ashrae621Ez,
    expectedStandard: string,
    expectedEdition: string
  ): DataProvenanceValidationResult {
    const reasons: string[] = [];
    
    if (ezConfig.standard !== expectedStandard) reasons.push('Invalid Standard Configuration');
    if (ezConfig.edition !== expectedEdition) reasons.push('Edition Mismatch');
    
    if (!ezConfig.reference) {
      reasons.push('Missing Ez Reference');
    }

    if (ezConfig.provenance) {
      if (!this.validateProvenance(ezConfig.provenance.ez, expectedStandard, expectedEdition)) reasons.push('Unverified Ez');
      if (!this.validateProvenance(ezConfig.provenance.applicability, expectedStandard, expectedEdition)) reasons.push('Unverified Ez Applicability');
      if (ezConfig.provenance.reference && !this.validateProvenance(ezConfig.provenance.reference, expectedStandard, expectedEdition)) {
        reasons.push('Missing Ez Reference');
      }
    } else {
      if (ezConfig.verificationStatus !== 'VERIFIED' || !this.isAshraeSourceTypeAcceptable(ezConfig.sourceType)) {
        reasons.push('Unverified Ez');
      }
    }
    
    const valid = reasons.length === 0;
    let status: ValidationStatus = 'PASS';
    
    if (!valid) {
      if (reasons.some(r => r.includes('Missing') || r.includes('Mismatch') || r.includes('Invalid'))) {
        status = reasons.includes('Missing Ez Reference') ? 'NOT_VERIFIED' : 'INCOMPLETE';
      }
      if (reasons.some(r => r.includes('Unverified'))) {
        status = 'NOT_VERIFIED';
      }
    }

    return { valid, status, reasons };
  }
}
