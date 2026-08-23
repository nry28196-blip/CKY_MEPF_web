import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Update handleQtyChange to clamp values between 0 and 9999
search_handle = """  const handleQtyChange = (id: string, value: number) => {
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, qty: Math.max(0, value) } : f));
  };"""

replace_handle = """  const handleQtyChange = (id: string, value: number) => {
    const clampedValue = Math.min(9999, Math.max(0, value));
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, qty: clampedValue } : f));
  };"""

content = content.replace(search_handle, replace_handle)

# 2. Add max="9999" and min="0" to the input field
search_input = """                      <input
                        type="number"
                        value={fix.qty}
                        onChange={(e) => handleQtyChange(fix.id, Number(e.target.value))}
                        className="w-12 bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center rounded py-1 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />"""

replace_input = """                      <input
                        type="number"
                        min="0"
                        max="9999"
                        value={fix.qty}
                        onChange={(e) => handleQtyChange(fix.id, Number(e.target.value))}
                        className="w-12 bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center rounded py-1 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />"""

content = content.replace(search_input, replace_input)

# 3. Add the warning banner before the Fixtures Table Grid
search_grid = """              {/* Fixtures Table Grid */}"""

replace_grid = """              {(() => {
                const currentTotalWSFU = fixtures.reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
                const currentTotalLU = fixtures.reduce((sum, f) => sum + (f.lu * f.qty), 0);
                const currentTotalDFU = fixtures.reduce((sum, f) => sum + (f.dfu * f.qty), 0);
                const currentTotalDU = fixtures.reduce((sum, f) => sum + (f.du * f.qty), 0);
                
                const isOverCapacity = standard === 'bs' 
                  ? (currentTotalLU > 10000 || currentTotalDU > 12000) 
                  : (currentTotalWSFU > 5000 || currentTotalDFU > 12000);
                  
                if (!isOverCapacity) return null;
                
                return (
                  <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-3 mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-amber-400 font-bold text-xs mb-1">Standard Capacity Exceeded</h4>
                      <p className="text-amber-200/70 text-[10px] leading-relaxed">
                        The total fixture load exceeds standard empirical sizing tables. Values displayed are extrapolated and may not be accurate for exceptionally high-demand systems. Consider dividing the system into distinct zones.
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Fixtures Table Grid */}"""

content = content.replace(search_grid, replace_grid)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

