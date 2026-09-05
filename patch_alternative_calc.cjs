const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(
  /export interface AlternativeSystemInput \{\n\s*zones: AlternativeZoneInput\[\];\n\s*systemPopulation\?: number \| null; \/\/ Ps\n\s*vps\?: number \| null; \/\/ System primary airflow\n\}/,
  `export interface AlternativeSystemInput {
  zones: AlternativeZoneInput[];
  systemPopulation?: number | null; // Ps
  vps?: number | null; // System primary airflow
  config?: 'single-supply' | 'secondary-recirculation';
}`
);

// We need to change the Ep / Er check based on config.
const oldEpErCheck = `      if (z.ep === undefined || isNaN(z.ep)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Primary air fraction (Ep) is missing for one or more zones.';
      }
      const ep = z.ep !== undefined && !isNaN(z.ep) ? z.ep : 1.0;
      if (z.er === undefined || isNaN(z.er)) {
        if (status !== 'FAIL') status = 'INCOMPLETE';
        warning = 'Secondary recirculation fraction (Er) is missing for one or more zones.';
      }
      const er = z.er !== undefined && !isNaN(z.er) ? z.er : 0.0;`;

const newEpErCheck = `      let ep = 1.0;
      let er = 0.0;
      if (input.config === 'secondary-recirculation') {
        if (z.ep === undefined || isNaN(z.ep)) {
          if (status !== 'FAIL') status = 'INCOMPLETE';
          warning = 'Primary air fraction (Ep) is missing for one or more zones in Secondary Recirculation system.';
        } else {
          ep = z.ep;
        }
        if (z.er === undefined || isNaN(z.er)) {
          if (status !== 'FAIL') status = 'INCOMPLETE';
          warning = 'Secondary recirculation fraction (Er) is missing for one or more zones in Secondary Recirculation system.';
        } else {
          er = z.er;
        }
      }`;

code = code.replace(oldEpErCheck, newEpErCheck);

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
