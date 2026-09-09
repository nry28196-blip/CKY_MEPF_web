import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

// replace ezConfig in test 33 to do a deep copy
content = content.replace(/const ezConfig = \{ \.\.\.verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' \};/,
    "const ezConfig = JSON.parse(JSON.stringify({ ...verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' }));");

// remove the file writing in test 34
content = content.replace(/require\('fs'\)\.writeFileSync\('t34\.log', result\.status \+ ' ' \+ result\.reason\);\n      expect\(result\.status\)\.toBe\('INCOMPLETE'\);/,
    "expect(result.status).toBe('INCOMPLETE');");

content = content.replace(/require\('fs'\)\.writeFileSync\('t34\.log', result\.status \+ ' ' \+ result\.reason\);\n      expect\(result\.status\)\.toBe\('INCOMPLETE'\);/,
    "expect(result.status).toBe('INCOMPLETE');");

fs.writeFileSync(file, content);
