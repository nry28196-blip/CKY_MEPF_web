const fs = require('fs');
let code = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf-8');

code = code.replace(/pz: z\.pz,\s*rp: z\.rp,\s*ra: z\.ra,\s*az: z\.az,\s*voz: zoneResults\[idx\]\.voz,/g, 'voz: zoneResults[idx].voz,');

code = code.replace(/id: z\.id,\s*voz: zoneResults\[idx\]\.voz,\s*vpz: z\.vpz,/g, `id: z.id,
        pz: zoneResults[idx].pz,
        rp: zoneResults[idx].rp,
        ra: zoneResults[idx].ra,
        az: zoneResults[idx].az,
        voz: zoneResults[idx].voz,
        vpz: z.vpz,`);

fs.writeFileSync('src/lib/VentilationEngine.ts', code);
