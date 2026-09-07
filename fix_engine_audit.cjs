const fs = require('fs');

let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

content = content.replace(
  /finalDesignOutdoorAir: number \| null; \/\/ The authoritative final value/g,
  "finalDesignOutdoorAir: number | null; // The authoritative final value\n  auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[];"
);

content = content.replace(
  /finalDesignOutdoorAir: number \| null;\n  revisionState: string;/g,
  "finalDesignOutdoorAir: number | null;\n  auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[];\n  revisionState: string;"
);

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
