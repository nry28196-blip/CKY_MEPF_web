cat << 'INNER_EOF' > tmp.ts
import { UnitConversionService, ft2ToM2 } from './UnitConversionService';
import { DensityCorrectionService } from './DensityCorrectionService';
import { AuditStatus } from '../types';
import { AuditTrailItem } from '../calculations/ventilation/Ashrae621ZoneService';
import { ValidationStatus } from '../calculations/ventilation/VentilationValidationService';
INNER_EOF
sed -e '1,4d' src/lib/MechanicalCoolingEngine.ts >> tmp.ts
mv tmp.ts src/lib/MechanicalCoolingEngine.ts
