import fs from 'fs';
const file = '/app/applet/src/lib/DensityCorrectionService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'ρ_da \(kg\/m³\)': density: dryAirDensity/g, "'ρ_da (kg_da/m³)': dryAirDensity");
content = content.replace(/res\.density: dryAirDensity/g, 'res.density');

fs.writeFileSync(file, content);
