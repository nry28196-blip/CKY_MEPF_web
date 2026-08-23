import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

ui_str = """                <div>
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
                    <option value={1}>1% Slope (1:100)</option>
                    <option value={2}>2% Slope (1:50)</option>
                    <option value={4}>4% Slope (1:25)</option>
                  </select>
                </div>"""

search_ui = "                  {designVelocity !== 0 && (designVelocity < 0.5 || designVelocity > 3.0) && ("
replace_ui = ui_str + """
                </div>
                <div>
                  <TooltipLabel 
                    label="Water Velocity (m/s)" """

# Instead of relying on exact multi-line, let's use sed or python to find a good injection point.
