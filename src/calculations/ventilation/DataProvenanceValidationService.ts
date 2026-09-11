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

    // 8. verificationDate exists and is a valid date
    if (!provenance.verificationDate) return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(provenance.verificationDate)) return false;
    const d = new Date(provenance.verificationDate);
    if (isNaN(d.getTime())) return false;
    
    return true;
  }
  
    static isValidSourceType(source: any): source is SourceType {
    const validSourceTypes: SourceType[] = [
      'ASHRAE_PUBLISHED', 'ASHRAE_PUBLISHED_ADDENDUM', 'ASHRAE_PUBLISHED_ERRATA',
      'PROJECT_SPECIFICATION', 'ADOPTED_CODE', 'PUBLIC_REVIEW_DRAFT', 'UNKNOWN'
    ];
    return validSourceTypes.includes(source);
  }

  static checkParentConsistency(parent: any, prov: DataProvenance | undefined): boolean {
      if (!prov) return true;
      
      // Ensure revision source is actually a valid SourceType
      const source = parent.revisionState?.source;
      if (!this.isValidSourceType(source)) {
        return false;
      }
      if (!this.isValidSourceType(parent.sourceType)) {
        return false;
      }

      // Verification consistency
      if (prov.verificationStatus === 'VERIFIED' && parent.verificationStatus !== 'VERIFIED') return false;
      
      
      // "If provenance says VERIFIED: parent.verificationStatus must also be VERIFIED."
      // "If parent verificationStatus is NOT_VERIFIED: a child provenance record must not claim VERIFIED."

      if (parent.standard !== prov.standard) return false;
      if (parent.edition !== prov.edition) return false;
      if (parent.revisionState?.standard !== prov.standard) return false;
      if (parent.revisionState?.edition !== prov.edition) return false;
      
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
      
      if (!this.checkParentConsistency(spaceType, spaceType.provenance.rp) ||
          !this.checkParentConsistency(spaceType, spaceType.provenance.ra) ||
          (useDefaultOccupancy && !this.checkParentConsistency(spaceType, spaceType.provenance.defaultOccupancy)) ||
          !this.checkParentConsistency(spaceType, spaceType.provenance.reference)) {
          reasons.push('Contradictory Parent Provenance');
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
        status = reasons.includes('Missing Reference') ? 'BLOCKED' : 'INCOMPLETE';
      }
      if (reasons.some(r => r.includes('Unverified') || r.includes('Contradictory'))) {
        status = 'BLOCKED';
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
      
      if (!this.checkParentConsistency(ezConfig, ezConfig.provenance.ez) ||
          !this.checkParentConsistency(ezConfig, ezConfig.provenance.applicability) ||
          !this.checkParentConsistency(ezConfig, ezConfig.provenance.reference)) {
          reasons.push('Contradictory Parent Provenance');
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
        status = reasons.includes('Missing Ez Reference') ? 'BLOCKED' : 'INCOMPLETE';
      }
      if (reasons.some(r => r.includes('Unverified'))) {
        status = 'BLOCKED';
      }
    }

    return { valid, status, reasons };
  }
}
