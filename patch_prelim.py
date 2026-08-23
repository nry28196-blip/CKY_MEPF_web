import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_text = """                  <div className="pt-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'Suggested Cold Water Pipe' : 'Preliminary Cold Water Pipe (Velocity-Based)'}
                    </span>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {recommendedWaterPipe}{' '}
                      <span className="text-[10px] text-slate-500 font-mono font-normal">({calculatedWaterPipeDia.toFixed(1)} mm calc)</span>
                    </p>
                    {standard === 'ipc' && <span className="block text-[9px] text-slate-500 leading-normal mt-0.5">* IPC requires full friction loss tables for complete sizing.</span>}
                  </div>"""

replace_text = """                  <div className="pt-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                      {standard === 'bs' ? 'Suggested Cold Water Pipe' : 'Preliminary Cold Water Pipe (Velocity-Based)'}
                    </span>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-white">
                        {recommendedWaterPipe}
                      </p>
                      {standard === 'ipc' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          <AlertTriangle className="w-3 h-3" /> Preliminary Only
                        </span>
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 font-mono font-normal mt-1">
                      (Minimum internal diameter: {calculatedWaterPipeDia.toFixed(1)} mm @ {designVelocity} m/s)
                    </span>
                    {standard === 'ipc' && (
                      <div className="mt-2.5 bg-amber-950/20 border border-amber-900/30 p-2.5 rounded-lg">
                        <span className="block text-[9.5px] text-amber-500/90 leading-relaxed">
                          <strong>Note:</strong> A final IPC-compliant water pipe size cannot be established from velocity alone. You must perform a complete hydraulic calculation (e.g., IPC 2018 Appendix E) evaluating friction loss, fittings, equivalent length, elevation, available pressure, and required residual pressure.
                        </span>
                      </div>
                    )}
                  </div>"""

content = content.replace(search_text, replace_text)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
