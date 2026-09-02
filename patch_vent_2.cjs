const fs = require('fs');
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

const target1 = `export default function VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {`;
const replacement1 = `export default function VentilationCalc({ onVentilationChange, governingStandard = 'ASHRAE 62.1-2025' }: { onVentilationChange?: (flow: number) => void, governingStandard?: string }) {
  const standardParts = governingStandard.split('-');
  const edition = standardParts.length > 1 ? standardParts[1] : '2025';
`;

const target2 = `{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} />}`;
const replacement2 = `{ventMode === 'standard' && <Ashrae621VentilationCalc onVentilationChange={onVentilationChange} edition={edition as any} />}`;

if (code.includes(target1) && code.includes(target2)) {
  code = code.replace(target1, replacement1).replace(target2, replacement2);
  fs.writeFileSync('src/components/VentilationCalc.tsx', code);
  console.log("Patched VentilationCalc implementation.");
} else {
  console.log("Target not found.", code.includes(target1), code.includes(target2));
}
