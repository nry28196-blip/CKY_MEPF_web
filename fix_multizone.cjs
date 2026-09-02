const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

// We need to fix vpzMin derivation and zpz calculation.
// Also fix sumVpzMin calculation.

const sumVpzMinTarget = `      sumVpzMin += (z.vpzMin !== undefined && z.vpzMin >= 0) ? z.vpzMin : z.primaryAirflow;`;
const sumVpzMinReplacement = `      // 62.1-2025: If Vpz-min is not provided, correctly derive it as max(30% of Vpz, Voz) for VAV safety
      const derivedVpzMin = (z.vpzMin !== undefined && z.vpzMin !== null && z.vpzMin !== '') 
        ? Number(z.vpzMin) 
        : Math.max(z.primaryAirflow * 0.3, z.zoneResult.voz);
      sumVpzMin += derivedVpzMin;`;

content = content.replace(sumVpzMinTarget, sumVpzMinReplacement);

const vpzMinTarget = `      const vpzMin = (z.vpzMin !== undefined && z.vpzMin >= 0) ? z.vpzMin : z.primaryAirflow;
      // Zpz = Voz / Vpz-min
      const zpz = vpzMin > 0 ? z.zoneResult.voz / vpzMin : 0;`;

const vpzMinReplacement = `      const vpzMin = (z.vpzMin !== undefined && z.vpzMin !== null && z.vpzMin !== '') 
        ? Number(z.vpzMin) 
        : Math.max(z.primaryAirflow * 0.3, z.zoneResult.voz);
      
      // Zpz = Voz / Vpz-min. If vpzMin is 0, Zpz is Infinity (highly critical)
      const zpz = vpzMin > 0 ? z.zoneResult.voz / vpzMin : Infinity;`;

content = content.replace(vpzMinTarget, vpzMinReplacement);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Updated MultiZoneVentilationService.ts");
