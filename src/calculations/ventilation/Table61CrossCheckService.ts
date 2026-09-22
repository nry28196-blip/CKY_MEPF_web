import { Ashrae621SpaceType, DatasetCompletenessStatus, ACTIVE_REFERENCE_BASIS } from '../../data/ventilation/ashrae621/types';

export interface CrossCheckItemResult {
  parameter: 'Rp' | 'Ra' | 'OccupantDensity';
  publishedIp: number;
  publishedSi: number;
  calculatedSi: number;
  variancePercent: number;
  isDiscrepancy: boolean;
  note: string;
}

export interface SpaceTypeCrossCheckResult {
  id: string;
  name: string;
  group: string;
  checks: CrossCheckItemResult[];
  hasDiscrepancies: boolean;
}

export interface Table61AuditReport {
  referenceBasis: string;
  totalRecords: number;
  requiredRecordsCount: number;
  completenessStatus: DatasetCompletenessStatus;
  occupancyGroupsCount: number;
  occupancyGroups: string[];
  discrepanciesCount: number;
  results: SpaceTypeCrossCheckResult[];
}

export class Table61CrossCheckService {
  // Conversion factors
  static readonly CFM_TO_LPS = 0.471947443;
  static readonly SQFT_TO_SQM = 0.09290304;
  static readonly CFM_PER_SQFT_TO_LPS_PER_SQM = 0.471947443 / 0.09290304; // ~5.08001
  static readonly DENSITY_IP_TO_SI_FACTOR = 100 / (1000 * 0.09290304); // ~1.076391

  static readonly EXPECTED_TOTAL_CATEGORIES = 78;

  static readonly EXPECTED_GROUPS = [
    'Correctional Facilities',
    'Dry Cleaning and Laundry',
    'Educational Facilities',
    'Food and Beverage Service',
    'General',
    'Hotels, Motels, Resorts, and Dormitories',
    'Office Buildings',
    'Miscellaneous Spaces',
    'Public Assembly Spaces',
    'Retail',
    'Sports and Entertainment'
  ];

  /**
   * Cross-checks a single Table 6-1 space type for numerical consistency between SI and IP.
   * Note: ASHRAE Standard 62.1 uses standard nominal rounding for SI values in Table 6-1
   * rather than exact analytical conversion (e.g. 5 cfm/person is rounded to 2.5 L/s·person,
   * and default occupant densities use the same nominal count per 100 m² as per 1000 ft²).
   */
  static crossCheckRecord(space: Ashrae621SpaceType): SpaceTypeCrossCheckResult {
    const checks: CrossCheckItemResult[] = [];

    // 1. Rp Check: L/s·person vs cfm/person
    if (space.rpIp !== undefined && !space.isRpNotApplicable) {
      const calculatedSiRp = Number((space.rpIp * this.CFM_TO_LPS).toFixed(3));
      const variance = space.rpMetric !== 0 
        ? Math.abs((space.rpMetric - calculatedSiRp) / space.rpMetric) * 100 
        : 0;
      
      // Standard ASHRAE nominal values: 5 cfm -> 2.5 L/s (calc 2.36), 7.5 cfm -> 3.8 L/s (calc 3.54), 10 -> 5.0 (calc 4.72), etc.
      const isExpectedNominal = variance < 15; // ASHRAE nominal rounding is within ~7%
      checks.push({
        parameter: 'Rp',
        publishedIp: space.rpIp,
        publishedSi: space.rpMetric,
        calculatedSi: calculatedSiRp,
        variancePercent: Number(variance.toFixed(2)),
        isDiscrepancy: !isExpectedNominal,
        note: isExpectedNominal
          ? `Standard ASHRAE Table 6-1 nominal rounded value (published SI: ${space.rpMetric}, converted: ${calculatedSiRp} L/s·person)`
          : `Discrepancy detected: published SI ${space.rpMetric} differs noticeably from converted ${calculatedSiRp} L/s·person`
      });
    }

    // 2. Ra Check: L/s·m² vs cfm/ft²
    if (space.raIp !== undefined && !space.isRaNotApplicable) {
      const calculatedSiRa = Number((space.raIp * this.CFM_PER_SQFT_TO_LPS_PER_SQM).toFixed(3));
      const variance = space.raMetric !== 0
        ? Math.abs((space.raMetric - calculatedSiRa) / space.raMetric) * 100
        : 0;
      
      // Standard ASHRAE nominal values: 0.06 -> 0.3 (calc 0.305), 0.12 -> 0.6 (calc 0.610), 0.18 -> 0.9 (calc 0.914), etc.
      const isExpectedNominal = variance < 10;
      checks.push({
        parameter: 'Ra',
        publishedIp: space.raIp,
        publishedSi: space.raMetric,
        calculatedSi: calculatedSiRa,
        variancePercent: Number(variance.toFixed(2)),
        isDiscrepancy: !isExpectedNominal,
        note: isExpectedNominal
          ? `Standard ASHRAE Table 6-1 nominal rounded value (published SI: ${space.raMetric}, converted: ${calculatedSiRa} L/s·m²)`
          : `Discrepancy detected: published SI ${space.raMetric} differs noticeably from converted ${calculatedSiRa} L/s·m²`
      });
    }

    // 3. Occupant Density Check: #/100 m² vs #/1000 ft²
    if (space.defaultOccupancyIp !== undefined && !space.isDensityNotApplicable) {
      const calculatedSiDensity = Number((space.defaultOccupancyIp * this.DENSITY_IP_TO_SI_FACTOR).toFixed(2));
      const variance = space.defaultOccupancyMetric !== 0
        ? Math.abs((space.defaultOccupancyMetric - calculatedSiDensity) / space.defaultOccupancyMetric) * 100
        : 0;
      
      // In ASHRAE 62.1 Table 6-1, published density in SI is nominally set to the same integer value as IP
      const isDirectNominal = space.defaultOccupancyMetric === space.defaultOccupancyIp;
      checks.push({
        parameter: 'OccupantDensity',
        publishedIp: space.defaultOccupancyIp,
        publishedSi: space.defaultOccupancyMetric,
        calculatedSi: calculatedSiDensity,
        variancePercent: Number(variance.toFixed(2)),
        isDiscrepancy: !isDirectNominal && variance > 12,
        note: isDirectNominal
          ? `Published SI uses intentional ASHRAE Table 6-1 nominal equivalence (#/100 m² = ${space.defaultOccupancyMetric}, physical equivalent: ${calculatedSiDensity} #/100 m²)`
          : `Density variance: published ${space.defaultOccupancyMetric} vs converted ${calculatedSiDensity}`
      });
    }

    const hasDiscrepancies = checks.some(c => c.isDiscrepancy);

    return {
      id: space.id,
      name: space.name,
      group: space.category || space.occupancyGroup || 'Unknown',
      checks,
      hasDiscrepancies
    };
  }

  /**
   * Evaluates the completeness status of the space types dataset.
   */
  static getCompletenessStatus(spaceTypes: Ashrae621SpaceType[]): DatasetCompletenessStatus {
    if (!spaceTypes || spaceTypes.length === 0) return 'INCOMPLETE';

    const verifiedRecords = spaceTypes.filter(s => s.verificationStatus === 'VERIFIED');
    if (verifiedRecords.length === 0) return 'NOT_VERIFIED';

    if (spaceTypes.length >= this.EXPECTED_TOTAL_CATEGORIES && verifiedRecords.length >= this.EXPECTED_TOTAL_CATEGORIES) {
      // Check groups
      const groups = new Set(spaceTypes.map(s => s.occupancyGroup || s.category));
      const allGroupsPresent = this.EXPECTED_GROUPS.every(g => groups.has(g));
      if (allGroupsPresent) return 'COMPLETE';
    }

    if (spaceTypes.length > 5) return 'SUBSET';
    return 'SUBSET';
  }

  /**
   * Audits the entire dataset and generates an auditable, source-controlled report.
   */
  static auditEntireDataset(spaceTypes: Ashrae621SpaceType[]): Table61AuditReport {
    const results = spaceTypes.map(s => this.crossCheckRecord(s));
    const discrepanciesCount = results.filter(r => r.hasDiscrepancies).length;
    const completenessStatus = this.getCompletenessStatus(spaceTypes);
    const occupancyGroups = Array.from(new Set(spaceTypes.map(s => s.occupancyGroup || s.category))).sort();

    return {
      referenceBasis: ACTIVE_REFERENCE_BASIS,
      totalRecords: spaceTypes.length,
      requiredRecordsCount: this.EXPECTED_TOTAL_CATEGORIES,
      completenessStatus,
      occupancyGroupsCount: occupancyGroups.length,
      occupancyGroups,
      discrepanciesCount,
      results
    };
  }
}
