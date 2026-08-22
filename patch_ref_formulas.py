import re
with open('src/components/ReferenceModal.tsx', 'r') as f:
    ref = f.read()

ref_vent = """        {
          name: 'Ventilation Rate (ASHRAE 62.1)',
          formula: 'Eq 1 — Breathing Zone Outdoor Airflow: Vbz = (Rp × Pz) + (Ra × Az)',
          explanation: 'Calculates the required outdoor airflow using the breathing-zone ventilation rate and zone air distribution effectiveness.',
          math: 'Eq 2 — Zone Outdoor Airflow: Voz = Vbz / Ez',
          parameters: [
            'Vbz = Breathing zone outdoor airflow',
            'Voz = Zone outdoor airflow required',
            'Rp = Outdoor airflow rate required per person',
            'Pz = Zone population (number of people)',
            'Ra = Outdoor airflow rate required per unit area',
            'Az = Net occupiable zone floor area',
            'Ez = Zone air distribution effectiveness'
          ]
        },
"""

pattern = r"\{\s*name:\s*'Ventilation Rate \(ASHRAE 62\.1\)'.*?\]\s*\},\n"
ref = re.sub(pattern, lambda m: ref_vent, ref, flags=re.DOTALL)

with open('src/components/ReferenceModal.tsx', 'w') as f:
    f.write(ref)
