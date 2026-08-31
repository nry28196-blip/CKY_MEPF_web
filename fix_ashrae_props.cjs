const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace('export default function Ashrae621VentilationCalc() {', 'export default function Ashrae621VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {');

// We need to call onVentilationChange in a useEffect.
// The design outdoor air is either the single zone Voz or the multi zone Vot.
const useEffectCode = `
  useEffect(() => {
    if (onVentilationChange) {
      if (systemType === 'single') {
        // Just sum the zones
        const total = zoneResults.reduce((sum, z) => sum + z.result.voz, 0) / airProps.densityRatio;
        onVentilationChange(total);
      } else if (systemResult) {
        onVentilationChange(systemResult.vot / airProps.densityRatio);
      }
    }
  }, [systemType, zoneResults, systemResult, airProps.densityRatio, onVentilationChange]);
`;

code = code.replace('  const areaUnit = isMetric ? \'m²\' : \'ft²\';', useEffectCode + '\n  const areaUnit = isMetric ? \'m²\' : \'ft²\';');

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
