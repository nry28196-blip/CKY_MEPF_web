const fs = require('fs');
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

const oldTabsRegex = /<div className="flex flex-wrap bg-slate-950 border border-slate-850 p-0\.5 rounded-xl text-\[10px\] font-bold uppercase w-fit gap-1">[\s\S]*?<\/div>\s*<button\s*onClick=\{\(\) => setIsRefModalOpen\(true\)\}/;

const newTabs = `<div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'standard', label: 'Zone / VAV (ASHRAE 62.1)' },
            { id: 'exhaust', label: 'Commercial Exhaust' },
            { id: 'balance', label: 'Air Balance' },
            { id: 'kitchen', label: 'Kitchen Hood' },
            { id: 'residential', label: 'Residential (62.2)' }
          ].map(mod => (
            <button
              key={mod.id}
              type="button"
              onClick={() => setVentMode(mod.id)}
              className={\`px-3 py-1.5 transition-all cursor-pointer \${
                ventMode === mod.id
                  ? 'bg-cyan-950/30 text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'
              }\`}
            >
              {mod.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsRefModalOpen(true)}`;

if (code.match(oldTabsRegex)) {
  code = code.replace(oldTabsRegex, newTabs);
  fs.writeFileSync('src/components/VentilationCalc.tsx', code);
  console.log("Patched Ventilation tabs");
} else {
  console.log("Regex missed for Ventilation tabs");
}
