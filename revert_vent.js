import fs from 'fs';
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

// Replace state
code = code.replace(
  "const [ventMode, setVentMode] = useState<'standard' | 'residential'>('standard');",
  "const [ventMode, setVentMode] = useState<'standard' | 'kitchen' | 'residential'>('standard');"
);

// Add button back
const renderTarget = `        <button
          type="button"
          onClick={() => setVentMode('residential')}
          className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
            ventMode === 'residential' ? 'bg-indigo-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
          }\`}
        >
          Residential (62.2)
        </button>`;

const renderReplacement = `        <button
          type="button"
          onClick={() => setVentMode('kitchen')}
          className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
            ventMode === 'kitchen' ? 'bg-rose-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
          }\`}
        >
          Kitchen Hood
        </button>
        <button
          type="button"
          onClick={() => setVentMode('residential')}
          className={\`px-3 py-1.5 rounded-lg transition-all cursor-pointer \${
            ventMode === 'residential' ? 'bg-indigo-650 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
          }\`}
        >
          Residential (62.2)
        </button>`;

code = code.replace(renderTarget, renderReplacement);

const compRender = `{ventMode === 'residential' && (
        <ResidentialVentilationCalc />
      )}`;

const compRenderRep = `{ventMode === 'kitchen' && (
        <KitchenVentilationCalc />
      )}
      {ventMode === 'residential' && (
        <ResidentialVentilationCalc />
      )}`;

code = code.replace(compRender, compRenderRep);

fs.writeFileSync('src/components/VentilationCalc.tsx', code);
