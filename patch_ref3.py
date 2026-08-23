import re

with open('src/components/ReferenceModal.tsx', 'r') as f:
    content = f.read()

search_str = """        {
          name: 'BS EN 806 Peak Water Sizing (UK)',"""

replacement_str = """        {
          name: 'Pipe Water Velocity',
          formula: 'V = 4Q / (π × D²)',
          explanation: 'Calculates the velocity of water through a pipe based on flow rate and internal diameter. Important for limiting water hammer and noise (Typical limit: 1.2 to 2.4 m/s).',
          math: 'V_m/s = (4 × Q_m³/s) / (π × D_m²)',
          parameters: [
            'V = Water velocity in meters per second',
            'Q = Flow rate in cubic meters per second',
            'D = Internal pipe diameter in meters'
          ]
        },
        {
          name: 'BS EN 806 Peak Water Sizing (UK)',"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/ReferenceModal.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")
