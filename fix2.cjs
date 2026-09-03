const fs = require('fs');
let text = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');
const lines = text.split('\n');

lines[1116] = '                            <span className={`block text-xs font-bold font-mono mt-0.5 ${b.status === "optimal" ? "text-emerald-400" : b.status === "warning" ? "text-amber-400" : "text-red-500"}`}>';
lines[1117] = '                              {b.status === "danger" && <AlertTriangle className="w-3 h-3 inline mr-1" />}';
lines[1118] = '                              {velUnitHook.getDisplayValue(b.velocityRect).toFixed(0)} FPM';
lines[1119] = '                            </span>';
lines[1120] = '                          </div>';
lines[1121] = '                        </div>';
lines[1122] = '                      </div>';

fs.writeFileSync('src/components/DuctSizingCalc.tsx', lines.join('\n'));
