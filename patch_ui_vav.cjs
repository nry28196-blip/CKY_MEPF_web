const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// Add isVAV state
code = code.replace(
  /const \[systemType, setSystemType\] = useState<'single' \| 'multi_simplified' \| 'multi_alternative'>\('single'\);/,
  `const [systemType, setSystemType] = useState<'single' | 'multi_simplified' | 'multi_alternative'>('single');
  const [isVAV, setIsVAV] = useState<boolean>(true);`
);

// Pass to calculateSystem
code = code.replace(
  /MultiZoneVentilationService\.calculateMultiZoneSystem\(\{\n\s*zones: zoneResults\n\s*\}, systemPopulation === '' \? null : systemPopulation, systemPrimaryAirflow === '' \? null : systemPrimaryAirflow, currentErho, method\);/,
  `MultiZoneVentilationService.calculateMultiZoneSystem({
        zones: zoneResults,
        isVAV
      }, systemPopulation === '' ? null : systemPopulation, systemPrimaryAirflow === '' ? null : systemPrimaryAirflow, currentErho, method);`
);

// Disable vpzMin if not VAV
code = code.replace(
  /className="w-full bg-amber-950\/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500"/,
  `disabled={!isVAV}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"`
);

// If !isVAV, we should probably set vpzMin equal to vpz, or just display that it is equal to vpz.
code = code.replace(
  /value=\{zr\.input\.vpzMin\}/,
  `value={!isVAV ? zr.input.primaryAirflow : zr.input.vpzMin}`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
