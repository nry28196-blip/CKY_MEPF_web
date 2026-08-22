import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_header = """            <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="space-y-4">"""

new_header = """            <h3 className="text-sm font-semibold text-white mb-4 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="mb-4 pb-4 border-b border-slate-800">
              <label className="block text-xs font-bold text-sky-400 mb-2 uppercase tracking-wider">Load Presets</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedSpaceId('office'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Office
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('conference'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Conference
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('classroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Classroom
                </button>
                <button
                  onClick={() => { setSelectedSpaceId('gym'); setZoneEzId('cooling_floor_disp'); setUseDefaultDensity(true); }}
                  className="px-2.5 py-1.5 bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-900/50 hover:border-sky-700 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                >
                  Gymnasium
                </button>
              </div>
            </div>

            <div className="space-y-4">"""

content = content.replace(old_header, new_header)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
