const fs = require('fs');
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `    // 8. verificationDate exists and is a valid date
    if (!provenance.verificationDate) return false;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(provenance.verificationDate)) return false;
    const d = new Date(provenance.verificationDate);
    if (isNaN(d.getTime())) return false;`;

const replacement = `    // 8. verificationDate exists and is a valid date
    if (!this.isDateValid(provenance.verificationDate)) return false;`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
