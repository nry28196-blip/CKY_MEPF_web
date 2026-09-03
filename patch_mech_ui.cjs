const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Add EngineeringStatusHeader import
code = code.replace(
  "import { VentilationValidator } from '../validation/VentilationValidator';",
  "import { VentilationValidator } from '../validation/VentilationValidator';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

const coolingHeaderRegex = /<span className="h-2\.5 w-2\.5 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500\/50" \/>\s*<h2 className="text-lg font-bold uppercase tracking-tight text-white">\{t\('mechCoolingTitle'\)\}<\/h2>/;
const newCoolingHeader = `<h2 className="text-lg font-bold text-white">Simplified Cooling Load Estimate</h2>`;
code = code.replace(coolingHeaderRegex, newCoolingHeader);

const headerEndRegex = /(<button\s*type="button"\s*onClick=\{\(\) => setShowCoolingRef\(true\)\}[\s\S]*?<\/button>\s*<\/p>\s*<\/div>\s*<div className="flex bg-slate-950 border border-slate-850 p-0\.5 rounded-xl text-\[10px\] font-bold uppercase w-fit mb-4">[\s\S]*?<\/select>\s*<\/div>\s*<\/div>)/;

const newHeaderEnd = `$1
          <EngineeringStatusHeader 
            status="WARNING" 
            message="Simplified cooling-load model is being used. Does not replace a full ASHRAE heat-balance calculation."
            className="mb-4"
          />`;
code = code.replace(headerEndRegex, newHeaderEnd);

// Fix "Efficiency Benchmarks" to "Reference Benchmarks"
code = code.replace(/Efficiency Benchmarks/g, "Reference Benchmarks");

// Remove glow and overly small text
code = code.replace(/text-\[9px\]/g, "text-xs");
code = code.replace(/text-\[10px\]/g, "text-xs");

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched Mechanical UI");
