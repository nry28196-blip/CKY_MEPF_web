import fs from 'fs';

const p = 'src/tests/ventilation/exhaust-provenance.test.ts';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "name: 'Test Fixture Only - NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED',",
  "name: 'Test Fixture Only - NOT AN ASSERTION THAT CURRENT ASHRAE 62.1-2025 PRODUCTION DATA IS VERIFIED',\\n  category: 'Educational',"
);

fs.writeFileSync(p, c);
