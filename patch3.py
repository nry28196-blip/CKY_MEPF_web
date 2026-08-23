with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

target_start = "{/* Parameter 3: Velocity Limit */}"
target_end = "{/* Parameter 4: Assigned Height */}"

start_idx = content.find(target_start)
end_idx = content.find(target_end)

if start_idx == -1 or end_idx == -1:
    print("Could not find targets")
    exit(1)

old_block = content[start_idx:end_idx]

new_block = """{/* Parameter 3: Duct Type & Velocity Limit */}
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>System / Duct Type</span>
                  <span className="text-[10px] text-slate-500 font-normal">For reference guidelines</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDuctType('supply')}
                    className={`flex-1 text-[11px] py-1.5 rounded font-mono border transition-all ${
                      ductType === 'supply'
                        ? 'bg-sky-950/50 border-sky-500/50 text-sky-300'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    Supply
                  </button>
                  <button
                    onClick={() => setDuctType('return')}
                    className={`flex-1 text-[11px] py-1.5 rounded font-mono border transition-all ${
                      ductType === 'return'
                        ? 'bg-purple-950/50 border-purple-500/50 text-purple-300'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    Return
                  </button>
                  <button
                    onClick={() => setDuctType('exhaust')}
                    className={`flex-1 text-[11px] py-1.5 rounded font-mono border transition-all ${
                      ductType === 'exhaust'
                        ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    Exhaust
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Max Velocity Limit</span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min="400"
                      max="6000"
                      value={velocityLimit || ''}
                      onChange={(e) => setVelocityLimit(e.target.value === '' ? 0 : velUnitHook.getInternalValue(Number(e.target.value)))}
                      className={`w-20 text-center font-mono text-xs rounded py-0.5 focus:outline-none transition-colors bg-slate-950 border ${velocityLimit !== 0 && (velocityLimit < 400 || velocityLimit > 6000)
                        ? 'border-red-500/70 text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                        : 'text-emerald-400 border-slate-800 focus:border-emerald-500'
                        } invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500`}
                    />
                    <span className="text-[10px] text-slate-500 font-mono">{velUnit}</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2500"
                  step="50"
                  value={velocityLimit || 600}
                  onChange={(e) => setVelocityLimit(velUnitHook.getInternalValue(Number(e.target.value)))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>600 (Quiet)</span>
                  <span>1,200 (Office)</span>
                  <span>2,500 (Ind.)</span>
                </div>
                {velocityLimit !== 0 && (velocityLimit < 400 || velocityLimit > 6000) && (
                  <div className="text-[10px] text-red-400 font-mono leading-none mt-1 bg-red-950/20 px-2 py-1 rounded border border-red-950/50">
                    ⚠️ Recommended safe range: 400 to 6,000 FPM
                  </div>
                )}
              </div>

              {/* Interactive Reference Table */}
              <div className="bg-slate-950/40 rounded-lg border border-slate-800/80 overflow-hidden">
                <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center">
                  <Info className="w-3 h-3 text-slate-400 mr-1.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Velocity Guidelines</span>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-800/50 text-slate-500">
                        <th className="px-3 py-1.5 font-medium">Application</th>
                        <th className="px-3 py-1.5 font-medium text-right">Main Duct</th>
                        <th className="px-3 py-1.5 font-medium text-right">Branch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className={`transition-colors cursor-pointer hover:bg-slate-800/30 ${ductType === 'supply' ? 'bg-sky-950/30 text-sky-200' : 'text-slate-400'}`} onClick={() => setDuctType('supply')}>
                        <td className="px-3 py-2 flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ductType === 'supply' ? 'bg-sky-500' : 'bg-transparent'}`}></div>
                          Supply Air
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(1000).toFixed(0)} - {velUnitHook.getDisplayValue(2000).toFixed(0)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(600).toFixed(0)} - {velUnitHook.getDisplayValue(1200).toFixed(0)}
                        </td>
                      </tr>
                      <tr className={`transition-colors cursor-pointer hover:bg-slate-800/30 ${ductType === 'return' ? 'bg-purple-950/30 text-purple-200' : 'text-slate-400'}`} onClick={() => setDuctType('return')}>
                        <td className="px-3 py-2 flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ductType === 'return' ? 'bg-purple-500' : 'bg-transparent'}`}></div>
                          Return Air
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(800).toFixed(0)} - {velUnitHook.getDisplayValue(1500).toFixed(0)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(400).toFixed(0)} - {velUnitHook.getDisplayValue(1000).toFixed(0)}
                        </td>
                      </tr>
                      <tr className={`transition-colors cursor-pointer hover:bg-slate-800/30 ${ductType === 'exhaust' ? 'bg-amber-950/30 text-amber-200' : 'text-slate-400'}`} onClick={() => setDuctType('exhaust')}>
                        <td className="px-3 py-2 flex items-center">
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ductType === 'exhaust' ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                          General Exhaust
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(1500).toFixed(0)} - {velUnitHook.getDisplayValue(2000).toFixed(0)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {velUnitHook.getDisplayValue(1000).toFixed(0)} - {velUnitHook.getDisplayValue(1500).toFixed(0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="px-3 py-1.5 bg-slate-900/30 text-[9px] text-slate-500 flex justify-between border-t border-slate-800/50">
                    <span>* Values in {velUnit}. Varies by noise constraint.</span>
                  </div>
                </div>
              </div>
            </div>

            """

content = content.replace(old_block, new_block)

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.write(content)
