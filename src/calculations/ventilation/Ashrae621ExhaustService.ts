export type AshraeEdition = '2019' | '2022' | '2025';

export interface ExhaustSpaceType {
  id: string;
  name: string;
  ashraeCategory: string; // From Table 6.5
  ashraeRateImp: number; // cfm/ft2 or cfm/unit
  ashraeRateMet: number; // L/s-m2 or L/s-unit
  ashraeUnit: 'area' | 'fixture' | 'unit';
  ashraeClass: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4';
  imcRateImp: number; // cfm/ft2 or cfm/unit
  imcRateMet: number; // L/s-m2 or L/s-unit
  notes?: string;
}

export const EXHAUST_SPACE_TYPES: ExhaustSpaceType[] = [
  {
    id: 'art_classroom',
    name: 'Art classroom',
    ashraeCategory: 'Art classroom',
    ashraeRateImp: 0.7,
    ashraeRateMet: 3.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.7,
    imcRateMet: 3.5
  },
  {
    id: 'bath_public',
    name: 'Bathrooms (public)',
    ashraeCategory: 'Bathrooms (public)',
    ashraeRateImp: 50,
    ashraeRateMet: 25,
    ashraeUnit: 'fixture',
    ashraeClass: 'Class 2',
    imcRateImp: 50,
    imcRateMet: 25
  },
  {
    id: 'bath_private',
    name: 'Bathrooms (private)',
    ashraeCategory: 'Bathrooms (private)',
    ashraeRateImp: 25,
    ashraeRateMet: 12.5,
    ashraeUnit: 'fixture',
    ashraeClass: 'Class 2',
    imcRateImp: 50, // IMC requires 50 intermittent or 20 continuous
    imcRateMet: 25
  },
  {
    id: 'copy_print',
    name: 'Copy/printing rooms',
    ashraeCategory: 'Copy/printing rooms',
    ashraeRateImp: 0.5,
    ashraeRateMet: 2.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.5,
    imcRateMet: 2.5
  },
  {
    id: 'janitor',
    name: 'Janitor closets',
    ashraeCategory: 'Janitor closets',
    ashraeRateImp: 1.0,
    ashraeRateMet: 5.0,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 1.0,
    imcRateMet: 5.0
  },
  {
    id: 'kitchen_comm',
    name: 'Kitchen (commercial)',
    ashraeCategory: 'Kitchen (commercial)',
    ashraeRateImp: 0.7, // ASHRAE general exhaust if not hooded
    ashraeRateMet: 3.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 1.5,
    imcRateMet: 7.5
  },
  {
    id: 'locker_room',
    name: 'Locker rooms',
    ashraeCategory: 'Locker rooms',
    ashraeRateImp: 0.5,
    ashraeRateMet: 2.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.5,
    imcRateMet: 2.5
  },
  {
    id: 'parking_garage',
    name: 'Parking garages',
    ashraeCategory: 'Parking garages',
    ashraeRateImp: 0.75,
    ashraeRateMet: 3.8,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.75,
    imcRateMet: 3.8
  },
  {
    id: 'pet_shop',
    name: 'Pet shops',
    ashraeCategory: 'Pet shops',
    ashraeRateImp: 0.9,
    ashraeRateMet: 4.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.9,
    imcRateMet: 4.5
  },
  {
    id: 'soiled_laundry',
    name: 'Soiled laundry',
    ashraeCategory: 'Soiled laundry storage',
    ashraeRateImp: 1.0,
    ashraeRateMet: 5.0,
    ashraeUnit: 'area',
    ashraeClass: 'Class 3',
    imcRateImp: 1.0,
    imcRateMet: 5.0
  },
  {
    id: 'wood_metal_shop',
    name: 'Wood/metal shop',
    ashraeCategory: 'Wood/metal shop',
    ashraeRateImp: 0.5,
    ashraeRateMet: 2.5,
    ashraeUnit: 'area',
    ashraeClass: 'Class 2',
    imcRateImp: 0.5,
    imcRateMet: 2.5
  }
];

export const EXHAUST_DB: Record<AshraeEdition, ExhaustSpaceType[]> = {
  '2019': EXHAUST_SPACE_TYPES,
  '2022': EXHAUST_SPACE_TYPES,
  '2025': EXHAUST_SPACE_TYPES,
};

export interface ExhaustCalculationInput {
  spaceId: string;
  edition: AshraeEdition;
  quantity: number;
  isMetric: boolean;
  projectOverride?: number;
  mfgOverride?: number;
}

export interface ExhaustSpaceResult {
  spaceName: string;
  ashraeRequired: number;
  imcRequired: number;
  projectRequired: number;
  mfgRequired: number;
  governingRequired: number;
  governingSource: string;
  classification: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
}

export class Ashrae621ExhaustService {
  static getSpaces(edition: AshraeEdition = '2025'): ExhaustSpaceType[] {
    return EXHAUST_DB[edition] || EXHAUST_DB['2025'];
  }

  static getSpaceById(id: string, edition: AshraeEdition = '2025'): ExhaustSpaceType | undefined {
    return this.getSpaces(edition).find(s => s.id === id);
  }

  static calculateSpaceExhaust(input: ExhaustCalculationInput): ExhaustSpaceResult {
    const space = this.getSpaceById(input.spaceId, input.edition) || this.getSpaces(input.edition)[0];
    
    const ashraeRate = input.isMetric ? space.ashraeRateMet : space.ashraeRateImp;
    const imcRate = input.isMetric ? space.imcRateMet : space.imcRateImp;
    
    const ashraeRequired = input.quantity * ashraeRate;
    const imcRequired = input.quantity * imcRate;
    const projectRequired = input.projectOverride || 0;
    const mfgRequired = input.mfgOverride || 0;
    
    let governingRequired = 0;
    let governingSource = 'None';
    
    const candidates = [
      { source: 'ASHRAE 62.1', val: ashraeRequired },
      { source: 'IMC', val: imcRequired },
      { source: 'Project', val: projectRequired },
      { source: 'Manufacturer', val: mfgRequired }
    ];
    
    for (const c of candidates) {
      if (c.val > governingRequired) {
        governingRequired = c.val;
        governingSource = c.source;
      }
    }
    
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    if (governingRequired === 0) {
      status = 'WARNING';
    }

    return {
      spaceName: space.name,
      ashraeRequired,
      imcRequired,
      projectRequired,
      mfgRequired,
      governingRequired,
      governingSource,
      classification: space.ashraeClass,
      status
    };
  }
}
