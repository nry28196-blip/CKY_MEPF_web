const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import EngineeringWarning from './EngineeringWarning';",
    "import EngineeringWarning from './EngineeringWarning';\nimport EngineeringAuditTrail from './EngineeringAuditTrail';"
  );
}

const startString = "{/* System Audit Trail */}";
const endString = '          <div className="mt-6 pt-4 border-t border-slate-800/60">';

let startIndex = code.indexOf(startString);
let tempEndIndex = code.indexOf(endString, startIndex);
let endIndex = code.indexOf(endString, tempEndIndex + 1);

// Actually, let's just find the exact block.
const blockToReplaceRegex = /\{\/\* System Audit Trail \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="mt-6 pt-4 border-t border-slate-800\/60">/;

const newAuditText = `{/* System Audit Trail */}
          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <EngineeringAuditTrail
              codeReference={\`ASHRAE 62.1-\${edition}\`}
              variables={[
                { symbol: 'ΣPz', name: 'Sum of Zone Populations', value: Math.ceil(systemResult.sumPz), unit: 'people' },
                { symbol: 'Ps', name: 'Peak System Population', value: Math.ceil(systemResult.ps), unit: 'people' },
                { symbol: 'D', name: 'Diversity Ratio', formula: 'Ps / ΣPz', value: systemResult.d.toFixed(3), reference: 'Eq. 6.2.5.3.1' },
                { symbol: 'Vou', name: 'Uncorrected Outdoor Air', formula: 'D×Σ(Rp×Pz) + Σ(Ra×Az)', value: Math.round(systemResult.vou), unit: flowUnit, reference: 'Eq. 6.2.5.3' },
                { symbol: 'Vps', name: 'System Primary Airflow', value: Math.round(systemResult.vps), unit: flowUnit },
                { symbol: 'Xs', name: 'System Primary Fraction', formula: 'Vou / Vps', value: systemResult.xs.toFixed(3) },
                { symbol: 'Zd', name: 'Max Zone Fraction', formula: 'Max(Zpz)', value: systemResult.zdMax.toFixed(3) },
                { symbol: 'Ev', name: 'System Ventilation Efficiency', formula: 'Min(Evz)', value: systemResult.ev.toFixed(3), reference: 'Eq. 6.2.5.4.1 / App. A' },
                { symbol: 'Vot', name: 'Standard Required System Outdoor Air', formula: 'Vou / Ev', value: Math.round(systemResult.vot), unit: flowUnit, reference: 'Eq. 6.2.5.1' },
                { symbol: 'Eρ', name: 'Density Ratio', formula: 'ρ_actual / ρ_standard', value: densityRatio.toFixed(3) },
                { symbol: 'Vot_actual', name: 'Density Corrected Required Outdoor Air', formula: 'Vot / Eρ', value: Math.ceil(systemResult.votActual || systemResult.vot), unit: flowUnit },
              ]}
            />
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/60">`;

if (code.match(blockToReplaceRegex)) {
  code = code.replace(blockToReplaceRegex, newAuditText);
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
  console.log("Replaced system audit trail via regex");
} else {
  console.log("Regex not matched again");
}
