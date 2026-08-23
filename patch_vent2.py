import re

with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add restroom to SPACE_TYPES
space_type_str = "  { id: 'gym', name: 'Gymnasium', rpImp: 20, raImp: 0.3, rpMet: 10, raMet: 1.5, defaultDensityImp: 30, defaultDensityMet: 32 },"
new_space_type_str = "  { id: 'gym', name: 'Gymnasium', rpImp: 20, raImp: 0.3, rpMet: 10, raMet: 1.5, defaultDensityImp: 30, defaultDensityMet: 32 },\n  { id: 'restroom', name: 'Restroom / Toilet', rpImp: 0, raImp: 0.5, rpMet: 0, raMet: 2.5, defaultDensityImp: 0, defaultDensityMet: 0 },"

content = content.replace(space_type_str, new_space_type_str)

# 2. Add preset button
preset_str = """                      <button
                        onClick={() => { setSelectedSpaceId('classroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Classroom
                      </button>"""

new_preset_str = """                      <button
                        onClick={() => { setSelectedSpaceId('classroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Classroom
                      </button>
                      <button
                        onClick={() => { setSelectedSpaceId('restroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Restroom
                      </button>"""

content = content.replace(preset_str, new_preset_str)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)

print("Restroom added successfully")
