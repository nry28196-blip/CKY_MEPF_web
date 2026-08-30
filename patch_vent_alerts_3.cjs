const fs = require('fs');
let content = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

const regexArea = /\{isExtremeArea && \(\s*<p className="text-\[10px\] text-amber-400 mt-1\.5 flex items-center">\s*<AlertTriangle className="w-3 h-3 mr-1" \/> Unusually large area\. Verify value\.\s*<\/p>\s*\)\}/g;
const replacementArea = `{isExtremeArea && <InputAlert type="warning" message="Unusually large area. Verify value." />}`;

const regexTemp = /\{isExtremeTemp && \(\s*<p className="text-\[10px\] text-amber-400 mt-1\.5 flex items-center">\s*<AlertTriangle className="w-3 h-3 mr-1" \/> Extreme temperature value\. Verify units\.\s*<\/p>\s*\)\}/g;
const replacementTemp = `{isExtremeTemp && <InputAlert type="warning" message="Extreme temperature value. Verify units." />}`;

content = content.replace(regexArea, replacementArea);
content = content.replace(regexTemp, replacementTemp);

fs.writeFileSync('src/components/VentilationCalc.tsx', content);
console.log('VentilationCalc patched (3)');
