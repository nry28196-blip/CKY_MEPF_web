const fs = require('fs');
let file = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');

file = file.replace(
  /ev,\n\s+vot\n\s+\};\n\s+\}/,
  'ev,\n      vot,\n      votActual\n    };\n  }'
);
fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', file);
