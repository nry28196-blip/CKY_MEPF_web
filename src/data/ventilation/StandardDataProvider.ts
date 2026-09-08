import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, Ashrae621AirQualityStandards } from './ashrae621/types';
import { ASHRAE_621_2019_SPACE_TYPES, ASHRAE_621_2019_EZ_VALUES, ASHRAE_621_2019_EXHAUST_RATES, ASHRAE_621_2019_AIR_QUALITY_STANDARDS } from './ashrae621/2019/data';
import { ASHRAE_621_2022_SPACE_TYPES, ASHRAE_621_2022_EZ_VALUES, ASHRAE_621_2022_EXHAUST_RATES, ASHRAE_621_2022_AIR_QUALITY_STANDARDS } from './ashrae621/2022/data';
import { ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES, ASHRAE_621_2025_EXHAUST_RATES, ASHRAE_621_2025_AIR_QUALITY_STANDARDS } from './ashrae621/2025/data';
import { Ashrae622Coefficients } from './ashrae622/types'; 
import { ASHRAE_622_2019_COEFFICIENTS } from './ashrae622/2019/data';
import { ASHRAE_622_2022_COEFFICIENTS } from './ashrae622/2022/data';
import { ASHRAE_622_2025_COEFFICIENTS } from './ashrae622/2025/data';

export type AshraeEdition = '2019' | '2022' | '2025';

export class StandardDataProvider {
  static get621SpaceTypes(edition: AshraeEdition | string): Ashrae621SpaceType[] {
    switch (edition) {
      case '2019': return ASHRAE_621_2019_SPACE_TYPES;
      case '2022': return ASHRAE_621_2022_SPACE_TYPES;
      case '2025': return ASHRAE_621_2025_SPACE_TYPES;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }
  static get621EzValues(edition: AshraeEdition | string): Ashrae621Ez[] {
    switch (edition) {
      case '2019': return ASHRAE_621_2019_EZ_VALUES;
      case '2022': return ASHRAE_621_2022_EZ_VALUES;
      case '2025': return ASHRAE_621_2025_EZ_VALUES;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }
  static get621ExhaustRates(edition: AshraeEdition | string): Ashrae621ExhaustType[] {
    switch (edition) {
      case '2019': return ASHRAE_621_2019_EXHAUST_RATES;
      case '2022': return ASHRAE_621_2022_EXHAUST_RATES;
      case '2025': return ASHRAE_621_2025_EXHAUST_RATES;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }
  static get622Coefficients(edition: AshraeEdition | string): Ashrae622Coefficients {
    switch (edition) {
      case '2019': return ASHRAE_622_2019_COEFFICIENTS;
      case '2022': return ASHRAE_622_2022_COEFFICIENTS;
      case '2025': return ASHRAE_622_2025_COEFFICIENTS;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }

  static get621AirQualityStandards(edition: AshraeEdition | string): Ashrae621AirQualityStandards {
    switch (edition) {
      case '2019': return ASHRAE_621_2019_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      case '2022': return ASHRAE_621_2022_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      case '2025': return ASHRAE_621_2025_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }

}