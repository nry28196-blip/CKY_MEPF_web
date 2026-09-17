import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /reference:\s*\{\s*value:\s*0/g,
  "reference: { value: 'Table 6.2.2.1'"
);

content = content.replace(
  /applicability:\s*\{\s*value:\s*0/g,
  "applicability: { value: 'Cooling'" // I will fix this specifically below
);

content = content.replace(
  /unitType:\s*\{\s*value:\s*0/g,
  "unitType: { value: 'fixture'" // will fix
);

content = content.replace(
  /operatingCondition:\s*\{\s*value:\s*0/g,
  "operatingCondition: { value: 'Continuous'" // will fix
);

fs.writeFileSync(file, content);
