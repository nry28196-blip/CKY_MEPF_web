const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf8');

content = content.replace(/\/\/ VAV logic checks\n    for \(const z of input.zones\) \{\n      if \(z.dMode === 'VAV'\) \{\n        if \(z.vpzMinDesign === null \|\| isNaN\(z.vpzMinDesign\)\) \{\n          statuses.push\('INCOMPLETE'\);\n        \} else if \(z.vpzMinDesign < 1.5 \* z.voz\) \{\n          statuses.push\('FAIL'\); \/\/ Insufficient Vpz-min\n        \} else if \(z.vpz !== null && z.vpzMinDesign > z.vpz\) \{\n          statuses.push\('FAIL'\); \/\/ Min > Design\n        \}\n      \}\n    \}/, "");

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', content);
