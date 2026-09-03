const fs = require('fs');
let code = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');

// Add EngineeringStatusHeader import
code = code.replace(
  "import ValidatedInput from './ValidatedInput';",
  "import ValidatedInput from './ValidatedInput';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

// Replace main title and description
code = code.replace(
  /IAQ & Filtration/,
  "CO₂ / DCV Engineering Analysis"
);
code = code.replace(
  /Analyze Demand Controlled Ventilation, CO₂ concentrations, and filtration efficacy./,
  "Analyze Demand Controlled Ventilation, CO₂ concentrations, filtration efficacy, and separation distances."
);

// Inject Status Header
const headerInject = `<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">`;
const statusHeader = `<EngineeringStatusHeader 
        status={dcvCO2 > maxAllowedCO2 ? 'WARNING' : 'READY'} 
        message={dcvCO2 > maxAllowedCO2 ? "Estimated CO₂ exceeds max allowable threshold." : "DCV calculations ready."}
        className="mb-4"
      />\n      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">`;
code = code.replace(headerInject, statusHeader);

// Expose Activity Level input
const inputsRegex = /(<ValidatedInput type="number" min=\{0\} value=\{area\} onChange=\{\(e\) => setArea\(Number\(e\.target\.value\)\)\} \/>\s*<\/div>)/;
const newInputs = `$1
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">CO₂ Generation Rate ({isMetric ? 'L/s/person' : 'cfm/person'})</label>
              <ValidatedInput type="number" min={0} step={0.001} value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))} />
            </div>`;
code = code.replace(inputsRegex, newInputs);

// Fix Filtration title
code = code.replace(
  /Filtration Effectiveness/,
  "Filter Rating Reference"
);

// Fix Separation title
code = code.replace(
  /ASHRAE 62.1 Separation Distances/,
  "Simplified Separation Check (ASHRAE 62.1)"
);

// Cleanup small text
code = code.replace(/text-\[9px\]/g, "text-xs");
code = code.replace(/text-\[10px\]/g, "text-xs");
code = code.replace(/tracking-widest/g, "tracking-wider");

fs.writeFileSync('src/components/IAQCalc.tsx', code);
console.log("Patched IAQCalc");
