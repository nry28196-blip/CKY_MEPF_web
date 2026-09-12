import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, DataProvenance, SourceType, VerificationStatus, StandardRevision, AshraeEdition } from '../../data/ventilation/ashrae621/types';
import { ValidationStatus } from './VentilationValidationService';

export interface DataProvenanceValidationResult {
  valid: boolean;
  status: ValidationStatus;
  reasons: string[];
}

export interface ProvenanceParent {
  sourceType: SourceType;
  verificationStatus: VerificationStatus;
  standard: string;
  edition: string;
  revisionState?: StandardRevision;
  verificationDate?: string;
}
export class DataProvenanceValidationService {
  static validateExhaustData(
    exhaustType: Ashrae621ExhaustType,
    expectedStandard: string,
    expectedEdition: string
  ): DataProvenanceValidationResult {
    const reasons: string[] = [];
    
    // 6. VERIFY PARENT METADATA
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

    // 7. PROTECT AGAINST CONTRADICTORY STATES
    if (exhaustType.verificationStatus === 'VERIFIED') {
      // 5. STRICT SOURCE CONSISTENCY
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.sourceType)) reasons.push('Contradictory Source Type');
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.revisionState?.source)) reasons.push('Contradictory Source Type');
      
      // 4. STRICT EXHAUST VERIFICATION DATE
      if (!exhaustType.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(exhaustType.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(exhaustType.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    } else {
      reasons.push('Unverified Exhaust');
      
    }
    
    const valid = reasons.length === 0;
    let status: ValidationStatus = 'PASS';
    
    if (!valid) {
      // 1. NORMALIZE EXHAUST PROVENANCE STATUS -> always BLOCKED
      status = 'BLOCKED';
    }

    return { valid, status, reasons };
  }

  static isAshraeSourceTypeAcceptable(sourceType: SourceType | undefined | unknown): boolean {
    return sourceType === SourceType.ASHRAE_PUBLISHED ||
           sourceType === SourceType.ASHRAE_PUBLISHED_ADDENDUM ||
           sourceType === SourceType.ASHRAE_PUBLISHED_ERRATA;
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
  
    static isValidSourceType(source: unknown): source is SourceType {
    if (typeof source !== 'string') return false;
    const validSourceTypes: SourceType[] = [
      SourceType.ASHRAE_PUBLISHED, SourceType.ASHRAE_PUBLISHED_ADDENDUM, SourceType.ASHRAE_PUBLISHED_ERRATA,
      SourceType.PROJECT_SPECIFICATION, SourceType.ADOPTED_CODE, SourceType.PUBLIC_REVIEW_DRAFT, SourceType.UNKNOWN
    ];
    return validSourceTypes.includes(source as SourceType);
  }

  static checkParentConsistency(parent: ProvenanceParent, prov: DataProvenance | undefined): boolean {
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
    
    if (spaceType.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(spaceType.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');

    if (spaceType.verificationStatus === 'VERIFIED') {
      if (!spaceType.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(spaceType.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(spaceType.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }

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
    
    
    
    const valid = reasons.length === 0;
    let status: ValidationStatus = 'PASS';
    
    if (!valid) {
      status = 'BLOCKED';
    }

    return { valid, status, reasons };
  }

  static validateEzData(
    ezConfig: Ashrae621Ez,
    expectedStandard: string,
    expectedEdition: string
  ): DataProvenanceValidationResult {
    const reasons: string[] = [];
    
    if (ezConfig.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(ezConfig.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');

    if (ezConfig.verificationStatus === 'VERIFIED') {
      if (!ezConfig.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ezConfig.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(ezConfig.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }

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
      status = 'BLOCKED';
    }

    return { valid, status, reasons };
  }
}
