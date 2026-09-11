import fs from 'fs';
const p = 'src/tests/ventilation/exhaust-provenance.test.ts';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\\n/g, '\n');
fs.writeFileSync(p, c);
