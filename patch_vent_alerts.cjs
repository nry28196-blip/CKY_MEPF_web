const fs = require('fs');
let content = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

if (!content.includes("import InputAlert")) {
  content = content.replace("import TooltipLabel from './TooltipLabel';", "import TooltipLabel from './TooltipLabel';\nimport InputAlert from './InputAlert';");
}

// 1. Extreme density alert
content = content.replace(
  /\{isExtremeDensity && \(\s*<p className="text-\[10px\] text-amber-500 font-mono mt-1">\s*<AlertTriangle className="w-3 h-3 mr-1" \/> High occupant density\. Verify value\.\s*<\/p>\s*\)\}/g,
  `{isExtremeDensity && <InputAlert type="warning" message="High occupant density. Verify value." />}`
);

fs.writeFileSync('src/components/VentilationCalc.tsx', content);
console.log('VentilationCalc patched');
