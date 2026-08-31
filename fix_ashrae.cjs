const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');
code = code.replace(/const vbz = vbp \+ vba;/, "// Vbz = Rp*Pz + Ra*Az calculation\n    const vbz = vbp + vba;");
fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', code);
