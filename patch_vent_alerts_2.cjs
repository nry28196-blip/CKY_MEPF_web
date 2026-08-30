const fs = require('fs');
let content = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

const regex = /\{isExtremeDensity && \(\s*<p className="text-\[10px\] text-amber-400 mt-1\.5 flex items-center">\s*<AlertTriangle className="w-3 h-3 mr-1" \/> High occupant density\. Verify value\.\s*<\/p>\s*\)\}/g;

const replacement = `{isExtremeDensity && <InputAlert type="warning" message="High occupant density. Verify value." />}`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/VentilationCalc.tsx', content);
console.log('VentilationCalc patched (2)');
