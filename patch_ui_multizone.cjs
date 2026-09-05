const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(
  /systemType === 'multi_simplified' \? 'simplified' : 'alternative'\n\s*\);/,
  `systemType === 'multi_simplified' ? 'simplified' : 'alternative',
      isMetric
    );`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
