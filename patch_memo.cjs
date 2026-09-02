const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

if (code.includes('import React, { useState, useEffect }')) {
  code = code.replace('import React, { useState, useEffect }', 'import React, { useState, useEffect, useMemo }');
} else if (code.includes('import { useState, useEffect }')) {
  code = code.replace('import { useState, useEffect }', 'import { useState, useEffect, useMemo }');
}

const beforeCompute = `  // Calculate results for each zone
  const zoneResults: { input: ZoneState; result: ZoneVentilationResult }[] = zones.map(z => {`;

const afterCompute = `  // Calculate results for each zone
  const zoneResults = useMemo(() => {
    return zones.map(z => {
      const spaces = Ashrae621Service.getSpacesByEdition(edition);
      const spaceType = spaces.find(s => s.id === z.spaceTypeId) || spaces[0];
      const ezList = Ashrae621Service.getEzByEdition(edition);
      const ezConfig = ezList.find(e => e.id === z.ezId) || ezList[0];
      
      const input: ZoneVentilationInput = {
        spaceType,
        area: z.area,
        designOccupancy: z.occupants,
        useDefaultOccupancy: z.useDefaultOccupancy,
        ezConfig,
        isMetric,
        densityRatio
      };
      
      return {
        input: z,
        result: Ashrae621Service.calculateZoneVentilation(input)
      };
    });
  }, [zones, edition, isMetric, densityRatio]);`;

code = code.replace(/  \/\/ Calculate results for each zone[\s\S]*?    \};\n  \}\);/, afterCompute);

const beforeSystem = `  // Calculate system result
  let systemResult: MultiZoneSystemResult | null = null;
  
  if (systemType === 'multi') {
    const multiInputs: MultiZoneInput[] = zoneResults.map(zr => ({
      zoneId: zr.input.id,
      name: zr.input.name,
      zoneResult: zr.result,
      primaryAirflow: zr.input.primaryAirflow,
      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
    }));
    
    systemResult = MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio
    );
  }`;

const afterSystem = `  // Calculate system result
  const systemResult = useMemo(() => {
    if (systemType !== 'multi') return null;
    
    const multiInputs: MultiZoneInput[] = zoneResults.map(zr => ({
      zoneId: zr.input.id,
      name: zr.input.name,
      zoneResult: zr.result,
      primaryAirflow: zr.input.primaryAirflow,
      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
    }));
    
    return MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio
    );
  }, [systemType, zoneResults, systemPopulation, systemPrimaryAirflow, densityRatio]);`;

code = code.replace(/  \/\/ Calculate system result[\s\S]*?\ densityRatio\n    \);\n  \}/, afterSystem);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Memoized calculations");
