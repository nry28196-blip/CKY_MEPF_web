import re

with open('src/components/TrendVisualizer.tsx', 'r') as f:
    content = f.read()

search_ref = """  } else if (type === 'plumbing_fixtures') {
    currentXValue = Number(currentParams.totalLU) || 20;
    currentYValue = Number(currentParams.peakFlowLps) || 0;
    referenceName = currentParams.standard === 'bs' ? 'BS EN 806-3 Standard (L/s)' : 'IPC Hunter - Flush Valve (L/s)';"""

replace_ref = """  } else if (type === 'plumbing_fixtures') {
    currentXValue = Number(currentParams.totalLU) || 20;
    currentYValue = Number(currentParams.peakFlowLps) || 0;
    const isBS = currentParams.standard === 'bs';
    const isValve = currentParams.systemType === 'valve';
    referenceName = isBS ? 'BS EN 806-3 Standard (L/s)' : (isValve ? 'IPC Hunter - Flush Valve (L/s)' : 'IPC Hunter - Flush Tank (L/s)');"""

content = content.replace(search_ref, replace_ref)


search_lines = """                {type === 'plumbing_fixtures' && (
                  <>
                    <Line type="monotone" dataKey="IPC Hunter - Flush Valve (L/s)" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="IPC Hunter - Flush Tank (L/s)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="BS EN 806-3 Standard (L/s)" stroke="#06b6d4" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </>
                )}"""

replace_lines = """                {type === 'plumbing_fixtures' && (
                  <>
                    <Line type="monotone" dataKey="IPC Hunter - Flush Valve (L/s)" stroke="#ef4444" strokeWidth={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'valve' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'valve' ? 1 : 0.5)} />
                    <Line type="monotone" dataKey="IPC Hunter - Flush Tank (L/s)" stroke="#f59e0b" strokeWidth={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? 3.5 : 1} strokeDasharray={currentParams.systemType === 'tank' && currentParams.standard !== 'bs' ? "" : "4 4"} opacity={currentParams.standard === 'bs' ? 0.3 : (currentParams.systemType === 'tank' ? 1 : 0.5)} />
                    <Line type="monotone" dataKey="BS EN 806-3 Standard (L/s)" stroke="#06b6d4" strokeWidth={currentParams.standard === 'bs' ? 3.5 : 1.5} strokeDasharray={currentParams.standard === 'bs' ? "" : "4 4"} activeDot={{ r: 6 }} opacity={currentParams.standard !== 'bs' ? 0.3 : 1} />
                  </>
                )}"""

content = content.replace(search_lines, replace_lines)

with open('src/components/TrendVisualizer.tsx', 'w') as f:
    f.write(content)

