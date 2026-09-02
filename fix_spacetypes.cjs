const fs = require('fs');

let content = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', 'utf8');
const targetStart = "export const ASHRAE_62_1_2025_SPACES: VentilationSpaceType[] = [";
const idx = content.indexOf(targetStart);

if (idx !== -1) {
  content = content.substring(0, idx);
  content = `import ashrae2025Data from './ashrae_62_1_2025_database.json';\n` + content;
  content += `export const ASHRAE_62_1_2025_SPACES: VentilationSpaceType[] = ashrae2025Data.spaces as VentilationSpaceType[];\n`;
  fs.writeFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', content);
  console.log("Updated SpaceTypes.ts");
}
