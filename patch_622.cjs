const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf-8');

code = code.replace(
  `const deficit = input.localExhaustDeficit || 0;`,
  `if (input.localExhaustDeficit === undefined) {
      return {
        qTot: 0, qFan: 0, qInf: input.qInf, phi: input.phi,
        status: 'INCOMPLETE',
        warning: 'Local exhaust deficit parameter is undefined.'
      };
    }
    const deficit = input.localExhaustDeficit;`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', code);
