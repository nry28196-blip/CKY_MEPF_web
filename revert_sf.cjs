const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Remove the safety factor state
code = code.replace(
  "const [safetyFactor, setSafetyFactor] = useState<number>(1.0);\n  const [appliedSafetyFactor, setAppliedSafetyFactor] = useState<number>(1.0);",
  ""
);

// 2. Revert the flow calculation
code = code.replace(
  "const basePeakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0)\n    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309);\n  const peakFlowLps = basePeakFlowLps * appliedSafetyFactor;",
  "const peakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0)\n    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309);"
);

// 3. Remove the SF UI from the render
const sfUIRegex = /<div className="relative">\s*<input\s*type="number"\s*step="0\.05"\s*min="1\.0"\s*max="2\.0"\s*value=\{safetyFactor\}[\s\S]*?<\/div>\s*<\/div>/;
// Wait, the SF UI has a TooltipLabel above it.
const fullSfUIRegex = /<div>\s*<TooltipLabel\s*label="Safety Factor"[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(fullSfUIRegex, "");

// 4. Remove setAppliedSafetyFactor from handleCalculate
code = code.replace(
  "setAppliedDemandCurveOverride(demandCurveOverride);\n    setAppliedSafetyFactor(safetyFactor);",
  "setAppliedDemandCurveOverride(demandCurveOverride);"
);

// 5. Remove SF from the summary report
code = code.replace(
  "`- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM) [SF: ${appliedSafetyFactor}]\\n` +",
  "`- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM)\\n` +"
);

fs.writeFileSync(file, code);
console.log("Reverted SF");
