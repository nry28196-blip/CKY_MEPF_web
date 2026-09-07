const fs = require('fs');

const files = [
  'src/components/SystemPerformanceCalc.tsx',
  'src/components/MechanicalCalc.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/from '\.\.\/calculations\/services\/AirDensityService'/g, "from '../lib/DensityCorrectionService'");
  content = content.replace(/AirDensityService/g, "DensityCorrectionService");
  fs.writeFileSync(file, content);
});

fs.unlinkSync('src/calculations/services/AirDensityService.ts');
