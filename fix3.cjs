const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// The original map was:
/*
    const multiInputs = { zones: zoneResults.map(zr => ({
      input: zr.input,
      result: zr.result
    }))};
*/
// But let's look at what's actually there.

// I'll just rewrite the `systemResult` useMemo entirely for simplicity.
const systemResultRegex = /const systemResult = useMemo\(\(\) => \{[\s\S]*?\}, \[systemType, zoneResults, systemPopulation, systemPrimaryAirflow, densityRatio\]\);/;
const newSystemResult = `const systemResult = useMemo(() => {
    if (!systemType.startsWith('multi')) return null;
    
    const multiInputs = { zones: zoneResults.map(zr => ({
      input: zr.input,
      result: zr.result
    })) };
    
    return MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio,
      systemType === 'multi_simplified' ? 'simplified' : 'alternative'
    );
  }, [systemType, zoneResults, systemPopulation, systemPrimaryAirflow, densityRatio]);`;

content = content.replace(systemResultRegex, newSystemResult);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
