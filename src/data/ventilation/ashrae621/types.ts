
export type AshraeEdition = '2019' | '2022' | '2025';

export interface StandardRevision {
    standard: string;
    edition: string;
    baseEdition: string;
    publishedAddendaApplied: string[];
    publishedErrataApplied: string[];
    verificationDate: string;
    source: string;
}

export interface Ashrae621SpaceType {
  id: string;
  name: string;
  standard: string;
  edition: string;
  category: string;
  rpMetric: number; // L/s-person
  raMetric: number; // L/s-m2
  defaultOccupancyMetric: number; // persons/100m2
  units: string;
  exhaustRequired: boolean;
  reference: string;
  notes: string;
  revisionState: StandardRevision;
  sourceType: string;
  verificationDate?: string;
}

export interface Ashrae621Ez {
  id: string;
  name: string;
  standard: string;
  edition: string;
  configuration: string;
  applicableCondition: string;
  supplyArrangement: string;
  returnArrangement: string;
  ez: number;
  reference: string;
  revisionState: StandardRevision;
  sourceType: string;
  verificationDate?: string;
}

export interface Ashrae621ExhaustType {
  id: string;
  name: string;
  category: string;
  rate: number;
  unitType: 'fixture' | 'm2' | 'room' | 'equipment';
  operatingCondition: string;
  exhaustClass: number;
  reference: string;
  edition: string;
  revisionState: StandardRevision;
  sourceType: string;
  verificationDate?: string;
}

export interface Ashrae621FiltrationRequirements {
  minimumMERV: number;
  pm25DesignThreshold: number;
  ozoneNonattainmentRequired: boolean;
}

export interface Ashrae621ExhaustClass {
  class: number;
  recirculationAllowed: boolean | 'limited';
  description: string;
}

export interface Ashrae621AirQualityStandards {
  filtrationRequirements: Ashrae621FiltrationRequirements;
  exhaustClasses: Ashrae621ExhaustClass[];
}
