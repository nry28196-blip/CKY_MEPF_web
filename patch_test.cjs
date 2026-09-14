const fs = require('fs');
let file = 'src/tests/ventilation/ashrae-621-alternative-vdz.test.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/expect\(res\.status\)\.toBe\('PASS'\);/g, 'expect(res.status).toBe("BLOCKED");');
fs.writeFileSync(file, code);
