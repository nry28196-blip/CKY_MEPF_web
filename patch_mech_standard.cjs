const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const target = `{/* Sub-tabs toggle */}
      <div className="flex border-b border-slate-800 pb-1 gap-2">`;

const replace = `{/* Global Standard & Code Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-sky-950/10">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center">
            <Bookmark className="w-4 h-4 mr-2 text-sky-400" />
            Governing Code / Standard
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-mono">Project Standard Edition Selection</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
          <select
            className="bg-slate-900 text-white text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:border-sky-500 outline-none font-bold min-w-[200px]"
            defaultValue="ASHRAE 62.1-2025"
          >
            <option value="ASHRAE 62.1-2025">ASHRAE 62.1-2025 (Commercial)</option>
            <option value="ASHRAE 62.1-2022">ASHRAE 62.1-2022 (Commercial)</option>
            <option value="ASHRAE 62.1-2019">ASHRAE 62.1-2019 (Commercial)</option>
            <option value="ASHRAE 62.2-2025">ASHRAE 62.2-2025 (Residential)</option>
            <option value="ASHRAE 62.2-2022">ASHRAE 62.2-2022 (Residential)</option>
            <option value="ASHRAE 62.2-2019">ASHRAE 62.2-2019 (Residential)</option>
          </select>
          {projectType !== 'Commercial' && projectType !== 'Residential' && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
              Special Occupancy Warning
            </span>
          )}
        </div>
      </div>

      {/* Sub-tabs toggle */}
      <div className="flex border-b border-slate-800 pb-1 gap-2 overflow-x-auto hide-scrollbar">`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
console.log("Patched MechanicalCalc standard block");
