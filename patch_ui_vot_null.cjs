const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const regex = /systemResult\.status === "INCOMPLETE" \? "-" : Math\.ceil\(systemResult\.votActual \|\| systemResult\.vot\)\.toLocaleString\(\)/g;
code = code.replace(regex, 'systemResult.status === "INCOMPLETE" || systemResult.vot === null ? "-" : Math.ceil(systemResult.votActual || systemResult.vot).toLocaleString()');

const regex2 = /systemResult\.status === "INCOMPLETE" \? "-" : Math\.ceil\(systemResult\.vot\)\.toLocaleString\(\)/g;
code = code.replace(regex2, 'systemResult.status === "INCOMPLETE" || systemResult.vot === null ? "-" : Math.ceil(systemResult.vot).toLocaleString()');

const regex3 = /value: systemResult\.status === "INCOMPLETE" \? "-" : systemResult\.vot\.toFixed\(1\)/g;
code = code.replace(regex3, 'value: systemResult.status === "INCOMPLETE" || systemResult.vot === null ? "-" : systemResult.vot.toFixed(1)');

const regex4 = /value: systemResult\.status === "INCOMPLETE" \? "-" : \(systemResult\.votActual \|\| systemResult\.vot\)\.toFixed\(1\)/g;
code = code.replace(regex4, 'value: systemResult.status === "INCOMPLETE" || systemResult.vot === null ? "-" : (systemResult.votActual || systemResult.vot).toFixed(1)');


fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
