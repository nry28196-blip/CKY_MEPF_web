const fs = require('fs');

let exService = fs.readFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', 'utf-8');
exService = exService.replace(
  "const projectReq = input.projectOverride || 0;",
  "const projectReq = input.projectOverride !== undefined ? input.projectOverride : 0;"
);
exService = exService.replace(
  "const mfgReq = input.mfgOverride || 0;",
  "const mfgReq = input.mfgOverride !== undefined ? input.mfgOverride : 0;"
);
fs.writeFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', exService);

let exCalc = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf-8');
exCalc = exCalc.replace(
  "Math.ceil(e.result.governingRequired)",
  "e.result.governingRequired.toFixed(1)"
);
fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', exCalc);
