const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf-8');

// Replace "Quantity (units or area)" with the specific unit
code = code.replace(
  /<TooltipLabel label="Quantity \(units or area\)" className="text-\[10px\] font-bold text-slate-400 uppercase mb-1\.5" \/>/g,
  `{(() => {
    const space = allSpaces.find(s => s.id === r.categoryId) || allSpaces[0];
    const unitLabel = space.ashraeUnit === 'area' ? (isMetric ? 'm²' : 'ft²') : space.ashraeUnit;
    return <TooltipLabel label={\`Quantity (\${unitLabel})\`} className="text-[10px] font-bold text-slate-400 uppercase mb-1.5" />;
  })()}`
);

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', code);
