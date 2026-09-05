const fs = require('fs');
const file = 'src/components/Ashrae621VentilationCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

// The crash could be from systemResult fields in Ashrae621VentilationCalc if they are somehow missing but INCOMPLETE isn't properly checking them.
// Wait, is it `systemResult.zdMax.toFixed` when `zdMax` is undefined?
// Yes! In `MultiZoneVentilationService.ts`, when `simplified`, `zdMax` is NOT returned! Wait, let's check MultiZoneVentilationService.ts
