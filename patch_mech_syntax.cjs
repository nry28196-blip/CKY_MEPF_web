const fs = require('fs');
const file = 'src/components/MechanicalCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/relativeHumidity\)\.\(densityRatio \|\| 0\)\.toFixed/g, 'relativeHumidity).densityRatio || 0).toFixed');
code = code.replace(/AirDensityService\.getAirProperties\([^)]+,[^)]+,[^)]+\)\.densityRatio \|\| 0\)\.toFixed/g, '(AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio || 0).toFixed');

// Wait, the line is:
// <div className="text-right">{useAltitudeAdj ? AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).(densityRatio || 0).toFixed(3) : '1.000'}</div>
// Let's replace the exact string
code = code.replace(/\.\(densityRatio \|\| 0\)\.toFixed/g, '.densityRatio || 0).toFixed');
code = code.replace(/useAltitudeAdj \? AirDensityService\.getAirProperties/g, 'useAltitudeAdj ? (AirDensityService.getAirProperties');

// Wait, I messed it up, let's just make it simple:
// useAltitudeAdj ? (AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio || 0).toFixed(3) : '1.000'

code = code.replace(/useAltitudeAdj \? \(AirDensityService/g, 'useAltitudeAdj ? AirDensityService'); // undo
code = code.replace(/useAltitudeAdj \? AirDensityService/g, 'useAltitudeAdj ? (AirDensityService');

fs.writeFileSync(file, code);
