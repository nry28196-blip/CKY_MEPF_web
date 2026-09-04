const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
try {
  require('typescript').transpileModule(code, { reportDiagnostics: true });
  console.log("No syntax error in typescript transpileModule");
} catch(e) {
  console.log("Error:", e);
}
