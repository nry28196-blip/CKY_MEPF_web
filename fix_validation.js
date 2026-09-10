import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace validateProvenance
const oldValidateProv = `  static validateProvenance(
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
  }`;

const newValidateProv = `  static validateProvenance(
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
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(provenance.verificationDate)) return false;
    const d = new Date(provenance.verificationDate);
    if (isNaN(d.getTime())) return false;
    
    return true;
  }
  
  static checkParentConsistency(parent: any, prov: DataProvenance | undefined): boolean {
      if (!prov) return true;
      if (prov.verificationStatus === 'VERIFIED' && parent.verificationStatus === 'NOT_VERIFIED') return false;
      if (parent.standard !== prov.standard) return false;
      if (parent.edition !== prov.edition) return false;
      if (parent.revisionState?.standard !== prov.standard) return false;
      if (parent.revisionState?.edition !== prov.edition) return false;
      // Note: we do not enforce that parent.revisionState.source === prov.sourceType strictly, 
      // but we shouldn't have conflicting sources either.
      return true;
  }`;

content = content.replace(oldValidateProv, newValidateProv);

const oldValidateSpace = `if (spaceType.provenance) {
      if (!this.validateProvenance(spaceType.provenance.rp, expectedStandard, expectedEdition)) reasons.push('Unverified Rp');
      if (!this.validateProvenance(spaceType.provenance.ra, expectedStandard, expectedEdition)) reasons.push('Unverified Ra');
      if (useDefaultOccupancy && !this.validateProvenance(spaceType.provenance.defaultOccupancy, expectedStandard, expectedEdition)) {
        reasons.push('Unverified Occupancy Density');
      }
      if (spaceType.provenance.reference && !this.validateProvenance(spaceType.provenance.reference, expectedStandard, expectedEdition)) {
        reasons.push('Missing Reference');
      }
    }`;

const newValidateSpace = `if (spaceType.provenance) {
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
    }`;

content = content.replace(oldValidateSpace, newValidateSpace);

const oldValidateEz = `if (ezConfig.provenance) {
      if (!this.validateProvenance(ezConfig.provenance.ez, expectedStandard, expectedEdition)) reasons.push('Unverified Ez');
      if (!this.validateProvenance(ezConfig.provenance.applicability, expectedStandard, expectedEdition)) reasons.push('Unverified Ez Applicability');
      if (ezConfig.provenance.reference && !this.validateProvenance(ezConfig.provenance.reference, expectedStandard, expectedEdition)) {
        reasons.push('Missing Ez Reference');
      }
    }`;

const newValidateEz = `if (ezConfig.provenance) {
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
    }`;

content = content.replace(oldValidateEz, newValidateEz);

fs.writeFileSync(file, content);
