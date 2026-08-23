import re

with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Replace the broken ending
broken = '      </div>\n    </div>\n      )}\n    </div>\n  );\n}'
fixed = '      </div>\n      )}\n    </div>\n  );\n}'

if broken in content:
    content = content.replace(broken, fixed)
else:
    print("Could not find broken pattern!")

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
