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
  revisionSource: string;
}

export interface Ashrae621Ez {
  standard: string;
  edition: string;
  configuration: string;
  applicableCondition: string;
  supplyArrangement: string;
  returnArrangement: string;
  revision: string;
  id: string;
  name: string;
  ez: number;
  reference: string;
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
  revision: string;
}
