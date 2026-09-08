const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', 'utf8');

// The only modification is adding an unsupported check, but we already have an INCOMPLETE if exhaustType is null.
// Let's add a condition where if it's not in the known database (which the UI restricts), but we can just say the UI says "Other / Unsupported" and passes a null type.

content = content.replace(
  "return { requiredExhaust: 0, designExhaust: 0, unitType: 'unknown', exhaustClass: 1, status: 'INCOMPLETE' };",
  "return { requiredExhaust: 0, designExhaust: 0, unitType: 'unknown', exhaustClass: 1, status: 'NOT_EVALUATED' };"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', content);
