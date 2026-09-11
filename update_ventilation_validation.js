import fs from 'fs';

const path = 'src/calculations/ventilation/VentilationValidationService.ts';
let content = fs.readFileSync(path, 'utf8');

const replacement = `static determineStatus(
    isVerifiedAshraeInput: boolean,
    isMissingUserInput: boolean,
    isInvalidEngineeringInput: boolean,
    isDerivedResult: boolean
  ): { validationStatus: ValidationStatus; auditStatus: AuditStatus } {
    if (isInvalidEngineeringInput) {
      return { validationStatus: 'FAIL', auditStatus: AuditStatus.FAIL };
    }
    if (isMissingUserInput) {
      return { validationStatus: 'INCOMPLETE', auditStatus: AuditStatus.BLOCKED };
    }
    if (!isVerifiedAshraeInput) {
      return { validationStatus: 'BLOCKED', auditStatus: isDerivedResult ? AuditStatus.BLOCKED : AuditStatus.INPUT_NOT_VERIFIED };
    }
    if (isDerivedResult) {
      // If we got this far as a derived result, we assume inputs were verified (or we wouldn't be calculating)
      return { validationStatus: 'PASS', auditStatus: AuditStatus.DERIVED };
    }
    
    // Default valid input
    return { validationStatus: 'PASS', auditStatus: AuditStatus.INPUT_VERIFIED };
  }`;

content = content.replace(/static determineStatus\([\s\S]*?return \{ validationStatus: 'PASS', auditStatus: AuditStatus\.INPUT_VERIFIED \};\s*\}/, replacement);

fs.writeFileSync(path, content);
console.log("Updated VentilationValidationService.ts");
