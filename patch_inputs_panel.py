import re

with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Add new icons to import
content = content.replace(
    "ArrowDown, Thermometer } from 'lucide-react';",
    "ArrowDown, Thermometer, Bookmark, Layers, Settings } from 'lucide-react';"
)

start_marker = "{/* INPUTS PANEL */}"
end_marker = "{/* RESULTS PANEL */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    exit(1)

old_panel = content[start_idx:end_idx]

new_panel = """{/* INPUTS PANEL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="space-y-5">
              
              {/* Space Application Group */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500/50" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <Bookmark className="w-3 h-3 mr-1.5 text-sky-400" /> Space Profile
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Quick Presets</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => { setSelectedSpaceId('office'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Office
                      </button>
                      <button
                        onClick={() => { setSelectedSpaceId('conference'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Conference
                      </button>
                      <button
                        onClick={() => { setSelectedSpaceId('classroom'); setZoneEzId('cooling_ceiling'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Classroom
                      </button>
                      <button
                        onClick={() => { setSelectedSpaceId('gym'); setZoneEzId('cooling_floor_disp'); setUseDefaultDensity(true); }}
                        className="px-2 py-1 bg-sky-950/30 hover:bg-sky-900/60 text-sky-300 border border-sky-900/30 hover:border-sky-700 text-[10px] font-medium rounded transition-colors"
                      >
                        Gymnasium
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Space Type (ASHRAE 62.1)</label>
                    <select
                      value={selectedSpaceId}
                      onChange={(e) => setSelectedSpaceId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    >
                      {SPACE_TYPES.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Geometry & Load Group */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <Layers className="w-3 h-3 mr-1.5 text-emerald-400" /> Dimensions & Occupancy
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <TooltipLabel label={`Floor Area (${areaUnit})`} tooltip="Total occupiable floor area of the zone." />
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={area === 0 ? '' : area}
                        onChange={(e) => setArea(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pl-9 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Square className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 select-none font-bold">{areaUnit}</span>
                    </div>
                    {isExtremeArea && (
                      <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Unusually large area. Verify value.
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <TooltipLabel label="Occupants" tooltip="Number of people in the zone." />
                      <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                        <input
                          type="checkbox"
                          checked={useDefaultDensity}
                          onChange={(e) => setUseDefaultDensity(e.target.checked)}
                          className="mr-1.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                        />
                        Use Default Density
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        disabled={useDefaultDensity}
                        value={occupants === 0 && !useDefaultDensity ? '' : occupants}
                        onChange={(e) => {
                          if (!useDefaultDensity) setCustomOccupants(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)));
                        }}
                        className={`w-full border rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none transition-colors ${
                          useDefaultDensity 
                            ? 'bg-slate-900/50 border-slate-800/30 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500'
                        }`}
                      />
                      <Users className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${useDefaultDensity ? 'text-slate-600' : 'text-slate-500'}`} />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-500 select-none uppercase">People</span>
                    </div>
                    {isExtremeDensity && (
                      <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> High occupant density. Verify value.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* System Configuration Group */}
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <Settings className="w-3 h-3 mr-1.5 text-amber-400" /> System Variables
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <TooltipLabel label="Air Distribution Effectiveness (Ez)" tooltip="1.0 for ceiling supply/return. 0.8 for ceiling supply/floor return. 1.2 for floor supply." />
                    <select
                      value={zoneEzId}
                      onChange={(e) => setZoneEzId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      {EZ_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>

                    {zoneEz < 1.0 && (
                      <div className="mt-2.5 flex items-start space-x-2 bg-amber-950/30 border border-amber-900/50 p-2 rounded-lg text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-relaxed">
                          <strong className="font-semibold block mb-0.5">Penalty (Ez &lt; 1.0)</strong> 
                          Increases required outdoor airflow (Voz).
                        </p>
                      </div>
                    )}
                    {zoneEz > 1.0 && (
                      <div className="mt-2.5 flex items-start space-x-2 bg-emerald-950/30 border border-emerald-900/50 p-2 rounded-lg text-emerald-400">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-relaxed">
                          <strong className="font-semibold block mb-0.5">Credit (Ez &gt; 1.0)</strong> 
                          Reduces required outdoor airflow (Voz).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <TooltipLabel label={`Air Temperature (${tempUnit})`} tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume." />
                      <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                        <input
                          type="checkbox"
                          checked={useTempAdj}
                          onChange={(e) => setUseTempAdj(e.target.checked)}
                          className="mr-1.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                        />
                        Adjust Density
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={!useTempAdj}
                        value={airTemp === 0 && !useTempAdj ? '' : airTemp}
                        onChange={(e) => {
                          if (useTempAdj) setAirTemp(e.target.value === '' ? 0 : Number(e.target.value));
                        }}
                        className={`w-full border rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none transition-colors ${
                          !useTempAdj 
                            ? 'bg-slate-900/50 border-slate-800/30 text-slate-500 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-700 text-slate-200 focus:border-amber-500'
                        }`}
                      />
                      <Thermometer className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${!useTempAdj ? 'text-slate-600' : 'text-slate-500'}`} />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-500 select-none">{tempUnit}</span>
                    </div>
                    {isExtremeTemp && (
                      <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Extreme temperature value. Verify units.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        """

content = content.replace(old_panel, new_panel)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
