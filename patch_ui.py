import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_ui = """                  <select
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                  >
                    <option value={0.5}>0.5% Slope (1:200)</option>
                    <option value={1.0}>1% Slope (1:100)</option>
                    <option value={2.0}>2% Slope (1:50)</option>
                    <option value={4.0}>4% Slope (1:25)</option>
                  </select>
                </div>"""

replace_ui = """                  <select
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                  >
                    <option value={0.5}>0.5% Slope (1:200)</option>
                    <option value={1.0}>1% Slope (1:100)</option>
                    <option value={2.0}>2% Slope (1:50)</option>
                    <option value={4.0}>4% Slope (1:25)</option>
                  </select>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 col-span-full">
                  <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    Hydraulic Pressure Sizing (IPC Appendix E)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Pipe Material</label>
                      <select
                        value={pipeMaterial}
                        onChange={(e) => setPipeMaterial(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                      >
                        <option value="pvc">PVC / CPVC (C=150)</option>
                        <option value="copper">Copper (C=140)</option>
                        <option value="steel">Galvanized Steel (C=120)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Main Pipe Length (m)</label>
                      <input type="number" min="1" value={pipeLength} onChange={(e) => setPipeLength(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Elevation Change (m)</label>
                      <input type="number" min="0" value={elevationChange} onChange={(e) => setElevationChange(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Avail. Pressure (bar)</label>
                      <input type="number" min="0.1" step="0.1" value={availablePressure} onChange={(e) => setAvailablePressure(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Req. Residual (bar)</label>
                      <input type="number" min="0.1" step="0.1" value={requiredResidual} onChange={(e) => setRequiredResidual(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">90° Elbows</label>
                        <input type="number" min="0" value={elbow90Count} onChange={(e) => setElbow90Count(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase">Tees (Branch)</label>
                        <input type="number" min="0" value={teeCount} onChange={(e) => setTeeCount(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                      </div>
                    </div>
                  </div>
                </div>"""

content = content.replace(search_ui, replace_ui)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
