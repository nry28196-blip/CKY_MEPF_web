const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

// Update interface
content = content.replace(
  "    isCritical: boolean;\n  }[];",
  "    isCritical: boolean;\n    vpzMin: number;\n    voz: number;\n  }[];"
);

// Update object creation
const target = `      zoneResults.push({
        zoneId: z.zoneId,
        zpz,
        evz,
        isCritical: false
      });`;

const replacement = `      zoneResults.push({
        zoneId: z.zoneId,
        zpz,
        evz,
        isCritical: false,
        vpzMin,
        voz: z.zoneResult.voz
      });`;

content = content.replace(target, replacement);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Updated result type");
