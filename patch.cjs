const fs = require('fs');

const file = 'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts';
let code = fs.readFileSync(file, 'utf8');

// Update AlternativeZoneResult interface
code = code.replace(
  'vpzMin: number;',
  'vpzMin: number;\n  vdzMin: number;'
);

// Update map
code = code.replace(
  /let missingEpEr = false;\n    const zoneCalcs = input\.zones\.map\(z => {([\s\S]*?)let fa = ep \+ \(1 - ep\) \* er;\n      let fb = ep;\n      let fc = 1 - \(1 - z\.ez\) \* \(1 - er\) \* \(1 - ep\);\n      return { id: z\.id, vpzMin, zd, ep, er, fa, fb, fc, evz: 1\.0 };\n    }\);/m,
`    let missingEpEr = false;
    let hasInvalidZd = false;
    let hasZeroVdz = false;
    const zoneCalcs = input.zones.map(z => {
      let vpzMin = z.dMode === 'VAV' ? (z.vpzMinDesign || z.vpzMinRequired) : (z.vpz || 0);
      
      let ep = 1.0;
      let er = 0.0;
      
      if (input.systemType === 'single_supply') {
        ep = 1.0;
        er = 0.0;
      } else {
        if (z.ep === null || z.ep === undefined || isNaN(z.ep)) missingEpEr = true;
        else ep = z.ep;
        
        if (z.er === null || z.er === undefined || isNaN(z.er)) missingEpEr = true;
        else er = z.er;
      }

      let vdzMin = 0;
      if (ep > 0) {
        vdzMin = vpzMin / ep;
      } else {
        hasZeroVdz = true;
      }

      let zd = vdzMin > 0 ? z.voz / vdzMin : 1.0;
      if (zd > 1.0) hasInvalidZd = true;
      
      let fa = ep + (1 - ep) * er;
      let fb = ep;
      let fc = 1 - (1 - z.ez) * (1 - er) * (1 - ep);
      return { id: z.id, vpzMin, vdzMin, zd, ep, er, fa, fb, fc, evz: 1.0 };
    });`
);

// Update error handling block
code = code.replace(
  /    if \(missingEpEr\) {([\s\S]*?)return { zoneResults: \[\], ev: null, vou, vps, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };\n    }/m,
`    if (missingEpEr) {
      statuses.push('INCOMPLETE');
      auditTrail.push({
        symbol: 'Ep/Er',
        name: 'Missing Secondary Recirculation Inputs',
        formula: 'Ep, Er Required',
        inputs: {},
        result: 'INCOMPLETE',
        unit: '',
        reference: 'ASHRAE 62.1 Alternative Procedure',
        status: AuditStatus.FAIL
      });
      const finalStatus = VentilationValidationService.aggregateStatus(statuses);
      return { zoneResults: [], ev: null, vou, vps, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };
    }

    if (hasZeroVdz || hasInvalidZd) {
      statuses.push('FAIL');
      auditTrail.push({
        symbol: 'Zd',
        name: 'Zone Discharge Airflow Validation',
        formula: 'Zd <= 1.0 and Vdz > 0',
        inputs: {},
        result: 'FAIL',
        unit: '',
        reference: 'ASHRAE 62.1-2025 Appendix A',
        status: AuditStatus.FAIL
      });
      const finalStatus = VentilationValidationService.aggregateStatus(statuses);
      return { zoneResults: [], ev: null, vou, vps, xs: null, criticalZoneId: null, status: finalStatus, auditTrail };
    }`
);

// Update final return mapping
code = code.replace(
  /        vpzMin: zc\.vpzMin,\n        zd: zc\.zd,/m,
`        vpzMin: zc.vpzMin,
        vdzMin: zc.vdzMin,
        zd: zc.zd,`
);

fs.writeFileSync(file, code);
