const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf-8');

// Update calculateCoolingLoad
code = code.replace(
  /const numArea = Number\(area\) \|\| 0;\n\s*const numOccupants = Number\(occupants\) \|\| 0;/,
  `const numArea = area !== '' && area !== undefined ? Number(area) : NaN;
    const numOccupants = occupants !== '' && occupants !== undefined ? Number(occupants) : NaN;
    const numHeight = height !== '' && height !== undefined ? Number(height) : NaN;
    
    if (isNaN(numArea) || isNaN(numOccupants) || isNaN(numHeight)) {
      return {
        status: 'INCOMPLETE',
        warning: 'Missing or invalid required geometry/occupancy parameters.',
        peopleSensible: 0, peopleLatent: 0, lightingSensible: 0, equipmentSensible: 0,
        wallSensible: 0, roofSensible: 0, windowCondSensible: 0, solarSensible: 0,
        ventSensible: 0, ventLatent: 0, infiltrationSensible: 0, infiltrationLatent: 0, 
        totalSensible: 0, totalLatent: 0,
        calculatedTotal: 0, finalTotal: 0,
        watts: 0, btu: 0, tons: 0
      };
    }
    const status = 'PASS';`
);

code = code.replace(
  /const numVolume = numArea \* height;/,
  `const numVolume = numArea * numHeight;`
);

// We need to pass `status` to the return object
code = code.replace(
  /watts: finalTotal,\n\s*btu: finalTotal \* 3\.412142,\n\s*tons: finalTotal \/ 3516\.85284/,
  `watts: finalTotal,
      btu: finalTotal * 3.412142,
      tons: finalTotal / 3516.85284,
      status`
);

// Fix the display of all those '|| 0' and '|| 1'
// Since they use Math.round(results.xxxx || 0), we can just replace the entire block of results if results.status === 'INCOMPLETE'
// Or we can just do a regex replace for `results.xxx || 0` -> `results.xxx` and let it be 0 if status is INCOMPLETE, but the prompt says:
// "replace all '|| 0' or '|| 1' default-value patterns with explicit 'INCOMPLETE' status handling"

// Let's replace '|| 0' with '' or handle it.
// Actually, it's safer to just replace all `|| 0` in formatting.
code = code.replace(/results\.calculatedTotal \|\| 0/g, 'results.calculatedTotal');
code = code.replace(/results\.totalSensible \|\| 0/g, 'results.totalSensible');
code = code.replace(/results\.totalLatent \|\| 0/g, 'results.totalLatent');
code = code.replace(/results\.watts \|\| 0/g, 'results.watts');
code = code.replace(/results\.btu \|\| 0/g, 'results.btu');
code = code.replace(/results\.tons \|\| 0/g, 'results.tons');

// Other instances
code = code.replace(/Number\(area\) \|\| 1/g, "(Number(area) > 0 ? Number(area) : NaN)");
code = code.replace(/Number\(occupants\) \|\| 1/g, "(Number(occupants) > 0 ? Number(occupants) : NaN)");
code = code.replace(/smallestRoomVol \|\| 1/g, "(smallestRoomVol > 0 ? smallestRoomVol : NaN)");
code = code.replace(/ventilationDetails\.zoneResults\[0\]\.result\?\.ez \|\| 1\.0/g, "ventilationDetails.zoneResults[0].result?.ez ?? 1.0");

code = code.replace(/Math\.round\(ventilationDetails\.zoneResults\[0\]\.result\?\.vbz \|\| 0\)/g, "ventilationDetails.zoneResults[0].result?.vbz !== undefined ? Math.round(ventilationDetails.zoneResults[0].result.vbz) : '-'");
code = code.replace(/Math\.round\(ventilationDetails\.zoneResults\[0\]\.result\?\.voz \|\| 0\)/g, "ventilationDetails.zoneResults[0].result?.voz !== undefined ? Math.round(ventilationDetails.zoneResults[0].result.voz) : '-'");

code = code.replace(
/const numArea = Number\(area\) \|\| 0;\n\s*const numVol = Number\(volume\) \|\| 0;\n\s*const numOcc = Number\(occupants\) \|\| 0;/g,
`const numArea = area !== '' && area !== undefined ? Number(area) : NaN;
                        const numVol = volume !== '' && volume !== undefined ? Number(volume) : NaN;
                        const numOcc = occupants !== '' && occupants !== undefined ? Number(occupants) : NaN;
                        if (isNaN(numArea) || isNaN(numOcc)) {
                          triggerToast('INCOMPLETE: Missing required inputs.');
                          return;
                        }`
);

code = code.replace(
/exportCoolingLoadToCsv\(\{\n\s*basis: estimationBasis,\n\s*area: Number\(area\) \|\| 0,\n\s*volume: Number\(volume\) \|\| 0,\n\s*occupants: Number\(occupants\) \|\| 0,/g,
`if (results.status === 'INCOMPLETE') { triggerToast('INCOMPLETE: Cannot export.'); return; }
                      exportCoolingLoadToCsv({
                        basis: estimationBasis,
                        area: Number(area),
                        volume: Number(volume),
                        occupants: Number(occupants),`
);

code = code.replace(
/const size = Number\(newRoomSize\) \|\| 0;\n\s*const occupantsCount = Number\(newRoomOccupants\) \|\| 0;/g,
`const size = newRoomSize !== '' ? Number(newRoomSize) : NaN;
                          const occupantsCount = newRoomOccupants !== '' ? Number(newRoomOccupants) : NaN;
                          if (isNaN(size) || isNaN(occupantsCount)) {
                            triggerToast('INCOMPLETE: Missing required room parameters.');
                            return;
                          }`
);

// We need to render the INCOMPLETE status in the UI
// Look for EngineeringStatusHeader with 'WARNING'
code = code.replace(
/<EngineeringStatusHeader\s*\n\s*status="WARNING"\s*\n\s*message="Simplified cooling-load model is being used. Does not replace a full ASHRAE heat-balance calculation."\s*\n\s*className="mb-4"\s*\n\s*\/>/g,
`{results.status === 'INCOMPLETE' ? (
            <EngineeringStatusHeader 
              status="INCOMPLETE" 
              message={results.warning || 'Missing required parameters.'}
              className="mb-4"
            />
          ) : (
            <EngineeringStatusHeader 
              status="WARNING" 
              message="Simplified cooling-load model is being used. Does not replace a full ASHRAE heat-balance calculation."
              className="mb-4"
            />
          )}`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
