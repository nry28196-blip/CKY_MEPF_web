import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add ductType state
state_search = "const [velocityLimit, setVelocityLimit] = useState<number>(1200); // FPM"
state_replace = "const [velocityLimit, setVelocityLimit] = useState<number>(1200); // FPM\n  const [ductType, setDuctType] = useState<'supply' | 'return' | 'exhaust'>('supply');"
content = content.replace(state_search, state_replace)

# 2. Add appliedDuctType state
applied_state_search = "const [appliedVelocityLimit, setAppliedVelocityLimit] = useState<number>(1200);"
applied_state_replace = "const [appliedVelocityLimit, setAppliedVelocityLimit] = useState<number>(1200);\n  const [appliedDuctType, setAppliedDuctType] = useState<'supply' | 'return' | 'exhaust'>('supply');"
content = content.replace(applied_state_search, applied_state_replace)

# 3. Add to handleApplyCalculations
apply_search = "setAppliedVelocityLimit(velocityLimit);"
apply_replace = "setAppliedVelocityLimit(velocityLimit);\n    setAppliedDuctType(ductType);"
content = content.replace(apply_search, apply_replace)

# 4. Add to hasPendingChanges
pending_search = "velocityLimit !== appliedVelocityLimit ||"
pending_replace = "velocityLimit !== appliedVelocityLimit ||\n    ductType !== appliedDuctType ||"
content = content.replace(pending_search, pending_replace)

# 5. Add to restoredParams
restore_search = "if (typeof p.velocityLimit === 'number') { setVelocityLimit(p.velocityLimit); setAppliedVelocityLimit(p.velocityLimit); }"
restore_replace = "if (typeof p.velocityLimit === 'number') { setVelocityLimit(p.velocityLimit); setAppliedVelocityLimit(p.velocityLimit); }\n        if (typeof p.ductType === 'string') { setDuctType(p.ductType as any); setAppliedDuctType(p.ductType as any); }"
content = content.replace(restore_search, restore_replace)

# 6. Add to handleSave
save_search = "velocityLimit,\n          ductHeight,"
save_replace = "velocityLimit,\n          ductType,\n          ductHeight,"
content = content.replace(save_search, save_replace)

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.write(content)
