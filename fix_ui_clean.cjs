const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace manual density division in useEffect
file = file.replace(
  /const total = zoneResults\.reduce\(\(sum, z\) => sum \+ z\.result\.voz, 0\) \/ airProps\.densityRatio;/,
  "const total = zoneResults.reduce((sum, z) => sum + (z.result.vozActual || z.result.voz), 0);"
);

file = file.replace(
  /onVentilationChange\(systemResult\.vot \/ airProps\.densityRatio\);/,
  "onVentilationChange(systemResult.votActual || systemResult.vot);"
);

file = file.replace(
  /\[systemType, zoneResults, systemResult, airProps\.densityRatio, onVentilationChange\]/,
  "[systemType, zoneResults, systemResult, onVentilationChange]"
);

// Replace airProps references in JSX
file = file.replace(/airProps\.densityRatio/g, "densityRatio");

// Update UI to show standard vs actual where appropriate (already partially done, but let's make it cleaner)
// Specifically Voz
file = file.replace(
  /Math\.ceil\(zr\.result\.voz \/ densityRatio\)/g,
  "Math.ceil(zr.result.vozActual || zr.result.voz)"
);

file = file.replace(
  /Math\.ceil\(systemResult\.vot \/ densityRatio\)/g,
  "Math.ceil(systemResult.votActual || systemResult.vot)"
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
