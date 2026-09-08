const fs = require('fs');

const fixFile = (path, replacements) => {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf-8');
  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(path, content);
};

// 1. Ashrae621ZoneService.ts
fixFile('src/calculations/ventilation/Ashrae621ZoneService.ts', [
  [/input.spaceType.revisionSource/g, "input.spaceType.revisionState.source"]
]);

// 2. VentilationEngine.ts
fixFile('src/lib/VentilationEngine.ts', [
  [/zone.spaceType.revisionSource/g, "zone.spaceType.revisionState.source"],
  [/z.spaceType.revisionSource/g, "z.spaceType.revisionState.source"]
]);

// 3. exhaust-calculations.test.ts
fixFile('src/tests/ventilation/exhaust-calculations.test.ts', [
  [/revision:\s*'[^']+',/g, "revisionState: { standard: 'ASHRAE 62.1', edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '', source: 'NOT_VERIFIED' }, sourceType: 'UNVERIFIED_DRAFT',"]
]);

