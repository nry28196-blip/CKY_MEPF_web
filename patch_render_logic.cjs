const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const regexEngineeringAssumptions = /\{\/\* Engineering Assumptions Display \*\/\}([\s\S]*?)<\/EngineeringWarning>\n      \)\}/;
if (code.match(regexEngineeringAssumptions)) {
  code = code.replace(regexEngineeringAssumptions, '{/* Automated Engineering Validation Panel */}\n      {validations.length > 0 && (\n        <EngineeringWarning validations={validations} />\n      )}');
}

const regexZpzError = /\{systemResult\.zdMax > 1\.0 && \([\s\S]*?<\/EngineeringWarning>\n            <\/div>\n          \)\}/;
if (code.match(regexZpzError)) {
  code = code.replace(regexZpzError, '');
}

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched render logic");
