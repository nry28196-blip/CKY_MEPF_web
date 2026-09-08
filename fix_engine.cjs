const fs = require('fs');
let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

content = content.replace(
  /revisionState: 'ASHRAE 62.1-2025 Base \+ Errata'/g,
  "revisionState: input.zone?.spaceType?.revisionSource || (input.zones && input.zones.length > 0 && input.zones[0].spaceType?.revisionSource) || 'Unknown'"
);

content = content.replace(
  "revisionState: input.zone?.spaceType?.revisionSource || (input.zones && input.zones.length > 0 && input.zones[0].spaceType?.revisionSource) || 'Unknown'",
  "revisionState: input.zone?.spaceType?.revisionSource || 'Unknown'"
); // This might have been replaced wrongly for MultiZone

// Let's do it precisely
content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');
content = content.replace(
  "votDensityCorrected: null, finalDesignOutdoorAir: null, auditTrail: [], revisionState: 'ASHRAE 62.1-2025 Base + Errata', status",
  "votDensityCorrected: null, finalDesignOutdoorAir: null, auditTrail: [], revisionState: input.zone?.spaceType?.revisionSource || 'Unknown', status"
);
content = content.replace(
  "revisionState: 'ASHRAE 62.1-2025 Base + Errata',",
  "revisionState: input.zone?.spaceType?.revisionSource || 'Unknown',"
); // For single zone

content = content.replace(
  "revisionState: 'ASHRAE 62.1-2025 Base + Errata',",
  "revisionState: input.zones.length > 0 ? (input.zones[0].spaceType?.revisionSource || 'Unknown') : 'Unknown',"
); // For multi zone

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
