import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_bottom = """            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">"""

new_bottom = """            <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">"""

content = content.replace(old_bottom, new_bottom)

old_list_end = """                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}"""

new_list_end = """                  )}
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-4 h-full flex flex-col">
                <h4 className="font-semibold text-emerald-300 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ez Setup Guide (Table 6.2.2.2)
                </h4>
                <p className="text-xs text-slate-300 mb-4">Brief checklist for selecting correct Zone Air Distribution Effectiveness values based on common scenarios.</p>
                
                <ul className="text-xs text-slate-300 space-y-3 flex-1">
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Cooling (Ceiling)</strong> <span className="text-emerald-400 font-mono text-[10px] ml-1">Ez = 1.0</span><br/>
                      <span className="text-slate-400">Standard overhead supply of cool air (typical AC).</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Heating (Ceiling to Ceiling)</strong> <span className="text-amber-400 font-mono text-[10px] ml-1">Ez = 0.8</span><br/>
                      <span className="text-slate-400">Supplying warm air (≥15°F/8°C above room temp) from ceiling with ceiling return (stratification penalty).</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Heating (Ceiling to Floor)</strong> <span className="text-emerald-400 font-mono text-[10px] ml-1">Ez = 1.0</span><br/>
                      <span className="text-slate-400">Supplying warm air from the ceiling but forcing return air low near the floor.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-900/50 p-1 rounded mt-0.5 mr-2 shrink-0">
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-slate-200">Displacement (Floor to Ceiling)</strong> <span className="text-sky-400 font-mono text-[10px] ml-1">Ez = 1.2</span><br/>
                      <span className="text-slate-400">Floor supply of cool air at low velocity, allowing thermal plumes to lift pollutants to ceiling returns.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}"""

content = content.replace(old_list_end, new_list_end)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
