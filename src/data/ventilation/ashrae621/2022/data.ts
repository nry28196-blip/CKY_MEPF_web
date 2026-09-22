import { SourceType, DatasetCompletenessStatus } from '../types';
import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType } from '../types';
import { ASHRAE_621_2022_ALL_SPACE_TYPES } from './table61Data';

export const ASHRAE_621_2022_DATASET_STATUS: DatasetCompletenessStatus = 'COMPLETE';

export const ASHRAE_621_2022_SPACE_TYPES: Ashrae621SpaceType[] = ASHRAE_621_2022_ALL_SPACE_TYPES;


export const ASHRAE_621_2022_EZ_VALUES: Ashrae621Ez[] = [
  { 
    id: 'ez-1', name: 'Ceiling supply of cool air', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply of Cool Air', applicableCondition: 'Cooling', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    distributionCategory: 'ceiling', supplyLocation: 'ceiling', supplyAirCondition: 'cool', returnLocation: 'ceiling', spaceTempRelationship: 'cooling', isWellMixed: true, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Cooling', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-ceil-warm-floor-ret', name: 'Ceiling supply of warm air with floor return', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply of Warm Air / Floor Return', applicableCondition: 'Heating', supplyArrangement: 'Ceiling', returnArrangement: 'Floor', 
    distributionCategory: 'ceiling', supplyLocation: 'ceiling', supplyAirCondition: 'warm', returnLocation: 'floor', spaceTempRelationship: 'heating_gte_8c', isWellMixed: true, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-2', name: 'Ceiling supply of warm air 15°F (8°C) or more above space temperature with ceiling return', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply of Warm Air / Ceiling Return (>= 8°C diff)', applicableCondition: 'Heating >= 8C diff', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    distributionCategory: 'ceiling', supplyLocation: 'ceiling', supplyAirCondition: 'warm', returnLocation: 'ceiling', spaceTempRelationship: 'heating_gte_8c', isWellMixed: false, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.8, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating >= 8C diff', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-ceil-warm-lt8c-highvel', name: 'Ceiling supply of warm air less than 15°F (8°C) above space temperature with ceiling return (jet velocity >= 150 fpm / 0.8 m/s within 4.5 ft / 1.4 m of floor)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply of Warm Air / Ceiling Return (< 8°C diff, high velocity)', applicableCondition: 'Heating < 8C diff, high velocity', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    distributionCategory: 'ceiling', supplyLocation: 'ceiling', supplyAirCondition: 'warm', returnLocation: 'ceiling', spaceTempRelationship: 'heating_lt_8c', supplyJetVelocityCondition: '>= 0.8 m/s (150 fpm) within 1.4 m (4.5 ft) of floor', isWellMixed: true, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating < 8C diff, high velocity', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-ceil-warm-lt8c-lowvel', name: 'Ceiling supply of warm air less than 15°F (8°C) above space temperature with ceiling return (jet velocity < 150 fpm / 0.8 m/s within 4.5 ft / 1.4 m of floor)', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply of Warm Air / Ceiling Return (< 8°C diff, low velocity)', applicableCondition: 'Heating < 8C diff, low velocity', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    distributionCategory: 'ceiling', supplyLocation: 'ceiling', supplyAirCondition: 'warm', returnLocation: 'ceiling', spaceTempRelationship: 'heating_lt_8c', supplyJetVelocityCondition: '< 0.8 m/s (150 fpm) within 1.4 m (4.5 ft) of floor', isWellMixed: false, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.8, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating < 8C diff, low velocity', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-floor-warm-floor-ret', name: 'Floor supply of warm air with floor return', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply of Warm Air / Floor Return', applicableCondition: 'Heating', supplyArrangement: 'Floor', returnArrangement: 'Floor', 
    distributionCategory: 'floor', supplyLocation: 'floor', supplyAirCondition: 'warm', returnLocation: 'floor', spaceTempRelationship: 'heating_gte_8c', isWellMixed: true, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-floor-warm-ceil-ret', name: 'Floor supply of warm air with ceiling return', ez: 0.7, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply of Warm Air / Ceiling Return', applicableCondition: 'Heating, supply jet reaches 4.5 ft (1.4 m) or higher above floor', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    distributionCategory: 'floor', supplyLocation: 'floor', supplyAirCondition: 'warm', returnLocation: 'ceiling', spaceTempRelationship: 'heating_gte_8c', supplyJetVelocityCondition: '150 fpm (0.8 m/s) supply jet reaches 4.5 ft (1.4 m) or higher above floor', isWellMixed: false, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.7, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Heating, supply jet reaches 4.5 ft (1.4 m) or higher above floor', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-3', name: 'Floor supply of cool air and ceiling return with low velocity / displacement (vertical throw <= 4.5 ft / 1.4 m, return height < 18 ft / 5.5 m)', ez: 1.2, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply of Cool Air / Ceiling Return (Stratified, H < 5.5 m)', applicableCondition: 'Low velocity displacement, return height < 18 ft (5.5 m)', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    distributionCategory: 'floor', supplyLocation: 'floor', supplyAirCondition: 'cool', returnLocation: 'ceiling', spaceTempRelationship: 'cooling', verticalThrowCondition: 'Throw of 0.25 m/s (50 fpm) <= 1.4 m (4.5 ft) above floor', returnAirHeightCondition: '< 5.5 m (18 ft)', isWellMixed: false, isStratified: true, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Low velocity displacement, return height < 18 ft (5.5 m)', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-floor-cool-strat-h-gte55m', name: 'Floor supply of cool air and ceiling return with low velocity / displacement (vertical throw <= 4.5 ft / 1.4 m, return height >= 18 ft / 5.5 m)', ez: 1.5, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply of Cool Air / Ceiling Return (Stratified, H >= 5.5 m)', applicableCondition: 'Low velocity displacement, return height >= 18 ft (5.5 m)', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    distributionCategory: 'floor', supplyLocation: 'floor', supplyAirCondition: 'cool', returnLocation: 'ceiling', spaceTempRelationship: 'cooling', verticalThrowCondition: 'Throw of 0.25 m/s (50 fpm) <= 1.4 m (4.5 ft) above floor', returnAirHeightCondition: '>= 5.5 m (18 ft)', isWellMixed: false, isStratified: true, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Low velocity displacement, return height >= 18 ft (5.5 m)', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-4', name: 'Floor supply of cool air and ceiling return with vertical throw > 4.5 ft (1.4 m) (well-mixed)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply of Cool Air / Ceiling Return (Well-Mixed)', applicableCondition: 'Floor supply cool air, vertical throw > 4.5 ft (1.4 m)', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    distributionCategory: 'floor', supplyLocation: 'floor', supplyAirCondition: 'cool', returnLocation: 'ceiling', spaceTempRelationship: 'cooling', verticalThrowCondition: 'Throw of 0.25 m/s (50 fpm) > 1.4 m (4.5 ft) above floor', isWellMixed: true, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Floor supply cool air, vertical throw > 4.5 ft (1.4 m)', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-makeup-direct-exhaust', name: 'Makeup supply air drawn from space before mixing or within 15 ft (4.5 m) of exhaust hood', ez: 0.5, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Makeup Supply Drawn Directly into Exhaust', applicableCondition: 'Makeup supply drawn before mixing or within 15 ft (4.5 m) of exhaust', supplyArrangement: 'Ceiling', returnArrangement: 'Other', 
    distributionCategory: 'makeup', supplyLocation: 'ceiling', supplyAirCondition: 'any', returnLocation: 'other', spaceTempRelationship: 'none', additionalQualifyingConditions: 'Makeup supply air drawn from the space before it can mix or within 15 ft (4.5 m) of an exhaust hood', isWellMixed: false, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Makeup supply drawn before mixing or within 15 ft (4.5 m) of exhaust', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-personalized-ventilation', name: 'Personalized ventilation supplying 100% outdoor air directly to occupant breathing zone', ez: 1.5, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Personalized Ventilation Directly to Breathing Zone', applicableCondition: 'Personalized ventilation delivering 100% outdoor air directly to breathing zone', supplyArrangement: 'Breathing Zone', returnArrangement: 'Ceiling', 
    distributionCategory: 'personalized', supplyLocation: 'breathing_zone', supplyAirCondition: 'cool', returnLocation: 'ceiling', spaceTempRelationship: 'cooling', isPersonalized: true, isWellMixed: false, isStratified: false, additionalQualifyingConditions: 'Dedicated personalized air terminal delivering outdoor air directly to occupant breathing zone',
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Personalized ventilation delivering 100% outdoor air directly to breathing zone', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-unidirectional-flow', name: 'Unidirectional downward flow through perforated ceiling (cleanroom/specialized) [UNIMPLEMENTED]', ez: 0.5, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Unidirectional Downward Flow', applicableCondition: 'Unidirectional downward flow (cleanroom)', supplyArrangement: 'Ceiling', returnArrangement: 'Floor', 
    distributionCategory: 'unidirectional', supplyLocation: 'ceiling', supplyAirCondition: 'isothermal', returnLocation: 'floor', spaceTempRelationship: 'none', isWellMixed: false, isStratified: false, isPersonalized: false,
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'NOT_VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 'Unidirectional downward flow (cleanroom)', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'NOT_VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'NOT_VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'NOT_VERIFIED', verificationDate: '2026-09-08'
  }
];

// SUPPORTED SUBSET of ASHRAE 62.1-2022 Table 6.5.1
export const ASHRAE_621_2022_EXHAUST_RATES: Ashrae621ExhaustType[] = [
  { 
    id: 'toilet_public', name: 'Toilet rooms - Public', category: 'Public', standard: 'ASHRAE 62.1', rate: 25, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 25, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'fixture', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'toilet_private', name: 'Toilet rooms - Private', category: 'Private', standard: 'ASHRAE 62.1', rate: 12.5, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 12.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'fixture', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'kitchen_commercial', name: 'Commercial kitchen', category: 'Commercial', standard: 'ASHRAE 62.1', rate: 3.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 3, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 3.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'm2', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 3, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'parking_garage', name: 'Enclosed parking garage', category: 'Parking', standard: 'ASHRAE 62.1', rate: 3.7, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 3.7, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'm2', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'janitor', name: 'Janitor closet', category: 'Service', standard: 'ASHRAE 62.1', rate: 5.0, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 5.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'm2', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'copy_room', name: 'Copy, printing room', category: 'Office', standard: 'ASHRAE 62.1', rate: 2.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 2.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 'm2', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 'Continuous', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 'Table 6.5.1', standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  }
];

export * from '../types';

export const ASHRAE_621_2022_AIR_QUALITY_STANDARDS = {
  filtrationRequirements: {
    minimumMERV: 8,
    pm25DesignThreshold: 12,
    ozoneNonattainmentRequired: true
  },
  exhaustClasses: [
    { class: 1, recirculationAllowed: true, description: "Low contaminant concentration" },
    { class: 2, recirculationAllowed: "limited", description: "Moderate contaminant concentration" },
    { class: 3, recirculationAllowed: false, description: "Significant contaminant concentration" },
    { class: 4, recirculationAllowed: false, description: "Highly objectionable/harmful" }
  ]
};
