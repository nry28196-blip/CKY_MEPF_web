const fs = require('fs');
let iaq = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');

iaq = iaq.replace(
  "const { unitSystem, getUnitLabel } = useUnit();",
  "const { unitSystem } = useUnit();"
);

iaq = iaq.replace(
  "const flowUnit = getUnitLabel('airflow');",
  "const flowUnit = unitSystem === 'metric' ? 'L/s' : 'cfm';"
);

iaq = iaq.replace(
  "const lenUnit = getUnitLabel('length');",
  "const lenUnit = unitSystem === 'metric' ? 'm' : 'ft';"
);

iaq = iaq.replace(
  "const areaUnit = getUnitLabel('area');",
  "const areaUnit = unitSystem === 'metric' ? 'm²' : 'ft²';"
);

fs.writeFileSync('src/components/IAQCalc.tsx', iaq);

let exhaust = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf8');
exhaust = exhaust.replace(
  "const { unitSystem, getUnitLabel, convert } = useUnit();",
  "const { unitSystem } = useUnit();"
);

exhaust = exhaust.replace(
  "const flowUnit = getUnitLabel('airflow');",
  "const flowUnit = unitSystem === 'metric' ? 'L/s' : 'cfm';"
);

exhaust = exhaust.replace(
  "const areaUnit = getUnitLabel('area');",
  "const areaUnit = unitSystem === 'metric' ? 'm²' : 'ft²';"
);

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', exhaust);
console.log("Patched units");
