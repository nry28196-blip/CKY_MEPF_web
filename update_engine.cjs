const fs = require('fs');

let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

const injection = `
    input.zones.forEach((z, idx) => {
      if (z.dMode === 'VAV') {
        const voz = zoneResults[idx].voz;
        const vpzMinRequired = input.method === 'Simplified' ? 1.5 * voz : voz;
        
        if (z.vpzMinDesign === null || isNaN(z.vpzMinDesign)) {
          statuses.push('INCOMPLETE');
        } else {
          auditTrail.push({
            symbol: 'Vpz-min',
            name: \`Minimum Primary Airflow (\${z.id})\`,
            formula: input.method === 'Simplified' ? '1.5 × Voz' : 'Voz',
            inputs: { 'Voz': voz, 'Design Vpz-min': z.vpzMinDesign },
            result: z.vpzMinDesign >= vpzMinRequired ? 'PASS' : 'FAIL',
            unit: '',
            reference: input.method === 'Simplified' ? 'ASHRAE 62.1-2025 Section 6.2.5.3.1' : 'ASHRAE 62.1-2025'
          });

          if (z.vpzMinDesign < vpzMinRequired) {
            statuses.push('FAIL');
          }
          if (z.vpz !== null && z.vpzMinDesign > z.vpz) {
            statuses.push('FAIL');
          }
        }
      }
    });

    if (input.method === 'Simplified') {
`;

content = content.replace(/if \(input.method === 'Simplified'\) \{/, injection);

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
