const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const additionalRules = `
      {
        id: 'system-error',
        severity: 'error',
        title: 'System Calculation Error',
        validate: (s) => !s.systemResult?.error,
        message: (s) => s.systemResult.error,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'system-warning',
        severity: 'warning',
        title: 'System Calculation Warning',
        validate: (s) => !s.systemResult?.warning,
        message: (s) => s.systemResult.warning,
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'zone-error',
        severity: 'error',
        title: 'Zone Calculation Error',
        validate: (s) => !s.systemResult?.zones?.some((z: any) => z.status === 'FAIL' || z.status === 'INCOMPLETE'),
        message: 'One or more zones failed to calculate or are incomplete.',
        reference: \`ASHRAE 62.1-\${edition}\`
      },
      {
        id: 'zone-warning',
        severity: 'warning',
        title: 'Zone Calculation Warning',
        validate: (s) => !s.systemResult?.zones?.some((z: any) => z.status === 'WARNING'),
        message: 'One or more zones contain calculation warnings.',
        reference: \`ASHRAE 62.1-\${edition}\`
      }
    ];`;

code = code.replace(/    \];/g, additionalRules);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
