const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

const target = `const currentValidations = rules
      .filter((r) => !r.validate(state))
      .map((r) => ({
        id: r.id,
        severity: r.severity,
        title: r.title,
        message: typeof r.message === 'function' ? r.message(state) : r.message,
        reference: r.reference
      }));`;

const replacement = `let currentValidations = rules
      .filter((r) => !r.validate(state))
      .map((r) => ({
        id: r.id,
        severity: r.severity,
        title: r.title,
        message: typeof r.message === 'function' ? r.message(state) : r.message,
        reference: r.reference
      }));

    if (systemResult?.error) {
      currentValidations.push({
        id: 'system-error',
        severity: 'error',
        title: 'System Calculation Error',
        message: systemResult.error,
        reference: \`ASHRAE 62.1-\${edition}\`
      });
    } else if (systemResult?.warning) {
      currentValidations.push({
        id: 'system-warning',
        severity: 'warning',
        title: 'Calculation Issue',
        message: systemResult.warning,
        reference: \`ASHRAE 62.1-\${edition}\`
      });
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
