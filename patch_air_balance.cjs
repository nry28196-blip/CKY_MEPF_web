const fs = require('fs');
let code = fs.readFileSync('src/components/AirBalanceCalc.tsx', 'utf8');

code = code.replace(
  "import { useUnit } from '../lib/UnitContext';",
  "import { useUnit } from '../lib/UnitContext';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

// Add EngineeringStatusHeader
const insertTarget = `<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">`;
const headerInject = `<EngineeringStatusHeader 
        status="READY" 
        message="Engineering analysis of building and room-level mass airflow balance."
        className="mb-4"
      />\n      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">`;

code = code.replace(insertTarget, headerInject);

code = code.replace(/text-\[9px\]/g, "text-xs");
code = code.replace(/text-\[10px\]/g, "text-xs");

fs.writeFileSync('src/components/AirBalanceCalc.tsx', code);
console.log("Patched AirBalanceCalc");
