import fs from 'fs';

const path = 'src/components/Ashrae621ExhaustCalc.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const res = Ashrae621ExhaustService.calculate({ exhaustType, qty, designExhaust: dExhaust });",
  "const res = Ashrae621ExhaustService.calculate({ expectedStandard: 'ASHRAE 62.1', expectedEdition: edition, exhaustType, qty, designExhaust: dExhaust });"
);

const oldRequiredLine = "<div className=\"text-[10px] text-slate-400 mb-1\">Required: {isMetric ? result.requiredExhaust.toFixed(1) : UnitConversionService.lsToCfm(result.requiredExhaust).toFixed(1)} {isMetric ? 'L/s' : 'cfm'}</div>";
const newRequiredLine = "<div className=\"text-[10px] text-slate-400 mb-1\">Required: {result.requiredExhaust === null ? 'N/A' : (isMetric ? result.requiredExhaust.toFixed(1) : UnitConversionService.lsToCfm(result.requiredExhaust).toFixed(1))} {isMetric ? 'L/s' : 'cfm'}</div>";

content = content.replace(oldRequiredLine, newRequiredLine);

const oldStatusLine = "{result.status} (Class {result.exhaustClass})";
const newStatusLine = "{result.status === 'BLOCKED' ? 'NOT VERIFIED' : result.status} {result.exhaustClass !== null ? `(Class ${result.exhaustClass})` : ''}";

content = content.replace(oldStatusLine, newStatusLine);

content = content.replace("? 'bg-emerald-500/20 text-emerald-400' : result.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}", "? 'bg-emerald-500/20 text-emerald-400' : result.status === 'FAIL' ? 'bg-red-500/20 text-red-400' : result.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}");

fs.writeFileSync(path, content);
console.log("Updated Ashrae621ExhaustCalc.tsx");
