import re

with open('src/components/ReferenceModal.tsx', 'r') as f:
    content = f.read()

search_str = """        {
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
        },"""

replacement_str = """        {
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
        {
          name: 'Minimum Exhaust Airflow (ASHRAE 62.1)',
          formula: 'Q_exh = Ra × Az',
          explanation: 'Calculates the required exhaust airflow using the area-based exhaust rate (e.g., for restrooms or kitchens).',
          math: 'Density Adjusted: Q_exh(actual) = Q_exh × (T_actual / T_std)',
          parameters: [
            'Q_exh = Required exhaust airflow',
            'Ra = Exhaust airflow rate required per unit area',
            'Az = Net occupiable zone floor area',
          ]
        },"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/ReferenceModal.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")
