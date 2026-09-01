const fs = require('fs');
let file = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');

file = file.replace(
  /export default function SystemPerformanceCalc\(\{ globalAltitude = 0, globalAirTemp = 20 \}: \{ globalAltitude\?: number, globalAirTemp\?: number \}\) \{/,
  "export default function SystemPerformanceCalc({ globalAltitude = 0, globalAirTemp = 20, qOutdoorAirProp }: { globalAltitude?: number, globalAirTemp?: number, qOutdoorAirProp?: number }) {"
);

file = file.replace(
  /const \[qOutdoorAir, setQOutdoorAir\] = useState<number>\(isMetric \? 500 : 1000\);/,
  `const [qOutdoorAir, setQOutdoorAir] = useState<number>(qOutdoorAirProp ?? (isMetric ? 500 : 1000));
  
  React.useEffect(() => {
    if (qOutdoorAirProp !== undefined) {
      setQOutdoorAir(qOutdoorAirProp);
    }
  }, [qOutdoorAirProp]);`
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', file);
