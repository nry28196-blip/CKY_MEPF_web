import re

with open('src/components/VrfTopologyCanvas.tsx', 'r') as f:
    content = f.read()

# 1. Revert the extra ctx.translate and scale on line 739 (Y-Branch)
old_y_branch = """      const drawYBranchJoint = (x: number, y: number, rotation: number = 0, isHovered: boolean = false) => {
        ctx.save(); ctx.translate(pan.x, pan.y); ctx.scale(zoom, zoom);
        ctx.translate(x, y);"""
new_y_branch = """      const drawYBranchJoint = (x: number, y: number, rotation: number = 0, isHovered: boolean = false) => {
        ctx.save();
        ctx.translate(x, y);"""
content = content.replace(old_y_branch, new_y_branch)

# 2. Revert the extra ctx.translate and scale on line 1112 (Fan)
old_fan = """        ctx.fillRect(modX - 40, modY + 33, 80, 8);

        ctx.save(); ctx.translate(pan.x, pan.y); ctx.scale(zoom, zoom);
        ctx.translate(modX, modY - 3);"""
new_fan = """        ctx.fillRect(modX - 40, modY + 33, 80, 8);

        ctx.save();
        ctx.translate(modX, modY - 3);"""
content = content.replace(old_fan, new_fan)

# 3. Fix the template literal for CDU ${moduleHp}HP
content = content.replace("ctx.fillText('CDU ${moduleHp}HP', modX, modY + 28);", "ctx.fillText(`CDU ${moduleHp}HP`, modX, modY + 28);")

# 4. Fix the template literal for ODU Tons
content = content.replace("ctx.fillText('(${vrfResults.oduTons.toFixed(1)} TR)', oduPos.x, oduPos.y - 8);", "ctx.fillText(`(${vrfResults.oduTons.toFixed(1)} TR)`, oduPos.x, oduPos.y - 8);")

# 5. Fix the template literal for CR
content = content.replace("ctx.fillText('CR: ${vrfResults.combinationRatio.toFixed(0)}% OK', oduPos.x, oduPos.y + 70);", "ctx.fillText(`CR: ${vrfResults.combinationRatio.toFixed(0)}% OK`, oduPos.x, oduPos.y + 70);")
content = content.replace("ctx.fillText('CR: ${vrfResults.combinationRatio.toFixed(0)}% (OVER)', oduPos.x, oduPos.y + 70);", "ctx.fillText(`CR: ${vrfResults.combinationRatio.toFixed(0)}% (OVER)`, oduPos.x, oduPos.y + 70);")

# 6. Fix the template literal for IDU Tons
content = content.replace("ctx.fillText('${room.tons.toFixed(1)} TR', roomPos.x, roomPos.y + 35);", "ctx.fillText(`${room.tons.toFixed(1)} TR`, roomPos.x, roomPos.y + 35);")

# 7. Fix the template literal for Pipe length
content = content.replace("ctx.fillText('${room.pipeLength ?? 15}m', (roomPos.x + oduPos.x)/2, roomPos.y + 12);", "ctx.fillText(`${room.pipeLength ?? 15}m`, (roomPos.x + oduPos.x)/2, roomPos.y + 12);")

with open('src/components/VrfTopologyCanvas.tsx', 'w') as f:
    f.write(content)

print("Done fixing")
