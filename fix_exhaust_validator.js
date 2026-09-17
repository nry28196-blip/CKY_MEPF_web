import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

// I need to add provenance checking to validateExhaustData
// Let's replace the whole method for easier rewriting
const newValidateExhaustData = `
  static validateExhaustData(
    exhaustType: any,
    expectedStandard: string,
    expectedEdition: string
  ): any {
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

    if (exhaustType.provenance) {
      if (!this.validateProvenance(exhaustType.provenance.rate, expectedStandard, expectedEdition)) reasons.push('Unverified Exhaust Rate');
      if (exhaustType.provenance.unitType && !this.validateProvenance(exhaustType.provenance.unitType, expectedStandard, expectedEdition)) reasons.push('Unverified Unit Type');
      if (exhaustType.provenance.exhaustClass && !this.validateProvenance(exhaustType.provenance.exhaustClass, expectedStandard, expectedEdition)) reasons.push('Unverified Exhaust Class');
      if (exhaustType.provenance.operatingCondition && !this.validateProvenance(exhaustType.provenance.operatingCondition, expectedStandard, expectedEdition)) reasons.push('Unverified Operating Condition');
      
      if (!this.checkParentConsistency(exhaustType, exhaustType.provenance.rate)) reasons.push('Contradictory Parent Provenance');
    } else {
      if (exhaustType.verificationStatus !== 'VERIFIED' || !this.isAshraeSourceTypeAcceptable(exhaustType.sourceType)) {
        reasons.push('Unverified Exhaust');
      }
    }
    
    if (exhaustType.verificationStatus === 'VERIFIED') {
      // 5. STRICT SOURCE CONSISTENCY
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.sourceType)) reasons.push('Contradictory Source Type');
      if (!this.isAshraeSourceTypeAcceptable(exhaustType.revisionState?.source)) reasons.push('Contradictory Source Type');
      
      // 4. STRICT EXHAUST VERIFICATION DATE
      if (!this.isDateValid(exhaustType.verificationDate)) reasons.push('Invalid Verification Date');
      if (!this.isDateValid(exhaustType.revisionState?.verificationDate)) reasons.push('Invalid Revision Verification Date');
    } else {
      if (!exhaustType.provenance) reasons.push('Unverified Exhaust');
    }
    
    const valid = reasons.length === 0;
    let status = 'PASS';
    
    if (!valid) {
      status = 'BLOCKED';
    }
    return { valid, status, reasons };
  }
`;

content = content.replace(
  /static validateExhaustData\([\s\S]*?return \{ valid, status, reasons \};\n  \}/,
  newValidateExhaustData.trim()
);

fs.writeFileSync(file, content);
