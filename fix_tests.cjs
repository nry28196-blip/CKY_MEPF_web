const fs = require('fs');

// Ashrae621SimplifiedSystemService.test.ts
let t1 = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621SimplifiedSystemService.test.ts', 'utf-8');
// For "14. Missing Vpz-min", it should be WARNING.
t1 = t1.replace(/expect\(res\.status\)\.toBe\('INCOMPLETE'\);\n\s*expect\(res\.warning\)\.toContain\('missing Vpz-min'\);/, "expect(res.status).toBe('WARNING');\n    expect(res.warning).toContain('missing Vpz-min');");
// For "17. Missing Ps", it should be INCOMPLETE.
t1 = t1.replace(/\/\/ Missing Ps -> WARNING\n\s*expect\(res\.status\)\.toBe\('WARNING'\);/, "// Missing Ps -> INCOMPLETE\n    expect(res.status).toBe('INCOMPLETE');");
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621SimplifiedSystemService.test.ts', t1);

// Ashrae621AlternativeSystemService.test.ts
let t2 = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621AlternativeSystemService.test.ts', 'utf-8');
t2 = t2.replace(/expect\(res\.status\)\.toBe\('INCOMPLETE'\);\n\s*expect\(res\.warning\)\.toContain\('missing Vpz-min'\);/, "expect(res.status).toBe('WARNING');\n    expect(res.warning).toContain('missing Vpz-min');");
// Missing Vps was expecting INCOMPLETE but failed. Why? Because the fallback in alternative system was returning 'WARNING'?
// Wait, the output for "20. Missing Vps" received "WARNING". Let's check why AlternativeSystem returned WARNING instead of INCOMPLETE.
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621AlternativeSystemService.test.ts', t2);
