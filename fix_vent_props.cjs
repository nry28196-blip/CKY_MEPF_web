const fs = require('fs');
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

code = code.replace('export default function VentilationCalc() {', 'export default function VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {');

// I also need to pass onVentilationChange to Ashrae621VentilationCalc, so it can bubble up the system flow.
code = code.replace('<Ashrae621VentilationCalc />', '<Ashrae621VentilationCalc onVentilationChange={onVentilationChange} />');

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
