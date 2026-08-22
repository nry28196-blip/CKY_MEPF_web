import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Replace the state initialization
old_state = "const [zoneEz, setZoneEz] = useState<number>(1.0); // Zone air distribution effectiveness"
new_state = """const [zoneEzId, setZoneEzId] = useState<string>('cooling_ceiling'); // Zone air distribution effectiveness ID
  
  // ASHRAE 62.1-2019 Table 6.2.2.2
  const EZ_OPTIONS = [
    { id: 'cooling_ceiling', label: '1.0 - Ceiling supply of cool air', value: 1.0 },
    { id: 'heating_ceiling_floor', label: '1.0 - Ceiling supply of warm air & floor return', value: 1.0 },
    { id: 'heating_ceiling_15f', label: '0.8 - Ceiling supply of warm air (≥15°F/8°C above space temp)', value: 0.8 },
    { id: 'heating_ceiling_less_15f', label: '1.0 - Ceiling supply of warm air (<15°F/8°C above space temp)', value: 1.0 },
    { id: 'cooling_floor_disp', label: '1.2 - Floor supply of cool air (displacement)', value: 1.2 },
    { id: 'cooling_floor_dir', label: '1.0 - Floor supply of cool air (directed)', value: 1.0 },
    { id: 'heating_floor_floor', label: '1.0 - Floor supply of warm air & floor return', value: 1.0 },
    { id: 'heating_floor_ceiling', label: '0.7 - Floor supply of warm air & ceiling return', value: 0.7 },
    { id: 'makeup_opp', label: '0.8 - Makeup air drawn on opposite side of room from exhaust', value: 0.8 },
    { id: 'makeup_near', label: '0.5 - Makeup air drawn near to exhaust/return', value: 0.5 }
  ];

  const zoneEz = EZ_OPTIONS.find(o => o.id === zoneEzId)?.value || 1.0;"""

content = content.replace(old_state, new_state)

# Replace the select box
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
                  value={zoneEzId}
                  onChange={(e) => setZoneEzId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {EZ_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>"""

content = content.replace(old_select, new_select)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
