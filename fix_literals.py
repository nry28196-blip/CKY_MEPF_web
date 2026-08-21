import re

with open('src/components/VrfTopologyCanvas.tsx', 'r') as f:
    content = f.read()

# 1. edge.downstreamTons
content = content.replace("ctx.fillText('${edge.downstreamTons.toFixed(1)} TR', midX, midY - 10);", "ctx.fillText(`${edge.downstreamTons.toFixed(1)} TR`, midX, midY - 10);")

# 2. sizes.liquid / sizes.gas
content = content.replace("ctx.fillText('${sizes.liquid} / ${sizes.gas}', midX, midY + 14);", "ctx.fillText(`${sizes.liquid} / ${sizes.gas}`, midX, midY + 14);")

# 3. room.tons
content = content.replace("ctx.fillText('${room.tons.toFixed(1)} TR', roomPos.x, roomPos.y + 8);", "ctx.fillText(`${room.tons.toFixed(1)} TR`, roomPos.x, roomPos.y + 8);")

# 4. room.pipeLength
content = content.replace("ctx.fillText('${room.pipeLength ?? 15}m', (180 + roomPos.x)/2, currentY - 8);", "ctx.fillText(`${room.pipeLength ?? 15}m`, (180 + roomPos.x)/2, currentY - 8);")

# 5. Combination ratio CR
content = content.replace("ctx.fillText('CR: ${vrfResults.combinationRatio.toFixed(0)}% OK', oduPos.x, oduPos.y + 42);", "ctx.fillText(`CR: ${vrfResults.combinationRatio.toFixed(0)}% OK`, oduPos.x, oduPos.y + 42);")

with open('src/components/VrfTopologyCanvas.tsx', 'w') as f:
    f.write(content)
print("Done fixing literals")
