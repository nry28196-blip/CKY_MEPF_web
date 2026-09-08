const fs = require('fs');

let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

// I'll search for CoolingLoadResult and add auditTrail
content = content.replace(
  /export interface CoolingLoadResult \{/,
  "export interface CoolingLoadResult {\n  auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[];"
);

content = content.replace(
  /export interface VrfSystemResult \{/,
  "export interface VrfSystemResult {\n  auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[];"
);

// We need to actually populate the audit trail in calculateCoolingLoad
// Let's modify calculateCoolingLoad to push to an auditTrail array
let match = content.match(/static calculateCoolingLoad\(input: CoolingLoadInput\): CoolingLoadResult \{[\s\S]*?return \{[\s\S]*?\};\n  \}/);

if (match) {
  let coolingMethod = match[0];
  
  coolingMethod = coolingMethod.replace(/static calculateCoolingLoad\(input: CoolingLoadInput\): CoolingLoadResult \{/, `static calculateCoolingLoad(input: CoolingLoadInput): CoolingLoadResult {\n    const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [];`);
  
  // before the first return (INCOMPLETE case)
  coolingMethod = coolingMethod.replace(/warning: 'Missing or invalid required geometry\/occupancy parameters.',/, `warning: 'Missing or invalid required geometry/occupancy parameters.',\n        auditTrail,`);
  
  // before the final return
  coolingMethod = coolingMethod.replace(/return \{[\s\n]*status: 'PASS',/, `
    auditTrail.push({
      symbol: 'Qt',
      name: 'Total Sensible Cooling Load',
      formula: 'Qp + Ql + Qe + Qw + Qr + Qwc + Qs + Qv + Qi',
      inputs: { 'Qp': peopleSensible, 'Ql': lightingSensible, 'Qv': ventSensible, 'Qs': solarSensible },
      result: totalSensible,
      unit: 'W',
      reference: 'ASHRAE Fundamentals → 2021 → Chapter 18 → Base'
    });
    
    auditTrail.push({
      symbol: 'Qtot',
      name: 'Total Space Cooling Load',
      formula: '(Qt_sensible + Qt_latent) × (1 + Safety)',
      inputs: { 'Qt_sens': totalSensible, 'Qt_lat': totalLatent, 'Safety': safetyFactor },
      result: finalTotal,
      unit: 'W',
      reference: 'ASHRAE Fundamentals → 2021 → Chapter 18 → Base'
    });
    
    return {
      status: 'PASS',
      auditTrail,`);
  
  content = content.replace(match[0], coolingMethod);
}

// Modify calculateVrfSystem
let matchVrf = content.match(/static calculateVrfSystem\(input: VrfSystemInput\): VrfSystemResult \{[\s\S]*?return \{[\s\S]*?\};\n  \}/);
if (matchVrf) {
  let vrfMethod = matchVrf[0];
  vrfMethod = vrfMethod.replace(/static calculateVrfSystem\(input: VrfSystemInput\): VrfSystemResult \{/, `static calculateVrfSystem(input: VrfSystemInput): VrfSystemResult {\n    const auditTrail: import('../calculations/ventilation/Ashrae621ZoneService').AuditTrailItem[] = [];`);
  
  vrfMethod = vrfMethod.replace(/return \{[\s\n]*enrichedRooms,/, `
    auditTrail.push({
      symbol: 'CR',
      name: 'Combination Ratio',
      formula: '(ΣIDU / ODU) × 100',
      inputs: { 'ΣIDU': totalConnectedTons, 'ODU': oduCapacityTons },
      result: combinationRatio,
      unit: '%',
      reference: 'AHRI 1230 → 2021 → Section 3.8 → Base'
    });

    auditTrail.push({
      symbol: 'm_add',
      name: 'Additional Refrigerant Charge',
      formula: 'L × m_rate',
      inputs: { 'L': input.pipingLength, 'm_rate': chargePerMeter },
      result: additionalCharge,
      unit: 'kg',
      reference: 'ASHRAE 15 → 2022 → Section 7.3.2 → Base'
    });

    auditTrail.push({
      symbol: 'RCL',
      name: 'Refrigerant Concentration Limit',
      formula: 'm_total / V_smallest',
      inputs: { 'm_total': totalCharge, 'V_smallest': smallestRoomVol },
      result: toxicConcentration,
      unit: 'kg/m³',
      reference: 'ASHRAE 15 → 2022 → Section 7.3.1 → Base'
    });

    return {
      auditTrail,
      enrichedRooms,`);
      
  content = content.replace(matchVrf[0], vrfMethod);
}

fs.writeFileSync('src/lib/VentilationEngine.ts', content);

