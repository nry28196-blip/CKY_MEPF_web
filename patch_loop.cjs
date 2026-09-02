const fs = require('fs');

let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Add useCallback to react import if not there
if (code.includes('import React, { useState, useEffect }')) {
  code = code.replace('import React, { useState, useEffect }', 'import React, { useState, useEffect, useCallback }');
} else if (code.includes('import { useState, useEffect }')) {
  code = code.replace('import { useState, useEffect }', 'import { useState, useEffect, useCallback }');
}

// 2. Wrap handleVentilationChange in useCallback
code = code.replace(
  /const handleVentilationChange = \(flow: number, details\?: any\) => \{[\s\S]*?\};/,
  `const handleVentilationChange = useCallback((flow: number, details?: any) => {
    setVentilationLps(flow);
    if (details) {
      setVentilationDetails(details);
    } else {
      setVentilationDetails(null);
    }
  }, []);`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Fixed handleVentilationChange loop in MechanicalCalc.tsx");
