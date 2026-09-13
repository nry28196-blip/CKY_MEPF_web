const fs = require('fs');

let code = fs.readFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', 'utf8');

const spaceReplace = `    if (spaceType.verificationStatus === 'VERIFIED') {
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

// let's use regex to replace everything between validateSpaceTypeData and (spaceType.standard !== expectedStandard)
code = code.replace(/if \(spaceType\.verificationStatus === 'VERIFIED'[\s\S]*?if \(spaceType\.standard !== expectedStandard\)/, spaceReplace + '\n    if (spaceType.standard !== expectedStandard)');

const ezReplace = `    if (ezConfig.verificationStatus === 'VERIFIED') {
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

code = code.replace(/if \(ezConfig\.verificationStatus === 'VERIFIED'[\s\S]*?if \(ezConfig\.standard !== expectedStandard\)/, ezReplace + '\n    if (ezConfig.standard !== expectedStandard)');

fs.writeFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', code);
