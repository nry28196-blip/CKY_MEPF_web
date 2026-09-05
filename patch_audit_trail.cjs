const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const replacements = [
  { old: 'value: systemResult.sumPz.toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.sumPz.toFixed(1)' },
  { old: 'value: systemResult.ps.toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.ps.toFixed(1)' },
  { old: 'value: systemResult.d.toFixed(3)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.d.toFixed(3)' },
  { old: 'value: systemResult.vou.toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.vou.toFixed(1)' },
  { old: 'value: systemResult.vps.toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.vps.toFixed(1)' },
  { old: 'value: systemResult.xs.toFixed(3)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.xs.toFixed(3)' },
  { old: 'value: systemResult.zdMax.toFixed(3)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.zdMax.toFixed(3)' },
  { old: 'value: systemResult.ev.toFixed(3)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.ev.toFixed(3)' },
  { old: 'value: systemResult.vot.toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : systemResult.vot.toFixed(1)' },
  { old: 'value: (systemResult.votActual || systemResult.vot).toFixed(1)', new: 'value: systemResult.status === "INCOMPLETE" ? "-" : (systemResult.votActual || systemResult.vot).toFixed(1)' }
];

for(const r of replacements) {
  code = code.split(r.old).join(r.new);
}

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
