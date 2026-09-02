const fs = require('fs');
let file = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

if (!file.includes('import ValidatedInput')) {
  file = file.replace(
    /import InputAlert from '\.\/InputAlert';/g,
    `$&
import ValidatedInput from './ValidatedInput';`
  );
}

// Just globally match the specific ones
// 1. Airflow
file = file.replace(
  /<input\n\s*type="number"\n\s*value=\{airflowUnitHook\.getDisplayValue\(airflow\) \|\| ''\}\n\s*onChange=\{\(e\) => setAirflow\(airflowUnitHook\.getInternalValue\(Number\(e\.target\.value\)\)\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput type="number" min={1} errorMsg="Flow > 0" value={airflowUnitHook.getDisplayValue(airflow) || ''} onChange={(e) => setAirflow(airflowUnitHook.getInternalValue(Number(e.target.value)))} />`
);

// 2. Max Velocity
file = file.replace(
  /<input\n\s*type="number"\n\s*value=\{velUnitHook\.getDisplayValue\(maxVelocity\) \|\| ''\}\n\s*onChange=\{\(e\) => setMaxVelocity\(velUnitHook\.getInternalValue\(Number\(e\.target\.value\)\)\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput type="number" min={100} errorMsg="Velocity >= 100" value={velUnitHook.getDisplayValue(maxVelocity) || ''} onChange={(e) => setMaxVelocity(velUnitHook.getInternalValue(Number(e.target.value)))} />`
);

// 3. Friction Rate
file = file.replace(
  /<input\n\s*type="number"\n\s*step="0\.01"\n\s*value=\{frictionUnitHook\.getDisplayValue\(frictionRate\) \|\| ''\}\n\s*onChange=\{\(e\) => setFrictionRate\(frictionUnitHook\.getInternalValue\(Number\(e\.target\.value\)\)\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput type="number" step="0.01" min={0.01} max={5} errorMsg="Friction 0.01-5.0" value={frictionUnitHook.getDisplayValue(frictionRate) || ''} onChange={(e) => setFrictionRate(frictionUnitHook.getInternalValue(Number(e.target.value)))} />`
);

// 4. Custom Width
file = file.replace(
  /<input\n\s*type="number"\n\s*value=\{lenUnitHook\.getDisplayValue\(customWidth\) \|\| ''\}\n\s*onChange=\{\(e\) => setCustomWidth\(lenUnitHook\.getInternalValue\(Number\(e\.target\.value\)\)\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput type="number" min={1} errorMsg="Width > 0" value={lenUnitHook.getDisplayValue(customWidth) || ''} onChange={(e) => setCustomWidth(lenUnitHook.getInternalValue(Number(e.target.value)))} />`
);

// 5. Branch Airflow
file = file.replace(
  /<input\n\s*type="number"\n\s*value=\{airflowUnitHook\.getDisplayValue\(b\.cfm\) \|\| ''\}\n\s*onChange=\{\(e\) => updateBranchCfm\(b\.id, airflowUnitHook\.getInternalValue\(Number\(e\.target\.value\)\)\)\}\n\s*className="[^"]*"/g,
  `<ValidatedInput type="number" min={1} errorMsg="Flow > 0" value={airflowUnitHook.getDisplayValue(b.cfm) || ''} onChange={(e) => updateBranchCfm(b.id, airflowUnitHook.getInternalValue(Number(e.target.value)))} />`
);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', file);
