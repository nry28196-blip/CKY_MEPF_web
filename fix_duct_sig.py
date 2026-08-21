with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith("export default function DuctSizingCalc({"):
        new_lines.append("export default function DuctSizingCalc({ restoredParams, onSaveCalculation, autoCalculate = true }: DuctSizingCalcProps) {\n")
        new_lines.append("  const { unitSystem } = useUnit();\n")
        new_lines.append("  const isMetric = unitSystem === 'metric';\n")
        new_lines.append("  const flowUnit = isMetric ? 'L/s' : 'CFM';\n")
        new_lines.append("  const velUnit = isMetric ? 'm/s' : 'FPM';\n")
        new_lines.append("  const lenUnit = isMetric ? 'mm' : 'in';\n")
        new_lines.append("  const fricUnit = isMetric ? 'Pa/m' : 'in. wg/100 ft';\n")
        new_lines.append("  const airflowUnitHook = useUnitValue(0, 'flow_air');\n")
        new_lines.append("  const fricUnitHook = useUnitValue(0, 'friction');\n")
        new_lines.append("  const velUnitHook = useUnitValue(0, 'velocity_air');\n")
        new_lines.append("  const lenUnitHook = useUnitValue(0, 'length');\n")
        skip = True
    elif skip:
        if "restoredParams" in line and "}: DuctSizingCalcProps) {" in line:
            skip = False
        # continue skipping until we get out of the mangled part
    else:
        new_lines.append(line)

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.writelines(new_lines)
