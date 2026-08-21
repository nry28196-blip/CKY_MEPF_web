import re

with open('src/components/TrendVisualizer.tsx', 'r') as f:
    content = f.read()

# 1. Fix default viewType
content = content.replace("const [viewType, setViewType] = useState<'trend' | 'results'>('trend');", "const [viewType, setViewType] = useState<'trend' | 'results'>(type === 'cooling' ? 'results' : 'trend');")

# 2. Revert the inline style on PieChart
old_pie_start = """              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }} className="pie-chart-3d" style={{ transform: 'perspective(600px) rotateX(50deg)', filter: 'drop-shadow(0px 10px 0px rgba(2, 6, 23, 0.8)) drop-shadow(0px 20px 10px rgba(0,0,0,0.6))', transition: 'all 0.3s' }}>"""
new_pie_start = """              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>"""
content = content.replace(old_pie_start, new_pie_start)

# 3. Add the style to a wrapper around PieChart OR around ResponsiveContainer
# Actually, if we apply it to ResponsiveContainer's parent, it applies to the whole area.
# Let's apply it directly to the ResponsiveContainer's outer div but only for cooling.
# Wait, let's just create an inner div inside ResponsiveContainer? No, ResponsiveContainer expects a chart.
# Let's wrap ResponsiveContainer in a div conditionally.

old_chart = """      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full font-mono text-[10px]">
        <ResponsiveContainer width="100%" height="100%">"""

new_chart = """      {/* Chart Canvas */}
      <div 
        className="h-64 sm:h-72 w-full font-mono text-[10px]" 
        style={viewType === 'results' && type === 'cooling' ? { 
          transform: 'perspective(600px) rotateX(50deg)', 
          filter: 'drop-shadow(0px 10px 0px rgba(2, 6, 23, 0.8)) drop-shadow(0px 20px 10px rgba(0,0,0,0.6))', 
          transition: 'all 0.3s',
          transformStyle: 'preserve-3d'
        } : {}}
      >
        <ResponsiveContainer width="100%" height="100%">"""
content = content.replace(old_chart, new_chart)

with open('src/components/TrendVisualizer.tsx', 'w') as f:
    f.write(content)

print("Success")
