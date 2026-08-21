import re
import sys

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We will just inject useUnit and some label variables at the top of the component
    if "useUnit" not in content:
        content = content.replace("import { useLanguage } from '../lib/translations';", "import { useLanguage } from '../lib/translations';\nimport { useUnit } from '../lib/UnitContext';\nimport { useUnitValue } from '../lib/useUnitValue';")
        
        # Insert hooks
        hook_injection = """
  const { unitSystem } = useUnit();
  const isMetric = unitSystem === 'metric';
  const flowUnit = isMetric ? 'L/s' : 'CFM';
  const velUnit = isMetric ? 'm/s' : 'FPM';
  const lenUnit = isMetric ? 'mm' : 'in';
  const fricUnit = isMetric ? 'Pa/m' : 'in. wg/100 ft';
  
  const airflowUnitHook = useUnitValue(0, 'flow_air');
  const fricUnitHook = useUnitValue(0, 'friction');
  const velUnitHook = useUnitValue(0, 'velocity_air');
  const lenUnitHook = useUnitValue(0, 'length');
"""
        # Find where to inject
        if "export default function DuctSizingCalc" in content:
            content = re.sub(r'(export default function DuctSizingCalc.*?{)', r'\1' + hook_injection, content, count=1)
            
    with open(filepath, 'w') as f:
        f.write(content)

process_file('src/components/DuctSizingCalc.tsx')
