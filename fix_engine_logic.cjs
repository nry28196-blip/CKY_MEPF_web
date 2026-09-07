const fs = require('fs');
let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

// Single Zone Update
content = content.replace(
  /const vozStandard = zoneResult\.voz;\n    const votStandard = vozStandard;\n    const votDensityCorrected = votStandard \* densityResult\.eRho;\n\n    return \{/g,
  `const vozStandard = zoneResult.voz;
    const votStandard = vozStandard;
    const votDensityCorrected = votStandard * densityResult.eRho;
    
    const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [
      {
        symbol: 'Vot_standard',
        name: 'Standard Required Outdoor Air',
        formula: 'Voz (Single Zone)',
        inputs: { 'Voz': vozStandard },
        result: votStandard,
        unit: 'L/s',
        reference: 'ASHRAE 62.1-2025 Section 6.2.6.1'
      },
      {
        symbol: 'Vot_actual',
        name: 'Density Corrected Required Outdoor Air',
        formula: 'Vot_standard × Eρ',
        inputs: { 'Vot_standard': votStandard, 'Eρ': densityResult.eRho },
        result: votDensityCorrected,
        unit: 'L/s',
        reference: 'ASHRAE 62.1-2025 Section 6.2.4.4 (Errata Equation 6-10)'
      }
    ];

    return {`
);

content = content.replace(
  /finalDesignOutdoorAir: null, revisionState: 'ASHRAE 62\.1-2025 Base \+ Errata', status\n        \};/g,
  "finalDesignOutdoorAir: null, auditTrail: [], revisionState: 'ASHRAE 62.1-2025 Base + Errata', status\n        };"
);

content = content.replace(
  /finalDesignOutdoorAir: votDensityCorrected,\n      revisionState: 'ASHRAE 62\.1-2025 Base \+ Errata',\n      status\n    \};/g,
  "finalDesignOutdoorAir: votDensityCorrected,\n      auditTrail,\n      revisionState: 'ASHRAE 62.1-2025 Base + Errata',\n      status\n    };"
);

// Multi Zone Update
content = content.replace(
  /let votStandard: number \| null = null;\n    let votDensityCorrected: number \| null = null;\n\n    if \(status !== 'FAIL'/g,
  `let votStandard: number | null = null;
    let votDensityCorrected: number | null = null;
    const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [];

    if (status !== 'FAIL'`
);

content = content.replace(
  /votStandard = vou \/ ev;\n      votDensityCorrected = votStandard \* densityResult\.eRho;\n    \}/g,
  `votStandard = vou / ev;
      votDensityCorrected = votStandard * densityResult.eRho;
      
      auditTrail.push({
        symbol: 'Vot_standard',
        name: 'Standard Required Outdoor Air',
        formula: 'Vou / Ev',
        inputs: { 'Vou': vou, 'Ev': ev },
        result: votStandard,
        unit: 'L/s',
        reference: 'ASHRAE 62.1-2025 Equation 6-10 (Pre-correction)'
      });
      auditTrail.push({
        symbol: 'Vot_actual',
        name: 'Density Corrected Required Outdoor Air',
        formula: 'Vot_standard × Eρ',
        inputs: { 'Vot_standard': votStandard, 'Eρ': densityResult.eRho },
        result: votDensityCorrected,
        unit: 'L/s',
        reference: 'ASHRAE 62.1-2025 Section 6.2.4.4 (Errata Equation 6-10)'
      });
    }`
);

content = content.replace(
  /finalDesignOutdoorAir: votDensityCorrected,\n      revisionState: 'ASHRAE 62\.1-2025 Base \+ Errata',\n      status: finalStatus\n    \};/g,
  "finalDesignOutdoorAir: votDensityCorrected,\n      auditTrail,\n      revisionState: 'ASHRAE 62.1-2025 Base + Errata',\n      status: finalStatus\n    };"
);

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
