const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const tableCode = `
                  <div className="mt-8 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                    <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Detailed ASHRAE Calculation Breakdown</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/50 text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-800">
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Sensible (W)</th>
                            <th className="px-4 py-2">Latent (W)</th>
                            <th className="px-4 py-2">Total (W)</th>
                            <th className="px-4 py-2">%</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-mono text-slate-300">
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-rose-400">People</td>
                            <td className="px-4 py-2">{Math.round(results.peopleSensible)}</td>
                            <td className="px-4 py-2">{Math.round(results.peopleLatent)}</td>
                            <td className="px-4 py-2">{Math.round(results.peopleSensible + results.peopleLatent)}</td>
                            <td className="px-4 py-2">{((results.peopleSensible + results.peopleLatent) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-yellow-400">Lighting</td>
                            <td className="px-4 py-2">{Math.round(results.lightingSensible)}</td>
                            <td className="px-4 py-2">0</td>
                            <td className="px-4 py-2">{Math.round(results.lightingSensible)}</td>
                            <td className="px-4 py-2">{((results.lightingSensible) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-indigo-400">Equipment</td>
                            <td className="px-4 py-2">{Math.round(results.equipmentSensible)}</td>
                            <td className="px-4 py-2">0</td>
                            <td className="px-4 py-2">{Math.round(results.equipmentSensible)}</td>
                            <td className="px-4 py-2">{((results.equipmentSensible) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-emerald-400">Envelope</td>
                            <td className="px-4 py-2">{Math.round(results.wallSensible + results.roofSensible + results.windowCondSensible)}</td>
                            <td className="px-4 py-2">0</td>
                            <td className="px-4 py-2">{Math.round(results.wallSensible + results.roofSensible + results.windowCondSensible)}</td>
                            <td className="px-4 py-2">{((results.wallSensible + results.roofSensible + results.windowCondSensible) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-orange-400">Solar</td>
                            <td className="px-4 py-2">{Math.round(results.solarSensible)}</td>
                            <td className="px-4 py-2">0</td>
                            <td className="px-4 py-2">{Math.round(results.solarSensible)}</td>
                            <td className="px-4 py-2">{((results.solarSensible) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-sky-400">Ventilation</td>
                            <td className="px-4 py-2">{Math.round(results.ventSensible)}</td>
                            <td className="px-4 py-2">{Math.round(results.ventLatent)}</td>
                            <td className="px-4 py-2">{Math.round(results.ventSensible + results.ventLatent)}</td>
                            <td className="px-4 py-2">{((results.ventSensible + results.ventLatent) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2 font-semibold text-slate-400">Infiltration</td>
                            <td className="px-4 py-2">{Math.round(results.infiltrationSensible)}</td>
                            <td className="px-4 py-2">{Math.round(results.infiltrationLatent)}</td>
                            <td className="px-4 py-2">{Math.round(results.infiltrationSensible + results.infiltrationLatent)}</td>
                            <td className="px-4 py-2">{((results.infiltrationSensible + results.infiltrationLatent) / results.calculatedTotal * 100).toFixed(1)}%</td>
                          </tr>
                          <tr className="bg-slate-950 font-bold text-emerald-400">
                            <td className="px-4 py-2 uppercase text-[10px]">Total Calculated</td>
                            <td className="px-4 py-2">{Math.round(results.totalSensible)}</td>
                            <td className="px-4 py-2">{Math.round(results.totalLatent)}</td>
                            <td className="px-4 py-2">{Math.round(results.calculatedTotal)}</td>
                            <td className="px-4 py-2">100%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
`;

// Insert the table code right after the ending </div> of the chart rendering block (after ")} </div>")
const regex = /(<\/div>\s*)\{\/\* Interactive Trend Chart Section \*\/\}/;
content = content.replace(regex, "$1" + tableCode + "\n          {/* Interactive Trend Chart Section */}");
fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
