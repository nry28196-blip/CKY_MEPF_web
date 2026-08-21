import re

with open('src/components/VrfTopologyCanvas.tsx', 'r') as f:
    content = f.read()

content = content.replace("ctx.lineWidth = 1;", "ctx.lineWidth = 1 / zoom;")
content = content.replace("ctx.lineWidth = isHovered ? 2 : 1.5;", "ctx.lineWidth = (isHovered ? 2 : 1.5) / zoom;")
content = content.replace("ctx.lineWidth = isHovered ? 4 : 3;", "ctx.lineWidth = (isHovered ? 4 : 3) / zoom;")
content = content.replace("ctx.lineWidth = 1.5;", "ctx.lineWidth = 1.5 / zoom;")
content = content.replace("ctx.lineWidth = isSelected ? 3 : 1.5;", "ctx.lineWidth = (isSelected ? 3 : 1.5) / zoom;")
content = content.replace("ctx.lineWidth = selectedNodeId === 'odu' ? 4 : 2;", "ctx.lineWidth = (selectedNodeId === 'odu' ? 4 : 2) / zoom;")

with open('src/components/VrfTopologyCanvas.tsx', 'w') as f:
    f.write(content)

print("Done")
