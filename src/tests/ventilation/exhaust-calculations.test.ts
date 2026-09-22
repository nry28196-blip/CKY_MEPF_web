import { describe, it, expect } from 'vitest';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('ASHRAE 62.1-2022 Prescriptive Exhaust Calculations (Table 6-2 & Section 6.5.1)', () => {
  const exhaustRates2022 = StandardDataProvider.get621ExhaustRates('2022');

  it('A. Art Classrooms (Area-based m² continuous rate)', () => {
    const artClassroom = exhaustRates2022.find(e => e.id === 'art_classroom')!;
    expect(artClassroom).toBeDefined();
    expect(artClassroom.rate).toBe(3.5);
    expect(artClassroom.unitType).toBe('m2');
    expect(artClassroom.airClass).toBe(2);

    const result = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: 100, // 100 m²
      designExhaust: 350 // 350 L/s
    });

    expect(result.status).toBe('PASS');
    expect(result.requiredExhaust).toBeCloseTo(350, 1);
    expect(result.airClass).toBe(2);
    expect(result.exhaustClass).toBe(2);
    expect(result.referenceTable).toBe('Table 6-2');
    expect(result.referenceSection).toBe('6.5.1');
  });

  it('B. Public Toilets - Continuous vs Intermittent Rates', () => {
    const publicToilet = exhaustRates2022.find(e => e.id === 'toilet_public')!;
    expect(publicToilet).toBeDefined();
    expect(publicToilet.continuousRate).toBe(25);
    expect(publicToilet.intermittentRate).toBe(35);
    expect(publicToilet.unitType).toBe('fixture');

    // Continuous mode (default)
    const continuousResult = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: publicToilet,
      qty: 4, // 4 fixtures
      designExhaust: 100,
      operationMode: 'continuous'
    });
    expect(continuousResult.status).toBe('PASS');
    expect(continuousResult.requiredExhaust).toBe(100); // 25 L/s * 4
    expect(continuousResult.operationMode).toBe('continuous');

    // Intermittent mode
    const intermittentResult = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: publicToilet,
      qty: 4, // 4 fixtures
      designExhaust: 140,
      operationMode: 'intermittent'
    });
    expect(intermittentResult.status).toBe('PASS');
    expect(intermittentResult.requiredExhaust).toBe(140); // 35 L/s * 4
    expect(intermittentResult.operationMode).toBe('intermittent');

    // Intermittent mode with insufficient design exhaust fails
    const failIntermittent = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: publicToilet,
      qty: 4,
      designExhaust: 120, // < 140
      operationMode: 'intermittent'
    });
    expect(failIntermittent.status).toBe('FAIL');
  });

  it('C. Rejection of Intermittent Mode when Not Permitted by Table 6-2', () => {
    const artClassroom = exhaustRates2022.find(e => e.id === 'art_classroom')!;
    expect(artClassroom.intermittentRate).toBeNull();

    const result = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: 100,
      designExhaust: 500,
      operationMode: 'intermittent'
    });

    expect(result.status).toBe('FAIL');
    expect(result.complianceNotes.some(n => n.includes('Intermittent exhaust is not permitted'))).toBe(true);
  });

  it('D. Private Toilets (Room-based continuous & intermittent)', () => {
    const privateToilet = exhaustRates2022.find(e => e.id === 'toilet_private')!;
    expect(privateToilet).toBeDefined();
    expect(privateToilet.continuousRate).toBe(12.5);
    expect(privateToilet.intermittentRate).toBe(25);
    expect(privateToilet.unitType).toBe('room');

    // Continuous: 12.5 * 2 = 25 L/s
    const contRes = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: privateToilet,
      qty: 2,
      designExhaust: 25,
      operationMode: 'continuous'
    });
    expect(contRes.status).toBe('PASS');
    expect(contRes.requiredExhaust).toBe(25);

    // Intermittent: 25 * 2 = 50 L/s
    const intRes = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: privateToilet,
      qty: 2,
      designExhaust: 50,
      operationMode: 'intermittent'
    });
    expect(intRes.status).toBe('PASS');
    expect(intRes.requiredExhaust).toBe(50);
  });

  it('E. Shower Rooms (Showerhead-based continuous & intermittent)', () => {
    const showerRooms = exhaustRates2022.find(e => e.id === 'shower_rooms')!;
    expect(showerRooms).toBeDefined();
    expect(showerRooms.continuousRate).toBe(10);
    expect(showerRooms.intermittentRate).toBe(25);
    expect(showerRooms.unitType).toBe('showerhead');

    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: showerRooms,
      qty: 6, // 6 showerheads
      designExhaust: 60, // 10 * 6 = 60 L/s
      operationMode: 'continuous'
    });
    expect(res.status).toBe('PASS');
    expect(res.requiredExhaust).toBe(60);
  });

  it('F. Commercial Kitchen - Correct Prescriptive Rate & Air Class 2', () => {
    const kitchen = exhaustRates2022.find(e => e.id === 'kitchen_commercial')!;
    expect(kitchen).toBeDefined();
    expect(kitchen.rate).toBe(3.5);
    expect(kitchen.rateIp).toBe(0.70);
    expect(kitchen.airClass).toBe(2);
    expect(kitchen.exhaustClass).toBe(2); // MUST NOT be Class 3
    expect(kitchen.unitType).toBe('m2');

    const res = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: kitchen,
      qty: 50,
      designExhaust: 175 // 3.5 * 50 = 175 L/s
    });
    expect(res.status).toBe('PASS');
    expect(res.requiredExhaust).toBe(175);
    expect(res.airClass).toBe(2);
    expect(res.recirculationClassification).toContain('Air Class 2');
  });

  it('G. Special Standard Spaces (Paint Spray Booths & Refrigerating Machinery)', () => {
    const paintBooth = exhaustRates2022.find(e => e.id === 'paint_spray_booths')!;
    expect(paintBooth.isSpecialStandard).toBe(true);
    expect(paintBooth.specialStandardReference).toBe('OSHA 1910.107 / NFPA 33');
    expect(paintBooth.airClass).toBe(4);

    const resPaint = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: paintBooth,
      qty: 1,
      designExhaust: 1000
    });
    expect(resPaint.status).toBe('PASS');
    expect(resPaint.isSpecialStandard).toBe(true);
    expect(resPaint.specialStandardReference).toBe('OSHA 1910.107 / NFPA 33');
    expect(resPaint.recirculationClassification).toContain('Air Class 4');

    const refMachinery = exhaustRates2022.find(e => e.id === 'refrigerating_machinery')!;
    expect(refMachinery.isSpecialStandard).toBe(true);
    expect(refMachinery.specialStandardReference).toBe('ANSI/ASHRAE Standard 15');
    expect(refMachinery.airClass).toBe(3);

    const resRef = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: refMachinery,
      qty: 1,
      designExhaust: 800
    });
    expect(resRef.status).toBe('PASS');
    expect(resRef.specialStandardReference).toBe('ANSI/ASHRAE Standard 15');
    expect(resRef.recirculationClassification).toContain('Air Class 3');
  });

  it('H. IP Unit System Calculations', () => {
    const publicToilet = exhaustRates2022.find(e => e.id === 'toilet_public')!;
    const resIp = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: publicToilet,
      qty: 4, // 4 fixtures
      designExhaust: 200, // 200 cfm
      unitSystem: 'ip',
      operationMode: 'continuous'
    });

    expect(resIp.status).toBe('PASS');
    expect(resIp.requiredExhaust).toBe(200); // 50 cfm/fixture * 4 = 200 cfm
    expect(resIp.requiredExhaustIp).toBe(200);
    expect(resIp.requiredExhaustMetric).toBe(100); // 25 L/s * 4 = 100 L/s
  });

  it('I. Input Semantics and Error Handling', () => {
    // Null exhaust type
    const nullType = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: null,
      qty: 10,
      designExhaust: 100
    });
    expect(nullType.status).toBe('NOT_EVALUATED');
    expect(nullType.requiredExhaust).toBeNull();

    // Invalid negative quantity
    const artClassroom = exhaustRates2022.find(e => e.id === 'art_classroom')!;
    const negQty = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: -5,
      designExhaust: 100
    });
    expect(negQty.status).toBe('FAIL');

    // Missing quantity
    const missingQty = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: null,
      designExhaust: 100
    });
    expect(missingQty.status).toBe('INCOMPLETE');

    // Missing design exhaust
    const missingDesign = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: 100,
      designExhaust: null
    });
    expect(missingDesign.status).toBe('INCOMPLETE');

    // Design exhaust less than required
    const insufficientExhaust = Ashrae621ExhaustService.calculate({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      exhaustType: artClassroom,
      qty: 100, // required: 350 L/s
      designExhaust: 300 // < 350
    });
    expect(insufficientExhaust.status).toBe('FAIL');
  });
});
