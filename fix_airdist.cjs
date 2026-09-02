const fs = require('fs');

let content = fs.readFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', 'utf8');
const targetStart = "export const ASHRAE_62_1_2025_EZ: AirDistributionConfiguration[] = [";
const idx = content.indexOf(targetStart);

if (idx !== -1) {
  content = content.substring(0, idx);
  // We'll append instead of prepend because there might already be imports, but prepending is fine since it's just TS.
  content = `import ashrae2025Data from './ashrae_62_1_2025_database.json';\n` + content;
  content += `export const ASHRAE_62_1_2025_EZ: AirDistributionConfiguration[] = ashrae2025Data.airDistribution as AirDistributionConfiguration[];\n`;
  fs.writeFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', content);
  console.log("Updated AirDistributionData.ts");
}
