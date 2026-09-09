import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `static validateEzData(
    ezConfig: Ashrae621Ez,
    expectedStandard: string,
    expectedEdition: string
  ): DataProvenanceValidationResult {`;

const split = content.split(target);
if (split.length === 2) {
    let secondPart = split[1];
    secondPart = secondPart.replace("let status: ValidationStatus = 'PASS';", `let status: ValidationStatus = 'PASS';
    if (!valid && ezConfig.edition === '2022') {
       require('fs').writeFileSync('t34_reasons.log', JSON.stringify(reasons));
    }`);
    fs.writeFileSync(file, split[0] + target + secondPart);
}
