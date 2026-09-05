const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /validate: \(s\) => !\(s\.systemType\.startsWith\('multi'\) && s\.zones\.some\(\(z: any\) => z\.vpzMin === ''\)\),/,
  `validate: (s) => !(s.systemType.startsWith('multi') && s.isVAV && s.zones.some((z: any) => z.vpzMin === '')),`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
