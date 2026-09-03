const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

code = code.replace(
  "import { useUnit } from '../lib/UnitContext';",
  "import { useUnit } from '../lib/UnitContext';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

// Add EngineeringStatusHeader
const insertTarget = `<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">`;
const headerInject = `<EngineeringStatusHeader 
        status="READY" 
        message="Duct Sizing and Pressure Loss evaluation (Equal Friction Method)."
        className="mb-4"
      />\n      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">`;
      
code = code.replace(insertTarget, headerInject);

code = code.replace(/text-\[9px\]/g, "text-xs");
code = code.replace(/text-\[10px\]/g, "text-xs");

fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
console.log("Patched DuctSizingCalc");
