const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

const newEvLogic = `
    // System Primary Fraction (Xs)
    const xs = sumVpz > 0 ? vou / sumVpz : 0;

    // System Ventilation Efficiency (Ev)
    // #1 Fix: Exact applicable 62.1 procedure (Normative Appendix A)
    // Ev = 1 + Xs - Zd (for systems with no secondary recirculation)
    // We will calculate Evz for each zone and take the minimum to be fully exact.
    
    let ev = 1.0;
    
    // Calculate exact Evz for each zone
    zoneResults.forEach(zr => {
       const evz = 1 + xs - zr.zpz;
       if (evz < ev) {
          ev = evz;
       }
    });
    
    // Ev cannot be greater than 1.0 or less than 0.1 theoretically
    ev = Math.max(0.1, Math.min(1.0, ev));
`;

code = code.replace(/\/\/ System Primary Fraction \(Xs\)[\s\S]*?(?=\/\/ Required System Outdoor Air Intake \(Vot\))/, newEvLogic + '\n    ');

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
