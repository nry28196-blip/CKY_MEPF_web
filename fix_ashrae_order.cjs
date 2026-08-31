const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Remove the injected useEffect
const useEffectStr = `
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

code = code.replace(useEffectStr, '');

// Re-inject it right before return (
code = code.replace('  return (', useEffectStr + '\n  return (');

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
