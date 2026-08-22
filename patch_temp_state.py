import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Imports: import { Thermometer } from 'lucide-react';
content = content.replace(
    "Activity, AlertTriangle, ArrowDown } from 'lucide-react';",
    "Activity, AlertTriangle, ArrowDown, Thermometer } from 'lucide-react';"
)

# 2. Add State
state_hook = """  const [zoneEzId, setZoneEzId] = useState<string>('cooling_ceiling'); // Zone air distribution effectiveness ID
  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);
  const [useTempAdj, setUseTempAdj] = useState<boolean>(false);
  
  useEffect(() => {
    setAirTemp(isMetric ? 20 : 70);
  }, [isMetric]);"""

content = re.sub(r'  const \[zoneEzId, setZoneEzId\] = useState<string>\(\'cooling_ceiling\'\); // Zone air distribution effectiveness ID', state_hook, content)

# 3. Calculation
old_calc = """  // Calculation
  const rp = isMetric ? spaceType.rpMet : spaceType.rpImp;
  const ra = isMetric ? spaceType.raMet : spaceType.raImp;

  const vbp = occupants * rp; // Breathing zone outdoor airflow (people component)
  const vba = area * ra; // Breathing zone outdoor airflow (area component)
  const vbz = vbp + vba; // Breathing zone total
  const voz = vbz / zoneEz; // Zone outdoor airflow"""

new_calc = """  // Calculation
  const rp = isMetric ? spaceType.rpMet : spaceType.rpImp;
  const ra = isMetric ? spaceType.raMet : spaceType.raImp;

  const vbp = occupants * rp; // Breathing zone outdoor airflow (people component)
  const vba = area * ra; // Breathing zone outdoor airflow (area component)
  const vbz = vbp + vba; // Breathing zone total
  const vozBase = vbz / zoneEz; // Zone outdoor airflow

  // Air Density Adjustment
  const tempUnit = isMetric ? '°C' : '°F';
  const stdTempAbs = isMetric ? 20 + 273.15 : 70 + 459.67;
  const actualTempAbs = isMetric ? airTemp + 273.15 : airTemp + 459.67;
  const densityRatio = useTempAdj ? actualTempAbs / stdTempAbs : 1.0;
  
  const voz = vozBase * densityRatio; // Adjusted zone outdoor airflow"""

content = content.replace(old_calc, new_calc)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
