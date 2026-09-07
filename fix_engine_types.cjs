const fs = require('fs');
let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

// Single Zone Fix
content = content.replace(
  /const zoneResult = Ashrae621ZoneService\.calculateZone\(input\.zone\);/g,
  "const zoneResult = Ashrae621ZoneService.calculateZone(input.zone);\n    const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [];"
);
content = content.replace(
  /const auditTrail: import\('\.\.\/calculations\/ventilation\/Ashrae621ZoneService'\)\.AuditTrailItem\[\] = \[\n      \{/g,
  "auditTrail.push({\n"
);
content = content.replace(
  /        reference: 'ASHRAE 62\.1-2025 Section 6\.2\.4\.4 \(Errata Equation 6-10\)'\n      \}\n    \];/g,
  "        reference: 'ASHRAE 62.1-2025 Section 6.2.4.4 (Errata Equation 6-10)'\n      }\n    );"
);


// Multi Zone Fix
content = content.replace(
  /const zoneResults = input\.zones\.map/g,
  "const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [];\n    const zoneResults = input.zones.map"
);


fs.writeFileSync('src/lib/VentilationEngine.ts', content);
