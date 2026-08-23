import re

with open('src/components/ReferenceModal.tsx', 'r') as f:
    content = f.read()

search_str = """        {
          name: 'Duct Sizing (Velocity Method)',"""

replacement_str = """        {
          name: 'Duct Sizing (Equal Friction Method)',
          formula: 'ΔP/L = Constant (e.g. 0.1 in. wg/100 ft)',
          explanation: 'Sizes ducts by maintaining a constant pressure loss per unit length across the entire system. Huebscher’s formula is then used to find equivalent rectangular dimensions.',
          math: 'De = 1.30 × ((a × b)^0.625) / ((a + b)^0.25)',
          parameters: [
            'ΔP/L = Target friction loss rate',
            'De = Equivalent round diameter for equal friction and capacity',
            'a, b = Rectangular duct width and height'
          ]
        },
        {
          name: 'Duct Sizing (Velocity Method)',"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/ReferenceModal.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")
