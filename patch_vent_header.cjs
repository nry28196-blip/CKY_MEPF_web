const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(
  "import EngineeringWarning from './EngineeringWarning';",
  "import EngineeringWarning from './EngineeringWarning';\nimport EngineeringStatusHeader from './common/EngineeringStatusHeader';"
);

// Inject after the main title
const headerRegex = /<h2 className="text-xl font-bold text-white mb-1">ASHRAE 62\.1 Ventilation Rate Procedure<\/h2>\s*<p className="text-sm text-slate-400">Calculate outdoor air requirements based on standard 62\.1 methodology\.<\/p>\s*<\/div>\s*<\/div>/;

const newHeader = `<h2 className="text-xl font-bold text-white mb-1">ASHRAE 62.1 Ventilation Rate Procedure</h2>
          <p className="text-sm text-slate-400">Calculate outdoor air requirements based on standard 62.1 methodology.</p>
        </div>
      </div>
      <EngineeringStatusHeader 
        status={validationIssues.length > 0 ? (validationIssues.some(i => i.severity === 'error') ? 'FAIL' : 'WARNING') : 'PASS'} 
        message={validationIssues.length > 0 ? "Calculation contains issues. Please review validation section." : "Required zone and system outdoor airflow requirements satisfied."}
      />`;

if (code.match(headerRegex)) {
  code = code.replace(headerRegex, newHeader);
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
  console.log("Patched Ashrae621VentilationCalc header");
} else {
  console.log("Regex missed for Ashrae621VentilationCalc");
}
