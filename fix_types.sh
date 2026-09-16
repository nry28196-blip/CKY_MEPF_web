sed -i '/export interface ZoneVentilationInput {/a \  dMode?: "CV" | "VAV";\n  vpz?: number | null;\n  vpzMinDesign?: number | null;\n  vpzMinRequired?: number | null;\n  vdzMinDesign?: number | null;\n  ep?: number | null;\n  er?: number | null;' src/calculations/ventilation/Ashrae621ZoneService.ts

sed -i '/export interface ZoneVentilationResult {/a \  id?: string;' src/calculations/ventilation/Ashrae621ZoneService.ts

sed -i 's/totalRoomTons: 5,/totalRoomTons: 5,\n      totalConnectedWatts: 17500,\n      totalConnectedTons: 5,\n      auditTrail: [],/' src/lib/VentilationEngine.ts

sed -i 's/windowSensibleWatts: 0/windowSensibleWatts: 0,\n      auditTrail: []/' src/lib/VentilationEngine.ts

