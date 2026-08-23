import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search_str = """                  {designVelocity !== 0 && (designVelocity < 0.5 || designVelocity > 3.0) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 0.5 to 3.0 m/s</p>
                  )}
                </div>"""

replacement_str = """                  {designVelocity !== 0 && (designVelocity < 0.5 || designVelocity > 3.0) && (
                    <p className="text-[9px] text-red-400 font-mono mt-1">⚠️ Safe range: 0.5 to 3.0 m/s</p>
                  )}
                </div>
                <div>
                  <TooltipLabel 
                    label="Sewage Slope (%)"
                    tooltip="Minimum slope per IPC to maintain self-cleansing velocity. Typical design range: 1% (1/8 in/ft) for pipes ≥ 3 inches, or 2% (1/4 in/ft) for pipes < 3 inches."
                    className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                  />
                  <select
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

if search_str in content:
    content = content.replace(search_str, replacement_str)
    print("Patched slope UI successfully")
else:
    print("Failed to find slope UI injection point")

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
