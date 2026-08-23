import re

with open('src/components/TrendVisualizer.tsx', 'r') as f:
    content = f.read()

search_lines = """                {type === 'plumbing_fixtures' && (
                  <>
                    <Line type="monotone" dataKey="IPC Hunter - Flush Valve (L/s)" stroke="#ef4444" strokeWidth={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'valve' ? 1 : 0.5)} />
                    <Line type="monotone" dataKey="IPC Hunter - Flush Tank (L/s)" stroke="#f59e0b" strokeWidth={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'tank' ? 1 : 0.5)} />
                    <Line type="monotone" dataKey="BS EN 806-3 Standard (L/s)" stroke="#06b6d4" strokeWidth={currentParams.standard === 'bs' ? 3.5 : 1.5} strokeDasharray={currentParams.standard === 'bs' ? "" : "4 4"} activeDot={{ r: 6 }} opacity={currentParams.standard !== 'bs' ? 0.3 : 1} />
                  </>
                )}"""

replace_lines = """                {type === 'plumbing_fixtures' && (
                  <>
                    <Line type="monotone" dataKey="IPC Hunter - Flush Valve (L/s)" stroke="#ef4444" strokeWidth={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'valve' ? 1 : 0.5)} style={{ transition: 'all 0.5s ease-in-out' }} animationDuration={1000} />
                    <Line type="monotone" dataKey="IPC Hunter - Flush Tank (L/s)" stroke="#f59e0b" strokeWidth={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'tank' ? 1 : 0.5)} style={{ transition: 'all 0.5s ease-in-out' }} animationDuration={1000} />
                    <Line type="monotone" dataKey="BS EN 806-3 Standard (L/s)" stroke="#06b6d4" strokeWidth={currentParams.standard === 'bs' ? 3.5 : 1.5} strokeDasharray={currentParams.standard === 'bs' ? "" : "4 4"} activeDot={{ r: 6 }} opacity={currentParams.standard !== 'bs' ? 0.3 : 1} style={{ transition: 'all 0.5s ease-in-out' }} animationDuration={1000} />
                  </>
                )}"""

content = content.replace(search_lines, replace_lines)

with open('src/components/TrendVisualizer.tsx', 'w') as f:
    f.write(content)
