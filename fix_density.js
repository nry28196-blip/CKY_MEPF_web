import fs from 'fs';
const file = '/app/applet/src/lib/DensityCorrectionService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const density = pd \/ \(this\.R_DRY_AIR_KJ \* tKelvin\);/g, 'const dryAirDensity = pd / (this.R_DRY_AIR_KJ * tKelvin);');
content = content.replace(/this\.STANDARD_DENSITY \/ density/g, 'this.STANDARD_DENSITY / dryAirDensity');
content = content.replace(/ρ_actual/g, 'ρ_da');
content = content.replace(/ρ_actual \(kg\/m³\)/g, 'ρ_da (kg_da/m³)');
content = content.replace(/density,/g, 'density: dryAirDensity,');

fs.writeFileSync(file, content);
