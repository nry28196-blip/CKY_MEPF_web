const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

file = file.replace(
  /export default function Ashrae621VentilationCalc\(\{ onVentilationChange, globalAltitude = 0, globalAirTemp = 20 \}: \{ onVentilationChange\?: \(flow: number\) => void, globalAltitude\?: number, globalAirTemp\?: number \}\) \{/,
  `export default function Ashrae621VentilationCalc({ onVentilationChange }: { onVentilationChange?: (flow: number) => void }) {`
);

file = file.replace(
  /const \[edition, setEdition\] = useState<'2019' \| '2022' \| '2025'>\('2022'\);/,
  `const [altitude, setAltitude] = useState<number>(0);\n  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);\n  const [edition, setEdition] = useState<'2019' | '2022' | '2025'>('2022');`
);

file = file.replace(
  /const densityRatio = Ashrae621Service\.getDensityRatio\(globalAltitude, globalAirTemp, isMetric\);/,
  "const densityRatio = Ashrae621Service.getDensityRatio(altitude, airTemp, isMetric);"
);

// We need to restore the inputs in the settings panel.
// In the current file, it has:
/*
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Edition</label>
            <select
*/
// The previous code had 3 columns, or 4 columns.
const replacement = `        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Edition</label>
            <select
              value={edition}
              onChange={(e) => setEdition(e.target.value as any)}
              className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
            >
              <option value="2019">62.1-2019</option>
              <option value="2022">62.1-2022</option>
              <option value="2025">62.1-2025</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Elevation ({isMetric ? 'm' : 'ft'})</label>
            <input type="number" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Air Temp ({isMetric ? '°C' : '°F'})</label>
            <input type="number" value={airTemp} onChange={(e) => setAirTemp(Number(e.target.value))} className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500" />
          </div>
        </div>`;

file = file.replace(
  /        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">\n          <div>\n            <label className="block text-\[10px\] font-bold text-slate-400 mb-1\.5 uppercase">Edition<\/label>\n            <select\n              value=\{edition\}\n              onChange=\{\(e\) => setEdition\(e\.target\.value as any\)\}\n              className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"\n            >\n              <option value="2019">62\.1-2019<\/option>\n              <option value="2022">62\.1-2022<\/option>\n              <option value="2025">62\.1-2025<\/option>\n            <\/select>\n          <\/div>/,
  replacement
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
