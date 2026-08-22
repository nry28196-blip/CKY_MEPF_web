with open('src/components/BulkCalc.tsx', 'r') as f:
    lines = f.readlines()

effect_start = 27
effect_end = 63
state_start = 64
state_end = 76

# The lines are 0-indexed in Python
effect_lines = lines[effect_start:effect_end+1]
state_lines = lines[state_start:state_end+1]

new_lines = lines[:effect_start] + state_lines + effect_lines + lines[state_end+1:]

with open('src/components/BulkCalc.tsx', 'w') as f:
    f.writelines(new_lines)
