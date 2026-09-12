const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', 'utf-8');

// spaceType date validation
const spaceTypeDateValidation = `
    if (spaceType.verificationStatus === 'VERIFIED') {
      if (!spaceType.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(spaceType.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(spaceType.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }
`;
code = code.replace(
  "if (spaceType.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(spaceType.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');",
  "if (spaceType.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(spaceType.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');\n" + spaceTypeDateValidation
);

// ezConfig date validation
const ezConfigDateValidation = `
    if (ezConfig.verificationStatus === 'VERIFIED') {
      if (!ezConfig.verificationDate) {
        reasons.push('Missing Verification Date');
      } else {
        if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(ezConfig.verificationDate)) reasons.push('Invalid Verification Date');
        const d = new Date(ezConfig.verificationDate);
        if (isNaN(d.getTime())) reasons.push('Invalid Verification Date');
      }
    }
`;
code = code.replace(
  "if (ezConfig.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(ezConfig.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');",
  "if (ezConfig.verificationStatus === 'VERIFIED' && !this.isAshraeSourceTypeAcceptable(ezConfig.sourceType)) reasons.push('Invalid Source Type for VERIFIED data');\n" + ezConfigDateValidation
);

fs.writeFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', code);
