const fs = require('fs');

// 1. Update VentilationModels.ts
let modelsFile = fs.readFileSync('src/models/VentilationModels.ts', 'utf8');
if (!modelsFile.includes('ep?: number;')) {
  modelsFile = modelsFile.replace(
    /vpz\?: number;/,
    `vpz?: number;
  /** Primary air fraction (Ep) - Default 1.0 for single-duct */
  ep?: number;
  /** Secondary recirculation fraction (Er) - Default 0.0 for single-duct */
  er?: number;`
  );
  fs.writeFileSync('src/models/VentilationModels.ts', modelsFile);
}

// 2. Update MultiZoneVentilationService.ts
let multiFile = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');
multiFile = multiFile.replace(
  /primaryAirflow: number; \/\/ Vpz \(Zone Primary Airflow\)/,
  `primaryAirflow: number; // Vpz (Zone Primary Airflow)
  ep?: number; // Primary air fraction (Ep)
  er?: number; // Secondary recirculation fraction (Er)`
);

const appendixALogic = `// Calculate exact Evz for each zone using Full Normative Appendix A
    zoneResults.forEach(zr => {
       const zoneInput = zones.find(z => z.zoneId === zr.zoneId);
       const ep = zoneInput?.ep ?? 1.0;
       const er = zoneInput?.er ?? 0.0;
       const ez = zoneInput?.zoneResult.ez ?? 1.0;
       
       const fa = ep + (1 - ep) * er;
       const fb = ep;
       const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
       
       const evz = fa > 0 ? (fa + xs * fb - zr.zpz * ep * fc) / fa : 1.0;
       
       if (evz < ev) {
          ev = evz;
       }
    });`;

multiFile = multiFile.replace(
  /\/\/ Calculate exact Evz for each zone[\s\S]+?ev \= evz;\n\s+\}\n\s+\}\);/,
  appendixALogic
);
fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', multiFile);

// 3. Update Ashrae621Service.ts
let ashraeFile = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');
const ashraeAppendixALogic = `// Calculate exact Evz for each zone (Full Normative Appendix A)
    let ev = 1.0;
    for (const zone of zones) {
      if (zone.vpz && zone.vpz > 0) {
        const zp = zone.voz / zone.vpz;
        const ep = zone.ep ?? 1.0;
        const er = zone.er ?? 0.0;
        const ez = zone.ez ?? 1.0;
        
        const fa = ep + (1 - ep) * er;
        const fb = ep;
        const fc = 1 - (1 - ez) * (1 - er) * (1 - ep);
        
        const evz = fa > 0 ? (fa + xs * fb - zp * ep * fc) / fa : 1.0;
        
        if (evz < ev) {
          ev = evz;
        }
      }
    }`;

ashraeFile = ashraeFile.replace(
  /\/\/ Calculate exact Evz for each zone \(Normative Appendix A\)[\s\S]+?\}\n\s+\}/,
  ashraeAppendixALogic
);
fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', ashraeFile);

