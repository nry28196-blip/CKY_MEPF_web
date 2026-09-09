import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("expect(result.status).toBe('NOT_VERIFIED');\n    });\n    it('29. TEST — FIELD-LEVEL VERIFICATION',",
"console.log('REASON FOR TEST 28:', result.reason);\n      expect(result.status).toBe('NOT_VERIFIED');\n    });\n    it('29. TEST — FIELD-LEVEL VERIFICATION',");

fs.writeFileSync(file, content);
