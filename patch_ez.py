import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_select = """                <select
                  value={zoneEz}
                  onChange={(e) => setZoneEz(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value={1.0}>1.0 - Ceiling Supply & Return (Cooling)</option>
                  <option value={0.8}>0.8 - Ceiling Supply & Return (Heating)</option>
                  <option value={1.2}>1.2 - Floor Supply / Ceiling Return</option>
                  <option value={0.5}>0.5 - Stratified Underfloor</option>
                </select>"""

new_select = """                <select
                  value={zoneEz}
                  onChange={(e) => setZoneEz(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value={1.0}>1.0 - Ceiling supply of cool air</option>
                  <option value={1.0}>1.0 - Ceiling supply of warm air & floor return</option>
                  <option value={0.8}>0.8 - Ceiling supply of warm air (≥15°F/8°C above space temp) & ceiling return</option>
                  <option value={1.0}>1.0 - Ceiling supply of warm air (<15°F/8°C above space temp) & ceiling return</option>
                  <option value={1.2}>1.2 - Floor supply of cool air & ceiling return (displacement)</option>
                  <option value={1.0}>1.0 - Floor supply of cool air & ceiling return (directed)</option>
                  <option value={1.0}>1.0 - Floor supply of warm air & floor return</option>
                  <option value={0.7}>0.7 - Floor supply of warm air & ceiling return</option>
                  <option value={0.8}>0.8 - Makeup air drawn on opposite side of room from exhaust</option>
                  <option value={0.5}>0.5 - Makeup air drawn near to exhaust/return</option>
                </select>"""

# Notice the old select has duplicate keys if we use same value in React sometimes, but option value={1.0} is fine as long as they select it.
# Wait, React `select` determines the selected option based on value. If multiple options have the same value, it will just show the first one when controlled!
# To fix this, the value should be the actual option text or an ID, and we parse the number from it, or we store an object.
# But keeping it simple: let's store the string ID in state. Wait, the state `zoneEz` is a number.
# If I use `Number(e.target.value)`, then if they select "1.0 - Floor supply of warm air & floor return" (which passes value="1.0"), 
# the state becomes 1.0, and the dropdown will snap back to displaying the first option that has value={1.0} (which is "1.0 - Ceiling supply of cool air").
# Does that matter functionally? No, because the math uses 1.0. 
# But visually it's a bit jarring. So let's change `zoneEz` to be a string ID, and derive `ezValue`.

pass
