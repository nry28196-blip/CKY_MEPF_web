const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');

// Update imports
code = code.replace(/import \{ AirDistributionConfiguration \} from '\.\.\/data\/ashrae621\/AirDistributionData';/,
"import { AirDistributionConfiguration, ASHRAE_62_1_2019_EZ, ASHRAE_62_1_2022_EZ, ASHRAE_62_1_2025_EZ } from '../data/ashrae621/AirDistributionData';\nimport { SystemOutdoorAirRequirements, ZoneVentilationData } from '../../models/VentilationModels';");

// Add getEzByEdition
code = code.replace(/static getSpacesByEdition[^}]+}/, `static getSpacesByEdition(edition: '2019' | '2022' | '2025'): VentilationSpaceType[] {
    if (edition === '2019') return ASHRAE_62_1_2019_SPACES;
    if (edition === '2025') return ASHRAE_62_1_2025_SPACES;
    return ASHRAE_62_1_2022_SPACES;
  }

  static getEzByEdition(edition: '2019' | '2022' | '2025'): AirDistributionConfiguration[] {
    if (edition === '2019') return ASHRAE_62_1_2019_EZ;
    if (edition === '2025') return ASHRAE_62_1_2025_EZ;
    return ASHRAE_62_1_2022_EZ;
  }`);

// Add calculateSystemVentilation
code += `

  /**
   * Calculates ASHRAE 62.1 multi-zone system outdoor air requirements.
   * Section 6.2.5 Multiple Zone Recirculating Systems.
   */
  static calculateSystemVentilation(systemId: string, zones: ZoneVentilationData[]): SystemOutdoorAirRequirements {
    let vou = 0;
    let vps = 0;
    let maxZp = 0;

    for (const zone of zones) {
      vou += zone.voz;
      if (zone.vpz && zone.vpz > 0) {
        vps += zone.vpz;
        const zp = zone.voz / zone.vpz;
        if (zp > maxZp) {
          maxZp = zp;
        }
      }
    }

    const xs = vps > 0 ? vou / vps : 0;
    const zd = maxZp;

    // Calculate Ev per Table 6.2.5.3 (Simplified step function for typical values)
    let ev = 1.0;
    if (zd <= 0.15) ev = 1.0;
    else if (zd <= 0.25) ev = 0.9;
    else if (zd <= 0.35) ev = 0.8;
    else if (zd <= 0.45) ev = 0.7;
    else if (zd <= 0.55) ev = 0.6;
    else ev = 0.5; // Approximation for > 0.55 (Requires Appendix A ideally, using 0.5 as conservative floor)

    const vot = ev > 0 ? vou / ev : 0;

    return {
      systemId,
      systemType: 'multi',
      vps,
      vou,
      xs,
      zd,
      ev,
      vot
    };
  }
`;

fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', code);
