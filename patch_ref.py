import re

with open('src/components/TrendVisualizer.tsx', 'r') as f:
    content = f.read()

search_refdot = """                {/* Show point of interest overlay */}
                {currentXValue !== null && currentYValue !== null && (
                  <ReferenceDot 
                    x={currentXValue} 
                    y={currentYValue} 
                    r={6} 
                    fill="#ef4444" 
                    stroke="#ffffff" 
                    strokeWidth={2} 
                  />
                )}"""

replace_refdot = """                {/* Show point of interest overlay */}
                {currentXValue !== null && currentYValue !== null && (
                  <ReferenceDot 
                    x={currentXValue} 
                    y={currentYValue} 
                    r={6} 
                    fill="#ef4444" 
                    stroke="#ffffff" 
                    strokeWidth={2} 
                    style={{ transition: 'all 0.5s ease-in-out' }}
                  />
                )}"""

content = content.replace(search_refdot, replace_refdot)

with open('src/components/TrendVisualizer.tsx', 'w') as f:
    f.write(content)
