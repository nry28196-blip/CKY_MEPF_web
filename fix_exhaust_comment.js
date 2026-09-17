import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /export const ASHRAE_621_2022_EXHAUST_RATES: Ashrae621ExhaustType\[\] = \[/,
  '// SUPPORTED SUBSET of ASHRAE 62.1-2022 Table 6.5.1\\nexport const ASHRAE_621_2022_EXHAUST_RATES: Ashrae621ExhaustType[] = ['
);

fs.writeFileSync(file, content);
