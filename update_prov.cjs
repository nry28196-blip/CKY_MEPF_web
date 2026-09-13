const fs = require('fs');

let code = fs.readFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', 'utf8');

// 1. Fix isAshraeSourceTypeAcceptable
code = code.replace(
    'static isAshraeSourceTypeAcceptable(sourceType: SourceType | undefined | unknown): boolean {',
    'static isAshraeSourceTypeAcceptable(sourceType: SourceType | undefined): boolean {'
);

// 2. Add revisionState.verificationDate validation helper
const validateDateHelper = `
  static isDateValid(dateString: string | undefined): boolean {
    if (!dateString) return false;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(dateString)) return false;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    // ensure no impossible dates like 2025-99-99 by checking if ISO string matches original (or parsing doesn't shift it)
    const [y, m, dNum] = dateString.split('-');
    if (d.getUTCFullYear() !== parseInt(y) || (d.getUTCMonth() + 1) !== parseInt(m) || d.getUTCDate() !== parseInt(dNum)) return false;
    return true;
  }
`;

if (!code.includes('static isDateValid')) {
    code = code.replace('static isValidSourceType', validateDateHelper + '\n  static isValidSourceType');
}

// 3. Strengthen checkParentConsistency
const newCheckParentConsistency = `static checkParentConsistency(parent: ProvenanceParent, prov: DataProvenance | undefined): boolean {
      if (!prov) return true;
      
      const source = parent.revisionState?.source;
      if (!this.isValidSourceType(source)) {
        return false;
      }
      if (!this.isValidSourceType(parent.sourceType)) {
        return false;
      }

      if (parent.verificationStatus === 'VERIFIED') {
          if (!this.isAshraeSourceTypeAcceptable(parent.sourceType)) return false;
          if (!this.isAshraeSourceTypeAcceptable(source)) return false;
      }

      if (prov.verificationStatus === 'VERIFIED' && parent.verificationStatus !== 'VERIFIED') return false;
      
      if (parent.standard !== prov.standard) return false;
      if (parent.edition !== prov.edition) return false;
      if (parent.revisionState?.standard !== prov.standard) return false;
      if (parent.revisionState?.edition !== prov.edition) return false;
      
      return true;
  }`;
code = code.replace(/static checkParentConsistency[\s\S]*?return true;\n  }/, newCheckParentConsistency);

// 4. Strengthen SpaceType validation
const spaceTypeOldDate = `    if (spaceType.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(spaceType.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');
    if (spaceType.verificationStatus === 'VERIFIED') {
      if (!spaceType.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(spaceType.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(spaceType.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }`;

const spaceTypeNewDate = `    if (spaceType.verificationStatus === 'VERIFIED') {
      if (!this.isAshraeSourceTypeAcceptable(spaceType.sourceType) || !this.isAshraeSourceTypeAcceptable(spaceType.revisionState?.source)) {
        reasons.push('Invalid Source Type for VERIFIED data');
      }
      if (!this.isDateValid(spaceType.verificationDate)) {
        reasons.push('Invalid Verification Date');
      }
      if (!this.isDateValid(spaceType.revisionState?.verificationDate)) {
        reasons.push('Invalid Revision Verification Date');
      }
    }`;
code = code.replace(spaceTypeOldDate, spaceTypeNewDate);

// 5. Strengthen Ez validation
const ezOldDate = `    if (ezConfig.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(ezConfig.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');
    if (ezConfig.verificationStatus === 'VERIFIED') {
      if (!ezConfig.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ezConfig.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(ezConfig.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }`;

const ezNewDate = `    if (ezConfig.verificationStatus === 'VERIFIED') {
      if (!this.isAshraeSourceTypeAcceptable(ezConfig.sourceType) || !this.isAshraeSourceTypeAcceptable(ezConfig.revisionState?.source)) {
        reasons.push('Invalid Source Type for VERIFIED data');
      }
      if (!this.isDateValid(ezConfig.verificationDate)) {
        reasons.push('Invalid Verification Date');
      }
      if (!this.isDateValid(ezConfig.revisionState?.verificationDate)) {
        reasons.push('Invalid Revision Verification Date');
      }
    }`;
code = code.replace(ezOldDate, ezNewDate);

// 6. Strengthen Exhaust validation (and fix the previous dates)
// Let's find Exhaust validation method
const exhaustDateOld = `      // 4. STRICT EXHAUST VERIFICATION DATE
      if (!exhaustType.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(exhaustType.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(exhaustType.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }`;
const exhaustDateNew = `      // 4. STRICT EXHAUST VERIFICATION DATE
      if (!this.isDateValid(exhaustType.verificationDate)) reasons.push('Invalid Verification Date');
      if (!this.isDateValid(exhaustType.revisionState?.verificationDate)) reasons.push('Invalid Revision Verification Date');
`;
code = code.replace(exhaustDateOld, exhaustDateNew);


fs.writeFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', code);
