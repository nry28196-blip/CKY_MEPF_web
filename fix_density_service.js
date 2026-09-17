import fs from 'fs';
const file = 'src/lib/DensityCorrectionService.ts';
let content = fs.readFileSync(file, 'utf8');

// The current mixture density formula:
// const density = (pd / (this.R_DRY_AIR_KJ * tKelvin)) + (pv / (this.R_VAPOR_KJ * tKelvin));
// Replace with the dry air density formula required by ASHRAE App D
content = content.replace(
  'const density = (pd / (this.R_DRY_AIR_KJ * tKelvin)) + (pv / (this.R_VAPOR_KJ * tKelvin));',
  'const density = pd / (this.R_DRY_AIR_KJ * tKelvin); // Dry-air density per ASHRAE 62.1 Addendum j Appendix D (D-5b)'
);

fs.writeFileSync(file, content);
