import re

with open('src/components/MechanicalCalc.tsx', 'r') as f:
    content = f.read()

search_str = """            {
              id: 'zone_outdoor_air',
              title: 'Eq 2 — Zone Outdoor Airflow',
              description: 'Calculates the required zone outdoor airflow by applying the zone air distribution effectiveness.',
              equation: 'V_{oz} = \\frac{V_{bz}}{E_z}',
              variables: [
                { symbol: 'V_{oz}', meaning: 'Zone outdoor airflow required' },
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'E_z', meaning: 'Zone air distribution effectiveness' }
              ]
            },"""

replacement_str = """            {
              id: 'zone_outdoor_air',
              title: 'Eq 2 — Zone Outdoor Airflow',
              description: 'Calculates the required zone outdoor airflow by applying the zone air distribution effectiveness.',
              equation: 'V_{oz} = \\frac{V_{bz}}{E_z}',
              variables: [
                { symbol: 'V_{oz}', meaning: 'Zone outdoor airflow required' },
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'E_z', meaning: 'Zone air distribution effectiveness' }
              ]
            },
            {
              id: 'exhaust_airflow',
              title: 'Minimum Exhaust Airflow',
              description: 'Calculates the required exhaust airflow using the area-based exhaust rate (e.g., for restrooms or kitchens).',
              equation: 'Q_{exh} = R_a \\cdot A_z',
              variables: [
                { symbol: 'Q_{exh}', meaning: 'Required exhaust airflow' },
                { symbol: 'R_a', meaning: 'Exhaust airflow rate required per unit area' },
                { symbol: 'A_z', meaning: 'Net occupiable zone floor area' }
              ]
            },"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/MechanicalCalc.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")

