const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions.noUnusedLocals = true;
tsconfig.include = ["src/tests/ventilation/**/*", "src/lib/**/*", "src/calculations/ventilation/**/*"];
fs.writeFileSync('tsconfig_temp.json', JSON.stringify(tsconfig, null, 2));
