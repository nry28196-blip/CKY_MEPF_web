const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /sumVpzMin: systemResult\?\.sumVpzMin \|\| 0,\n\s*systemResult\n\s*\};/,
  `sumVpzMin: systemResult?.sumVpzMin || 0,
      systemResult,
      zoneResults
    };`
);

// update rule
code = code.replace(
  /validate: \(s\) => !s\.systemResult\?\.zones\?\.some\(\(z: any\) => z\.status === 'FAIL' \|\| z\.status === 'INCOMPLETE'\),/,
  `validate: (s) => !s.zoneResults.some((z: any) => z.result.status === 'FAIL' || z.result.status === 'INCOMPLETE'),`
);
code = code.replace(
  /validate: \(s\) => !s\.systemResult\?\.zones\?\.some\(\(z: any\) => z\.status === 'WARNING'\),/,
  `validate: (s) => !s.zoneResults.some((z: any) => z.result.status === 'WARNING'),`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
