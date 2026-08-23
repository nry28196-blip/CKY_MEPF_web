import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_results = """                  <div className="pt-2">
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

replace_results = """                  <div className="pt-2">
                    {standard === 'bs' ? (
                      <>
                        <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                          Suggested Cold Water Pipe
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-extrabold text-white">
                            {recommendedWaterPipe}
                          </p>
                        </div>
                        <span className="block text-[10px] text-slate-500 font-mono font-normal mt-1">
                          (Minimum internal diameter: {calculatedWaterPipeDia.toFixed(1)} mm @ {designVelocity} m/s)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider flex items-center justify-between">
                          Final Hydraulic Water Pipe (IPC)
                          {hydraulicResult?.failed && (
                            <span className="text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded">Insufficient Pressure</span>
                          )}
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-extrabold ${hydraulicResult?.failed ? 'text-red-400' : 'text-cyan-400'}`}>
                            {hydraulicResult?.size}
                          </p>
                        </div>
                        {hydraulicResult && (
                          <div className="mt-2 bg-slate-900/50 border border-slate-800 p-2.5 rounded-lg text-[10px] font-mono text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Min Vel. Diameter:</span>
                              <span className="text-white">{calculatedWaterPipeDia.toFixed(1)} mm (@ {designVelocity} m/s)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Eq. Length:</span>
                              <span className="text-white">{hydraulicResult.totalLength} m (Fittings: {hydraulicResult.equivFittings} m)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Friction Loss:</span>
                              <span className="text-white">{hydraulicResult.frictionLossBar} bar</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Elevation Loss:</span>
                              <span className="text-white">{hydraulicResult.elevationLossBar} bar</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-700/50 pt-1 mt-1">
                              <span>Residual Pressure:</span>
                              <span className={Number(hydraulicResult.residualBar) >= appliedRequiredResidual ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                {hydraulicResult.residualBar} bar (Req: {appliedRequiredResidual} bar)
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>"""

content = content.replace(search_results, replace_results)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
