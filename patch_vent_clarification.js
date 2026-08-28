import fs from 'fs';
let code = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

const target = `                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 1 — Breathing Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Vbz = (Rp × Pz) + (Ra × Az)</code>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                      </div>
                    </div>`;

const replacement = `                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 1 — Breathing Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Vbz = (Rp × Pz) + (Ra × Az)</code>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                      </div>
                      <div className="pt-2 border-t border-slate-700/50">
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">
                          * ASHRAE 62.1 treats outdoor-air ventilation (bringing fresh air in) and local exhaust (removing polluted air directly) as distinct requirements. This calculation determines the minimum fresh outdoor-air ventilation.
                        </p>
                      </div>
                    </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/VentilationCalc.tsx', code);
