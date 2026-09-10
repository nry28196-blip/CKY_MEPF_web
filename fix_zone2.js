import fs from 'fs';
const file = 'src/calculations/ventilation/Ashrae621ZoneService.ts';
let content = fs.readFileSync(file, 'utf8');

const oldCheck1 = `    if (!spaceTypeValidation.valid) {
      return this.emptyResult(spaceTypeValidation.status, spaceTypeValidation.reasons[0]);
    }`;

const newCheck1 = `    if (!spaceTypeValidation.valid) {
      let reason = spaceTypeValidation.reasons[0];
      if (spaceTypeValidation.status === 'BLOCKED') {
        reason = \`Calculation blocked: \${input.expectedStandard}-\${input.expectedEdition} \${reason}\`;
      }
      return this.emptyResult(spaceTypeValidation.status, reason);
    }`;
content = content.replace(oldCheck1, newCheck1);

const oldCheck2 = `    if (!ezValidation.valid) {
      return this.emptyResult(ezValidation.status, ezValidation.reasons[0]);
    }`;

const newCheck2 = `    if (!ezValidation.valid) {
      let reason = ezValidation.reasons[0];
      if (ezValidation.status === 'BLOCKED') {
        reason = \`Calculation blocked: \${input.expectedStandard}-\${input.expectedEdition} \${reason}\`;
      }
      return this.emptyResult(ezValidation.status, reason);
    }`;
content = content.replace(oldCheck2, newCheck2);

fs.writeFileSync(file, content);
