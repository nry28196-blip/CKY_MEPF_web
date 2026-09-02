const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(/export default function Ashrae621VentilationCalc\(\{\s*onVentilationChange\s*\}\s*:\s*\{\s*onVentilationChange\?: \(\w+: number\) => void\s*\}\)/g, 
  "export default function Ashrae621VentilationCalc({ onVentilationChange, edition = '2025' }: { onVentilationChange?: (flow: number) => void, edition?: '2019' | '2022' | '2025' })");

code = code.replace(/const \[edition, setEdition\] = useState<'2019' \| '2022' \| '2025'>\('2022'\);\n?/g, "");

const target2 = `        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <ValidatedInput type="number" min={-1000} errorMsg="Altitude must be >= -1000" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
          </div>`;

const replacement2 = `        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Elevation ({isMetric ? 'm' : 'ft'})</label>
            <ValidatedInput type="number" min={-1000} errorMsg="Altitude must be >= -1000" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
          </div>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched successfully");
