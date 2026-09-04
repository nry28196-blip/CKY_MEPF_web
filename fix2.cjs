const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// I need to replace:
//       zoneResult: zr.result,
//       primaryAirflow: zr.input.primaryAirflow,
//       vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
//     return MultiZoneVentilationService.calculateMultiZoneSystem(

content = content.replace(
  `      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined\n    return MultiZoneVentilationService.calculateMultiZoneSystem(`,
  `      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined\n    }))};\n    return MultiZoneVentilationService.calculateMultiZoneSystem(`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
