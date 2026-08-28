import fs from 'fs';
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

// Replace standard/kitchen/residential toggle
code = code.replace(
  "const [ventMode, setVentMode] = useState<'standard' | 'kitchen' | 'residential'>('standard');",
  "const [ventMode, setVentMode] = useState<'standard' | 'residential'>('standard');"
);

// Remove kitchen button
const buttonTarget = `        <button
          type="button"
          onClick={() => setVentMode('kitchen')}
          className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
            ventMode === 'kitchen' ? 'bg-rose-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
          }\`}
        >
          Kitchen Hood
        </button>`;
code = code.replace(buttonTarget, "");

// Remove kitchen rendering
const renderTarget = `{ventMode === 'kitchen' && (
        <KitchenVentilationCalc />
      )}`;
code = code.replace(renderTarget, "");

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
