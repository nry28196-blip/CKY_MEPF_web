const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const target = `<select
            className="bg-slate-900 text-white text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:border-sky-500 outline-none font-bold min-w-[200px]"
            defaultValue="ASHRAE 62.1-2025"
          >`;

const replacement = `<select
            className="bg-slate-900 text-white text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:border-sky-500 outline-none font-bold min-w-[200px]"
            value={governingStandard}
            onChange={(e) => setGoverningStandard(e.target.value)}
          >`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
  console.log("Patched standard select.");
} else {
  console.log("Target not found.");
}
