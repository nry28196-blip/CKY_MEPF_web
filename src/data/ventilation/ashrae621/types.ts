export interface Ashrae621SpaceType {
  id: string;
  name: string;
  category: string;
  rpMetric: number; // L/s-person
  raMetric: number; // L/s-m2
  defaultOccupancyMetric: number; // persons/100m2
  exhaustRequired: boolean;
  reference: string;
}

export interface Ashrae621Ez {
  id: string;
  name: string;
  ez: number;
  reference: string;
}

export interface Ashrae621ExhaustType {
  id: string;
  name: string;
  rate: number;
  unitType: 'fixture' | 'm2' | 'room' | 'equipment';
  exhaustClass: number;
  reference: string;
}
