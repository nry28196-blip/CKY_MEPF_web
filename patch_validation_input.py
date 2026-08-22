import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onChange={(e) => setArea(e.target.value === '' ? 0 : Number(e.target.value))}",
    "onChange={(e) => setArea(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}"
)

content = content.replace(
    "onChange={(e) => {\n                      if (!useDefaultDensity) setCustomOccupants(e.target.value === '' ? 0 : Number(e.target.value));\n                    }}",
    "onChange={(e) => {\n                      if (!useDefaultDensity) setCustomOccupants(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)));\n                    }}"
)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
