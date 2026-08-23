import re

with open('src/components/ReferenceModal.tsx', 'r') as f:
    content = f.read()

search_str = """        {
          name: 'Cooling Thermal Load Sizing',"""

replacement_str = """        {
          name: 'Commercial Kitchen Hood Extraction (ASHRAE 154)',
          formula: 'Q = L × Base Rate',
          explanation: 'Calculates required exhaust airflow for unlisted commercial kitchen hoods based on cooking equipment duty and hood canopy configuration.',
          math: 'Q_cfm = Hood Length (ft) × Base Exhaust Rate (CFM/ft)',
          parameters: [
            'Q = Total exhaust airflow required',
            'L = Length of the hood canopy over the equipment bank',
            'Base Rate = Extraction rate per linear foot depending on duty (Light, Medium, Heavy, Extra Heavy) and hood type (Wall, Island)'
          ]
        },
        {
          name: 'Cooling Thermal Load Sizing',"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/ReferenceModal.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")
