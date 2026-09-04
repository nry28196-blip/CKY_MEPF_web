const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf-8');

code = code.replace(
  "export interface Ashrae622Input {",
  "export interface Ashrae622Input {\n  localExhaustDeficit?: number;"
);

code = code.replace(
  "const qFan = Math.max(0, qTot - infiltrationCredit);",
  "const deficit = input.localExhaustDeficit || 0;\n    const qFan = Math.max(0, qTot + deficit - infiltrationCredit);"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', code);
