const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Replace pie chart data
const oldPieData = `data={[
                              ["Category", "Estimated Cooling Capacity"],
                              ['Structural', results.spaceWatts * 0.50],
                              ['Lighting', results.spaceWatts * 0.15],
                              ['Equipment', results.spaceWatts * 0.35],
                              ['Occupants', results.occWatts * 1.0]
                            ]}`;
const newPieData = `data={[
                              ["Category", "Estimated Cooling Capacity"],
                              ['People', results.peopleSensible + results.peopleLatent],
                              ['Lighting', results.lightingSensible],
                              ['Equipment', results.equipmentSensible],
                              ['Envelope', results.wallSensible + results.roofSensible + results.windowCondSensible],
                              ['Solar', results.solarSensible],
                              ['Ventilation', results.ventSensible + results.ventLatent],
                              ['Infiltration', results.infiltrationSensible + results.infiltrationLatent]
                            ]}`;
content = content.replace(oldPieData, newPieData);

// Replace Pie Chart Legend
const oldLegend = `<div className="flex justify-center flex-wrap gap-4 text-[10px] font-bold uppercase">
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#4ade80]" /> <span className="text-slate-400">Structural</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#93c5fd]" /> <span className="text-slate-400">Lighting</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#64748b]" /> <span className="text-slate-400">Equipment</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#1e293b]" /> <span className="text-slate-400">Occupants</span></div>
                           </div>`;
const newLegend = `<div className="flex justify-center flex-wrap gap-4 text-[10px] font-bold uppercase">
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#f43f5e]" /> <span className="text-slate-400">People</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#facc15]" /> <span className="text-slate-400">Lighting</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#818cf8]" /> <span className="text-slate-400">Equipment</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#4ade80]" /> <span className="text-slate-400">Envelope</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#fb923c]" /> <span className="text-slate-400">Solar</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#38bdf8]" /> <span className="text-slate-400">Vent</span></div>
                             <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#94a3b8]" /> <span className="text-slate-400">Infil</span></div>
                           </div>`;
content = content.replace(oldLegend, newLegend);

const oldColors = `colors: ['#4ade80', '#93c5fd', '#64748b', '#1e293b'],`;
const newColors = `colors: ['#f43f5e', '#facc15', '#818cf8', '#4ade80', '#fb923c', '#38bdf8', '#94a3b8'],`;
content = content.replace(oldColors, newColors);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
