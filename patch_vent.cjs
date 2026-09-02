const fs = require('fs');

let ventCode = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');
ventCode = ventCode.replace(
  /export default function VentilationCalc\(\{\s*onVentilationChange,\s*governingStandard.*?\)\s*\{/,
  `export default function VentilationCalc({ onVentilationChange, governingStandard = 'ASHRAE 62.1-2025' }: { onVentilationChange?: (flow: number, details?: any) => void, governingStandard?: string }) {`
);
fs.writeFileSync('src/components/VentilationCalc.tsx', ventCode);

let ashraeCode = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
ashraeCode = ashraeCode.replace(
  /export default function Ashrae621VentilationCalc\(\{[\s\S]*?\}\)/,
  `export default function Ashrae621VentilationCalc({ onVentilationChange, edition = '2025' }: { onVentilationChange?: (flow: number, details?: any) => void, edition?: '2019' | '2022' | '2025' })`
);
ashraeCode = ashraeCode.replace(
  /onVentilationChange\(total\);/,
  `onVentilationChange(total, { systemType: 'single', zoneResults });`
);
ashraeCode = ashraeCode.replace(
  /onVentilationChange\(systemResult\.votActual \|\| systemResult\.vot\);/,
  `onVentilationChange(systemResult.votActual || systemResult.vot, { systemType: 'multi', systemResult });`
);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', ashraeCode);

console.log("Patched VentilationCalc and Ashrae621VentilationCalc");
