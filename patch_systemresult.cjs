const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// I will just replace the rendering of systemResult metrics.
// Specifically replacing Math.round(systemResult.ps) etc with check for systemResult.status
const replacements = [
  { old: 'Math.round(systemResult.ps)', new: 'systemResult.status === "INCOMPLETE" ? "-" : Math.round(systemResult.ps)' },
  { old: 'systemResult.d.toFixed(2)', new: 'systemResult.status === "INCOMPLETE" ? "-" : systemResult.d.toFixed(2)' },
  { old: 'Math.round(systemResult.vps)', new: 'systemResult.status === "INCOMPLETE" ? "-" : Math.round(systemResult.vps)' },
  { old: 'Math.round(systemResult.vou)', new: 'systemResult.status === "INCOMPLETE" ? "-" : Math.round(systemResult.vou)' },
  { old: 'systemResult.xs.toFixed(3)', new: 'systemResult.status === "INCOMPLETE" ? "-" : systemResult.xs.toFixed(3)' },
  { old: 'systemResult.zdMax.toFixed(3)', new: 'systemResult.status === "INCOMPLETE" ? "-" : systemResult.zdMax.toFixed(3)' },
  { old: 'systemResult.ev.toFixed(2)', new: 'systemResult.status === "INCOMPLETE" ? "-" : systemResult.ev.toFixed(2)' },
  { old: 'Math.ceil(systemResult.votActual || systemResult.vot).toLocaleString()', new: 'systemResult.status === "INCOMPLETE" ? "-" : Math.ceil(systemResult.votActual || systemResult.vot).toLocaleString()' },
  { old: 'Math.ceil(systemResult.vot).toLocaleString()', new: 'systemResult.status === "INCOMPLETE" ? "-" : Math.ceil(systemResult.vot).toLocaleString()' },
];

for(const r of replacements) {
  code = code.split(r.old).join(r.new);
}

// In the audit trail, we also need to protect toFixed() calls.
// And systemResult.status check for the status header.
// Actually, earlier in validations, let's fix the rules.
const rulePatchOld = `      {
        id: 'missing-ps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType.startsWith('multi') && s.systemPopulation === ''),
        message: (s) => \`Peak System Population (Ps) was not provided. Assumed equal to sum of peak zone populations (ΣPz = \${Math.ceil(s.sumPz)}). Diversity Ratio (D) = 1.00.\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType.startsWith('multi') && s.systemPrimaryAirflow === ''),
        message: (s) => \`System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = \${Math.ceil(s.sumVpzMin)}).\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vpzmin',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType.startsWith('multi') && s.isVAV && s.zones.some((z: any) => z.vpzMin === '')),
        message: 'Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to Vpz (Constant Volume condition). If this is a VAV system, you must manually provide the minimum primary airflow.',
        reference: \`ASHRAE 62.1-\${edition}\`
      },`;

const rulePatchNew = `      {
        id: 'missing-ps',
        severity: 'error',
        title: 'Missing Required Data',
        validate: (s) => !(s.systemType === 'multi_simplified' && s.systemPopulation === ''),
        message: (s) => \`Peak System Population (Ps) was not provided. Required for Simplified Procedure.\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vps',
        severity: 'error',
        title: 'Missing Required Data',
        validate: (s) => !(s.systemType === 'multi_alternative' && s.systemPrimaryAirflow === ''),
        message: (s) => \`System Primary Airflow (Vps) was not provided. Required for Alternative Procedure.\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vpzmin',
        severity: 'error',
        title: 'Missing Required Data',
        validate: (s) => !(s.systemType.startsWith('multi') && s.isVAV && s.zones.some((z: any) => z.vpzMin === '')),
        message: 'Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Required for VAV systems.',
        reference: \`ASHRAE 62.1-\${edition}\`
      },`;

code = code.replace(rulePatchOld, rulePatchNew);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
