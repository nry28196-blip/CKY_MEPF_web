const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// 1. Add states for systemPopulation and systemPrimaryAirflow
file = file.replace(
  /const \[systemType, setSystemType\] = useState\<'single' \| 'multi'\>\('single'\);/,
  `$&
  const [systemPopulation, setSystemPopulation] = useState<number | ''>('');
  const [systemPrimaryAirflow, setSystemPrimaryAirflow] = useState<number | ''>('');`
);

// 2. Add vpzMin to ZoneState
file = file.replace(
  /primaryAirflow: number; \/\/ For multi-zone Vpz/,
  `$&
    vpzMin: number | ''; // Minimum primary airflow (Vpz-min) for VAV`
);

// 3. Update the initial state for zones
file = file.replace(
  /primaryAirflow: 800\n\s*\}/g,
  `primaryAirflow: 800,
      vpzMin: ''
    }`
);

// 4. Update multiInputs mapping
file = file.replace(
  /primaryAirflow: zr\.input\.primaryAirflow\n\s*\}\)\);/g,
  `primaryAirflow: zr.input.primaryAirflow,
      vpzMin: zr.input.vpzMin !== '' ? Number(zr.input.vpzMin) : undefined
    }));`
);

// 5. Update calculateMultiZoneSystem call
file = file.replace(
  /systemResult = MultiZoneVentilationService\.calculateMultiZoneSystem\(multiInputs, 1\.0, densityRatio\);/g,
  `systemResult = MultiZoneVentilationService.calculateMultiZoneSystem(
      multiInputs, 
      systemPopulation === '' ? null : Number(systemPopulation), 
      systemPrimaryAirflow === '' ? null : Number(systemPrimaryAirflow),
      densityRatio
    );`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
