const fs = require('fs');

let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Ensure import for ValidationService exists
if (!code.includes('ValidationService')) {
  code = code.replace(
    "import EngineeringWarning from './EngineeringWarning';",
    "import EngineeringWarning from './EngineeringWarning';\nimport { ValidationService, ValidationRule, ValidationIssue } from '../calculations/services/ValidationService';"
  );
}

// Add state for validations if not exists
if (!code.includes('const [validations, setValidations]')) {
  code = code.replace(
    'const [isMetric, setIsMetric] = useState', 
    'const [validations, setValidations] = useState<ValidationIssue[]>([]);\n  const [isMetric, setIsMetric] = useState'
  );
  // Just in case isMetric is pulled from context, try placing it after tempC/altitude
  code = code.replace(
    '  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);',
    '  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);\n  const [validations, setValidations] = useState<ValidationIssue[]>([]);'
  );
}

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Patched ASHRAE");
