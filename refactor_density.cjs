const fs = require('fs');

// 1. Refactor Ashrae621VentilationCalc.tsx
let ashrae = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
ashrae = ashrae.replace(
  /export default function Ashrae621VentilationCalc\(\{ onVentilationChange \}: \{ onVentilationChange\?: \(flow: number\) => void \}\) \{/,
  "export default function Ashrae621VentilationCalc({ onVentilationChange, globalAltitude = 0, globalAirTemp = 20 }: { onVentilationChange?: (flow: number) => void, globalAltitude?: number, globalAirTemp?: number }) {"
);
ashrae = ashrae.replace(/const \[altitude, setAltitude\] = useState<number>\(0\);\n/, '');
ashrae = ashrae.replace(/const \[airTemp, setAirTemp\] = useState<number>\(isMetric \? 20 : 70\);\n/, '');

// Remove the settings fields for altitude and air temp from Ashrae621
ashrae = ashrae.replace(
  /          <div>\n\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Elevation \(\{isMetric \? 'm' : 'ft'\}\)<\/label>[\s\S]+?<\/div>\n\s*<div>\n\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Air Temp \(\{isMetric \? '°C' : '°F'\}\)<\/label>[\s\S]+?<\/div>\n/,
  ''
);

ashrae = ashrae.replace(
  /const densityRatio = Ashrae621Service\.getDensityRatio\(altitude, airTemp, isMetric\);/,
  "const densityRatio = Ashrae621Service.getDensityRatio(globalAltitude, globalAirTemp, isMetric);"
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', ashrae);

// 2. Refactor SystemPerformanceCalc.tsx
let sysPerf = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');
sysPerf = sysPerf.replace(
  /export default function SystemPerformanceCalc\(\) \{/,
  "export default function SystemPerformanceCalc({ globalAltitude = 0, globalAirTemp = 20 }: { globalAltitude?: number, globalAirTemp?: number }) {"
);
sysPerf = sysPerf.replace(/const \[altitude, setAltitude\] = useState<number>\(0\);\n/, '');
sysPerf = sysPerf.replace(/const \[airTemp, setAirTemp\] = useState<number>\(isMetric \? 20 : 70\);\n/, '');

// Remove the settings fields for altitude and air temp from SystemPerformanceCalc
sysPerf = sysPerf.replace(
  /          <div>\n\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Elevation \(\{isMetric \? 'm' : 'ft'\}\)<\/label>\n\s*<input type="number" value=\{altitude\} onChange=\{\(e\) => setAltitude\(Number\(e\.target\.value\)\)\} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500" \/>\n\s*<\/div>\n\s*<div>\n\s*<label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Air Temp \(\{isMetric \? '°C' : '°F'\}\)<\/label>\n\s*<input type="number" value=\{airTemp\} onChange=\{\(e\) => setAirTemp\(Number\(e\.target\.value\)\)\} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500" \/>\n\s*<\/div>\n/,
  ''
);

sysPerf = sysPerf.replace(
  /const densityRatio = Ashrae621Service\.getDensityRatio\(altitude, airTemp, isMetric\);/,
  "const densityRatio = Ashrae621Service.getDensityRatio(globalAltitude, globalAirTemp, isMetric);"
);

fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', sysPerf);

