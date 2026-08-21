const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetChart = `{type === 'cooling' && (
                  <>
                    <Line type="monotone" dataKey="High Efficiency (kW)" stroke="#10b981" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Current Design (kW)" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Poor Envelope (kW)" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="3 3" />
                  </>
                )}`;

const replacementChart = `{type === 'cooling' && (
                  <>
                    {coolingBenchmarks.filter(b => b.enabled).map((b, idx) => {
                       const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
                       return (
                         <Line key={b.id} type="monotone" dataKey={\`\${b.value} W/m² Benchmark\`} stroke={colors[idx % colors.length]} strokeWidth={2} strokeDasharray={idx > 1 ? "4 4" : ""} activeDot={{ r: 4 }} dot={false} />
                       );
                    })}
                    <Line type="monotone" dataKey="Actual Calculated Load" stroke="#ef4444" strokeWidth={0} dot={{ r: 6, fill: '#ef4444' }} activeDot={{ r: 8, fill: '#ef4444' }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Final Design Load" stroke="#06b6d4" strokeWidth={0} dot={{ r: 6, fill: '#06b6d4' }} activeDot={{ r: 8, fill: '#06b6d4' }} isAnimationActive={false} />
                  </>
                )}`;
                
content = content.replace(targetChart, replacementChart);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
