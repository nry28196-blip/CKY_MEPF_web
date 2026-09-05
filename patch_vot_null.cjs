const fs = require('fs');

function patchService(file) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/vot: number;/g, 'vot: number | null;');
  
  if (file.includes('Alternative')) {
    code = code.replace(/const vot = ev > 0 \? vou \/ ev : 0;/, 
      `const vot = ev > 0 && ev <= 1.0 ? vou / ev : null;`);
    code = code.replace(/vot: 0/g, 'vot: null');
  } else if (file.includes('Simplified')) {
    code = code.replace(/const vot = ev > 0 \? vou \/ ev : 0;/, 
      `const vot = ev > 0 && ev <= 1.0 ? vou / ev : null;`);
    code = code.replace(/vot: 0/g, 'vot: null');
  } else if (file.includes('MultiZone')) {
    code = code.replace(/vot: number;/g, 'vot: number | null;');
    code = code.replace(/votActual: number;/g, 'votActual: number | null;');
    
    code = code.replace(/const votActual = AirDensityService\.applyDensityCorrection\(res\.vot, densityRatio\);/,
      `const votActual = res.vot !== null ? AirDensityService.applyDensityCorrection(res.vot, densityRatio) : null;`);
  }
  
  fs.writeFileSync(file, code);
}

patchService('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts');
patchService('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts');
patchService('src/calculations/ventilation/MultiZoneVentilationService.ts');
