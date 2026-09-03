const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Update SubTab type
code = code.replace(
  "type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation' | 'fanDuty';",
  "export type SubTab = 'cooling' | 'ventilation' | 'exhaust' | 'airBalance' | 'iaq' | 'ductSizing' | 'fanDuty' | 'formulas';\n\nexport const mechanicalModules = [\n  { id: 'cooling', label: 'Simplified Cooling Load Estimate' },\n  { id: 'ventilation', label: 'Ventilation' },\n  { id: 'exhaust', label: 'Exhaust' },\n  { id: 'airBalance', label: 'Air Balance' },\n  { id: 'iaq', label: 'CO₂ / DCV Engineering Analysis' },\n  { id: 'ductSizing', label: 'Duct Design' },\n  { id: 'fanDuty', label: 'Fan Duty' },\n  { id: 'formulas', label: 'References' }\n];"
);

// 2. Replace the hardcoded tabs with a map over mechanicalModules
const tabsRegex = /<div className="flex border-b border-slate-800 pb-1 gap-2 overflow-x-auto hide-scrollbar">[\s\S]*?<\/div>\s*{\/\* Toast Alert \*\//;

const newTabs = `<div className="flex border-b border-slate-800 pb-1 gap-2 overflow-x-auto hide-scrollbar">
        {mechanicalModules.map(mod => (
          <button
            key={mod.id}
            onClick={() => setSubTab(mod.id as SubTab)}
            className={\`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 \${
              subTab === mod.id
                ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }\`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      {/* Toast Alert */`;

code = code.replace(tabsRegex, newTabs);

// 3. Fix the conditional rendering so it uses all modules correctly
// But wait, the conditional rendering actually handles everything but exhaust/iaq/airBalance were only there if we could click them!
// Now that they are clickable, the existing switch will just work because they are already there!
// Let's verify if they are there.

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched MechanicalCalc tabs");
