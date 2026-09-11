import fs from 'fs';

const p = 'src/tests/ventilation/exhaust-provenance.test.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "category: 'Educational',",
  "category: 'Educational',\n  operatingCondition: 'continuous',"
);

fs.writeFileSync(p, c);
