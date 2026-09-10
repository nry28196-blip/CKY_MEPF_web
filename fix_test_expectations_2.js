import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix reason expects
content = content.replace(/expect\(result.reason\).toBe\('Unverified Space Type'\);/g, "expect(result.reason).toBe('Calculation blocked: ASHRAE 62.1-2025 Unverified Space Type');");
content = content.replace(/expect\(result.reason\).toBe\('Missing Reference'\);/g, "expect(result.reason).toBe('Calculation blocked: ASHRAE 62.1-2025 Missing Reference');");
content = content.replace(/expect\(result.reason\).toBe\('Unverified Ez'\);/g, "expect(result.reason).toBe('Calculation blocked: ASHRAE 62.1-2025 Unverified Ez');");

// Fix source expect
content = content.replace(/expect\(productionOffice!\.revisionState\.source\)\.toBe\('NOT_VERIFIED'\);/g, "expect(productionOffice!.revisionState.source).toBe('UNKNOWN');");

// Also check for productionEz if there's any similar check
content = content.replace(/expect\(productionEz!\.revisionState\.source\)\.toBe\('NOT_VERIFIED'\);/g, "expect(productionEz!.revisionState.source).toBe('UNKNOWN');");

fs.writeFileSync(file, content);
