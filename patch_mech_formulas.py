import re
with open('src/components/MechanicalCalc.tsx', 'r') as f:
    mech = f.read()

vent_formulas = """            {
              id: 'ventilation',
              title: 'Eq 1 — Breathing Zone Outdoor Airflow',
              description: 'Calculates the breathing zone outdoor airflow based on occupant and floor area components.',
              equation: 'V_{bz} = (R_p \\cdot P_z) + (R_a \\cdot A_z)',
              variables: [
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'R_p', meaning: 'Outdoor airflow rate required per person' },
                { symbol: 'P_z', meaning: 'Zone population (number of people)' },
                { symbol: 'R_a', meaning: 'Outdoor airflow rate required per unit area' },
                { symbol: 'A_z', meaning: 'Net occupiable zone floor area' }
              ]
            },
            {
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
"""

pattern = r"\{\s*id:\s*'ventilation'.*?id:\s*'zone_outdoor_air'.*?\]\s*\},\n"
mech = re.sub(pattern, lambda m: vent_formulas, mech, flags=re.DOTALL)

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.write(mech)
