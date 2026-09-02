const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const oldRules = `
    const rules: ValidationRule<any>[] = [
      {
        id: 'missing-ps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && state.systemPopulation === ''),
        message: (s) => \`Peak System Population (Ps) was not provided. Assumed equal to sum of peak zone populations (ΣPz = \${Math.ceil(state.sumPz)}). Diversity Ratio (D) = 1.00.\`,
        reference: \`ASHRAE 62.1-\${state.edition}\`
      },
      {
        id: 'missing-vps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && state.systemPrimaryAirflow === ''),
        message: (s) => \`System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = \${Math.ceil(state.sumVpzMin)}).\`,
        reference: \`ASHRAE 62.1-\${state.edition}\`
      },
      {
        id: 'missing-vpzmin',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && state.zones.some(z => z.vpzMin === '')),
        message: 'Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the max(30% of Vpz, Voz).',
        reference: \`ASHRAE 62.1-\${state.edition}\`
      },
      {
        id: 'critical-zpz',
        severity: 'error',
        title: 'Critical System Failure: Zpz > 1.0',
        validate: (s) => !(s.systemType === 'multi' && state.systemResult && state.systemResult.zdMax > 1.0),
        message: 'One or more zones have a Maximum Zone Fraction (Zpz) greater than 1.0. This means the Minimum Primary Airflow (Vpz-min) is less than the Required Outdoor Air (Voz) for that zone. To resolve this, increase the Design Vpz or Vpz-min for the critical zone(s).',
        reference: 'ASHRAE 62.1 § 6.2.5.3.3'
      }
    ];
`;

const newRules = `
    const rules: ValidationRule<any>[] = [
      {
        id: 'missing-ps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.systemPopulation === ''),
        message: (s) => \`Peak System Population (Ps) was not provided. Assumed equal to sum of peak zone populations (ΣPz = \${Math.ceil(s.sumPz)}). Diversity Ratio (D) = 1.00.\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vps',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.systemPrimaryAirflow === ''),
        message: (s) => \`System Primary Airflow (Vps) was not provided. Assumed equal to sum of zone minimum primary airflows (ΣVpz-min = \${Math.ceil(s.sumVpzMin)}).\`,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'missing-vpzmin',
        severity: 'warning',
        title: 'Engineering Assumptions',
        validate: (s) => !(s.systemType === 'multi' && s.zones.some((z: any) => z.vpzMin === '')),
        message: 'Zone Minimum Primary Airflow (Vpz-min) was not provided for one or more zones. Assumed equal to the max(30% of Vpz, Voz).',
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'critical-zpz',
        severity: 'error',
        title: 'Critical System Failure: Zpz > 1.0',
        validate: (s) => !(s.systemType === 'multi' && s.systemResult && s.systemResult.zdMax > 1.0),
        message: 'One or more zones have a Maximum Zone Fraction (Zpz) greater than 1.0. This means the Minimum Primary Airflow (Vpz-min) is less than the Required Outdoor Air (Voz) for that zone. To resolve this, increase the Design Vpz or Vpz-min for the critical zone(s).',
        reference: 'ASHRAE 62.1 § 6.2.5.3.3'
      }
    ];
`;

// use a loose replace
let start = code.indexOf('const rules: ValidationRule<any>[] = [');
let end = code.indexOf('];', start) + 2;
if (start !== -1 && end !== -1) {
  code = code.substring(0, start) + newRules.trim() + code.substring(end);
}

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Fixed state variable shadowing completely");
