const fs = require('fs');
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

const badChunk = `                    {standard === 'ipc' && hunterDebug && (
                      <div className="mt-2 bg-slate-900/80 border border-slate-700/50 p-2 rounded-lg">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 text-cyan-500/80">IPC Table E103.3(3) Lookup Debug</span>
                        <span className="block text-[10px] text-slate-300 font-mono leading-relaxed">
                          {hunterDebug.log}
                        </span>
                        <span className="block text-[9px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/50">
                          *Raw flow = {peakFlowGPM.toFixed(2)} GPM (No implicit multipliers applied)
                        </span>
                      </div>

                  </div>`;

const goodChunk = `                    {standard === 'ipc' && hunterDebug && (
                      <div className="mt-2 bg-slate-900/80 border border-slate-700/50 p-2 rounded-lg">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 text-cyan-500/80">IPC Table E103.3(3) Lookup Debug</span>
                        <span className="block text-[10px] text-slate-300 font-mono leading-relaxed">
                          {hunterDebug.log}
                        </span>
                        <span className="block text-[9px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/50">
                          *Raw flow = {peakFlowGPM.toFixed(2)} GPM (No implicit multipliers applied)
                        </span>
                      </div>
                    )}
                  </div>`;

code = code.replace(badChunk, goodChunk);
fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
