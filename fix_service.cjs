const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

content = content.replace(
  `method: 'simplified' | 'alternative';\n}`,
  `method: 'simplified' | 'alternative';\n  zones?: any[];\n}`
);

content = content.replace(
  `         error: res.error,\n         method: 'simplified'\n       };`,
  `         error: res.error,\n         method: 'simplified',\n         zones: []\n       };`
);

content = content.replace(
  `         error: res.error,\n         method: 'alternative'\n       };`,
  `         error: res.error,\n         method: 'alternative',\n         zones: res.zoneResults.map((zr, i) => ({\n             zoneId: i.toString(),\n             zpz: zr.zpz,\n             vpzMin: mappedZones[i].vpzMin,\n             voz: mappedZones[i].zoneResult.voz,\n             isCritical: Math.abs(zr.zpz - zdMax) < 0.001\n         }))\n       };`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
