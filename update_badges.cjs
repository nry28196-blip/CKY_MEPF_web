const fs = require('fs');

let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Single Room Replacement
const singleOriginal = `                    )}
                  </div>
                  <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-xs font-bold uppercase w-fit z-10 relative">`;

const singleNew = `                    )}
                    {results?.status === 'PASS' && results?.auditTrail && results.auditTrail.length > 0 && (
                      <a 
                        href="https://www.ashrae.org/technical-resources/standards-and-guidelines" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="View ASHRAE Standards"
                        className="flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified: {results.auditTrail[0].reference?.split(' → ')?.[0] + ' ' + results.auditTrail[0].reference?.split(' → ')?.[1] || 'ASHRAE Fundamentals 2021'}</span>
                      </a>
                    )}
                  </div>
                  <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-xs font-bold uppercase w-fit z-10 relative">`;

content = content.replace(singleOriginal, singleNew);

// VRF Room Replacement
const vrfOriginal = `<h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-2">VRF System Coincidence Sizing</h3>`;
const vrfNew = `<div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">VRF System Coincidence Sizing</h3>
                    {vrfResults?.auditTrail && vrfResults.auditTrail.length > 0 && (
                      <a 
                        href="https://www.ashrae.org/technical-resources/standards-and-guidelines" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="View AHRI / ASHRAE Standards"
                        className="flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified: {vrfResults.auditTrail.find((a: any) => a.reference?.includes('AHRI'))?.reference?.split(' → ')?.slice(0, 2)?.join(' ') || 'AHRI 1230 2021'}</span>
                      </a>
                    )}
                  </div>`;

content = content.replace(vrfOriginal, vrfNew);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
