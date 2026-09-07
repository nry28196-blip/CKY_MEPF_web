export interface Ashrae622Coefficients {
  areaCoefficientSI: number;
  occupancyCoefficientSI: number;
  areaCoefficientIP: number;
  occupancyCoefficientIP: number;
  localExhaustDeficitCoefficient: number;
}

export const ASHRAE_622_2025_COEFFICIENTS: Ashrae622Coefficients = {
  areaCoefficientSI: 0.15,
  occupancyCoefficientSI: 3.5,
  areaCoefficientIP: 0.03,
  occupancyCoefficientIP: 7.5,
  localExhaustDeficitCoefficient: 0.25
};
