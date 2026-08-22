import re

with open('src/components/MechanicalCalc.tsx', 'r') as f:
    mech = f.read()

vent_formulas = """            {
              id: 'ventilation',
              title: 'Breathing Zone Outdoor Air (ASHRAE 62.1)',
              description: 'Calculates the outdoor air required in the breathing zone based on people and area components.',
              equation: 'V_{bz} = R_p \\cdot P_z + R_a \\cdot A_z',
              variables: [
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'R_p', meaning: 'Outdoor airflow rate required per person' },
                { symbol: 'P_z', meaning: 'Zone population (number of people)' },
                { symbol: 'R_a', meaning: 'Outdoor airflow rate required per unit area' },
                { symbol: 'A_z', meaning: 'Zone floor area' }
              ]
            },
            {
              id: 'zone_outdoor_air',
              title: 'Zone Outdoor Air (ASHRAE 62.1)',
              description: 'Calculates the required zone outdoor airflow by accounting for air distribution effectiveness.',
              equation: 'V_{oz} = \\frac{V_{bz}}{E_z}',
              variables: [
                { symbol: 'V_{oz}', meaning: 'Zone outdoor airflow' },
                { symbol: 'V_{bz}', meaning: 'Breathing zone outdoor airflow' },
                { symbol: 'E_z', meaning: 'Zone air distribution effectiveness' }
              ]
            },
"""

mech = mech.replace("          formulas={[\n", "          formulas={[\n" + vent_formulas)

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.write(mech)


with open('src/components/ReferenceModal.tsx', 'r') as f:
    ref = f.read()

ref_vent = """        {
          name: 'Ventilation Rate (ASHRAE 62.1)',
          formula: 'V_bz = (R_p × P_z) + (R_a × A_z)',
          explanation: 'Calculates the breathing zone outdoor airflow based on occupant and floor area components.',
          math: 'V_oz = V_bz / E_z',
          parameters: [
            'V_bz = Breathing zone outdoor airflow (CFM or L/s)',
            'R_p = Outdoor airflow rate required per person',
            'P_z = Zone population (number of people)',
            'R_a = Outdoor airflow rate required per unit area',
            'A_z = Zone floor area',
            'V_oz = Required zone outdoor airflow',
            'E_z = Zone air distribution effectiveness (e.g., 1.0 for cooling ceiling supply)'
          ]
        },
"""

ref = ref.replace("      standard: 'ASHRAE Standard 55 & 62.1, SMACNA Guidelines',\n      formulas: [\n", "      standard: 'ASHRAE Standard 55 & 62.1, SMACNA Guidelines',\n      formulas: [\n" + ref_vent)

with open('src/components/ReferenceModal.tsx', 'w') as f:
    f.write(ref)
