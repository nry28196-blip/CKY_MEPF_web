import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_text = """                            <div className="flex justify-between border-t border-slate-700/50 pt-1 mt-1">
                              <span>Residual Pressure:</span>
                              <span className={Number(hydraulicResult.residualBar) >= appliedRequiredResidual ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                {hydraulicResult.residualBar} bar (Req: {appliedRequiredResidual} bar)
                              </span>
                            </div>
                          </div>"""

replace_text = """                            <div className="flex justify-between border-t border-slate-700/50 pt-1 mt-1">
                              <span>Residual Pressure:</span>
                              <span className={Number(hydraulicResult.residualBar) >= appliedRequiredResidual ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                {hydraulicResult.residualBar} bar (Req: {appliedRequiredResidual} bar)
                              </span>
                            </div>
                            
                            {/* Pressure Drop Visualizer */}
                            {(() => {
                              const avail = appliedAvailablePressure;
                              const req = appliedRequiredResidual;
                              const elev = Number(hydraulicResult.elevationLossBar);
                              const fric = Number(hydraulicResult.frictionLossBar);
                              
                              const maxAllowable = Math.max(0, avail - req);
                              const thresholdPct = Math.min((maxAllowable / avail) * 100, 100);
                              
                              const elevPct = Math.min((elev / avail) * 100, 100);
                              const fricPct = Math.max(0, Math.min((fric / avail) * 100, 100 - elevPct));
                              
                              return (
                                <div className="pt-3 mt-2 border-t border-slate-800/60 relative">
                                  <div className="flex justify-between text-[9px] uppercase tracking-wider mb-2">
                                    <span className="font-bold text-slate-500">Pressure Budget</span>
                                    <span className={hydraulicResult.failed ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                                      {hydraulicResult.failed ? "FAIL" : "PASS"}
                                    </span>
                                  </div>
                                  <div className="relative mb-4">
                                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex relative border border-slate-800">
                                      {/* Max Allowable Threshold Line */}
                                      {thresholdPct > 0 && (
                                        <div 
                                          className="absolute top-0 bottom-0 border-l-2 border-dashed border-emerald-500 z-10"
                                          style={{ left: `${thresholdPct}%` }}
                                        />
                                      )}
                                      
                                      {/* Elevation Loss */}
                                      <div 
                                        className="h-full bg-blue-500/80 border-r border-slate-900 transition-all duration-500"
                                        style={{ width: `${elevPct}%` }}
                                        title={`Elevation Loss: ${elev} bar`}
                                      />
                                      {/* Friction Loss */}
                                      <div 
                                        className={`h-full transition-all duration-500 ${hydraulicResult.failed ? 'bg-red-500/80' : 'bg-orange-500/80'}`}
                                        style={{ width: `${fricPct}%` }}
                                        title={`Friction Loss: ${fric} bar`}
                                      />
                                    </div>
                                    {/* Label for Threshold */}
                                    {thresholdPct > 0 && (
                                      <div 
                                        className="absolute top-full mt-1 text-[8.5px] text-emerald-500/90 whitespace-nowrap -translate-x-1/2 font-bold"
                                        style={{ left: `${thresholdPct}%` }}
                                      >
                                        Min Req.
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex justify-between text-[8px] text-slate-500">
                                    <span>0</span>
                                    <div className="flex gap-2">
                                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></span>Elev</span>
                                      <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${hydraulicResult.failed ? 'bg-red-500/80' : 'bg-orange-500/80'}`}></span>Friction</span>
                                    </div>
                                    <span>Avail: {avail.toFixed(1)} bar</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>"""

content = content.replace(search_text, replace_text)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
