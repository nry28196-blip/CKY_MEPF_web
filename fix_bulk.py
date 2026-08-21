import re

with open('src/components/BulkCalc.tsx', 'r') as f:
    content = f.read()

content = content.replace("const { t } = useLanguage();", """const { t } = useLanguage();
  const { unitSystem } = useUnit();
  const prevUnit = React.useRef(unitSystem);

  useEffect(() => {
    if (prevUnit.current !== unitSystem) {
      setRows(rows.map(r => {
        const newRow = { ...r };
        if (systemType === 'duct') {
          if (unitSystem === 'metric') {
            newRow.in1 = Math.round(r.in1 * CONVERSIONS.CFM_TO_LPS);
            newRow.in2 = Number((r.in2 * CONVERSIONS.IN100FT_TO_PAM).toFixed(2));
            newRow.in3 = Math.round(r.in3 * CONVERSIONS.IN_TO_MM);
          } else {
            newRow.in1 = Math.round(r.in1 * CONVERSIONS.LPS_TO_CFM);
            newRow.in2 = Number((r.in2 * CONVERSIONS.PAM_TO_IN100FT).toFixed(3));
            newRow.in3 = Math.round(r.in3 * CONVERSIONS.MM_TO_IN);
          }
        } else if (systemType === 'cooling') {
          if (unitSystem === 'metric') {
             newRow.in1 = Math.round(r.in1 * CONVERSIONS.CFM_TO_LPS);
             newRow.in2 = Number(deltaFahrenheitToCelsius(r.in2).toFixed(1));
          } else {
             newRow.in1 = Math.round(r.in1 * CONVERSIONS.LPS_TO_CFM);
             newRow.in2 = Number(deltaCelsiusToFahrenheit(r.in2).toFixed(1));
          }
        } else if (systemType === 'pipe') {
          if (unitSystem === 'metric') {
            newRow.in1 = Number((r.in1 * CONVERSIONS.GPM_TO_LPS).toFixed(2));
            newRow.in2 = Math.round(r.in2 * CONVERSIONS.IN_TO_MM);
          } else {
            newRow.in1 = Math.round(r.in1 * CONVERSIONS.LPS_TO_GPM);
            newRow.in2 = Number((r.in2 * CONVERSIONS.MM_TO_IN).toFixed(2));
          }
        }
        return newRow;
      }));
      prevUnit.current = unitSystem;
    }
  }, [unitSystem, systemType, rows]);
""")

content = content.replace("""const calculateResults = (r: BulkRow): BulkRow => {
    const res = { ...r };""", """const calculateResults = (r: BulkRow): BulkRow => {
    const res = { ...r };
    const isMetric = unitSystem === 'metric';
    """)

content = content.replace("""    if (systemType === 'duct') {
      const cfm = r.in1;
      const friction = r.in2;
      const height = r.in3;
      const de = calculateDe(cfm, friction);
      const width = solveWidth(de, height);
      const vel = calculateVelocityRect(cfm, width, height);
      res.out1 = de; // Eq. Diameter
      res.out2 = width; // Width
      res.out3 = vel; // Velocity
      res.status = vel <= 2000 ? 'optimal' : vel <= 2500 ? 'warning' : 'danger';
    }""", """    if (systemType === 'duct') {
      const cfm = isMetric ? r.in1 * CONVERSIONS.LPS_TO_CFM : r.in1;
      const friction = isMetric ? r.in2 * CONVERSIONS.PAM_TO_IN100FT : r.in2;
      const height = isMetric ? r.in3 * CONVERSIONS.MM_TO_IN : r.in3;
      const de = calculateDe(cfm, friction);
      const width = solveWidth(de, height);
      const vel = calculateVelocityRect(cfm, width, height);
      res.out1 = isMetric ? de * CONVERSIONS.IN_TO_MM : de;
      res.out2 = isMetric ? Math.round(width * CONVERSIONS.IN_TO_MM) : width;
      res.out3 = isMetric ? vel * CONVERSIONS.FPM_TO_MS : vel;
      res.status = vel <= 2000 ? 'optimal' : vel <= 2500 ? 'warning' : 'danger';
    }""")

content = content.replace("""    else if (systemType === 'cooling') {
      // Sensible Heat Load: Q = 1.2 * L/s * DeltaT
      const flow = r.in1; // L/s
      const deltaT = r.in2; // C
      res.out1 = (1.2 * flow * deltaT) / 1000; // kW
    }""", """    else if (systemType === 'cooling') {
      const flow = isMetric ? r.in1 : r.in1 * CONVERSIONS.CFM_TO_LPS;
      const deltaT = isMetric ? r.in2 : deltaFahrenheitToCelsius(r.in2);
      const kw = (1.2 * flow * deltaT) / 1000;
      res.out1 = isMetric ? kw : kw * CONVERSIONS.KW_TO_BTUH;
    }""")

content = content.replace("""    else if (systemType === 'pipe') {
      // Velocity: V = Q / A
      // in1: Flow (L/s), in2: Diameter (mm)
      const q = r.in1 / 1000; // m3/s
      const d = r.in2 / 1000; // m
      if (d > 0) {
        const area = Math.PI * Math.pow(d / 2, 2);
        res.out1 = q / area; // m/s
      } else {
        res.out1 = 0;
      }
    }""", """    else if (systemType === 'pipe') {
      const q_lps = isMetric ? r.in1 : r.in1 * CONVERSIONS.GPM_TO_LPS;
      const d_mm = isMetric ? r.in2 : r.in2 * CONVERSIONS.IN_TO_MM;
      const q = q_lps / 1000;
      const d = d_mm / 1000;
      if (d > 0) {
        const area = Math.PI * Math.pow(d / 2, 2);
        const v_ms = q / area;
        res.out1 = isMetric ? v_ms : v_ms * CONVERSIONS.MS_TO_FPM / 60; // ft/s? No FPM
      } else {
        res.out1 = 0;
      }
    }""")

content = content.replace("""  const getHeaders = () => {
    switch (systemType) {
      case 'duct': return {
        inputs: [{name: 'Airflow (CFM)', key: 'in1'}, {name: 'Friction Rate (in/100ft)', key: 'in2'}, {name: 'Duct Height (in)', key: 'in3'}],
        outputs: [{name: 'Eq. Diameter (in)'}, {name: 'Width (in)'}, {name: 'Velocity (FPM)'}]
      };
      case 'cooling': return {
        inputs: [{name: 'Airflow (L/s)', key: 'in1'}, {name: 'Delta T (°C)', key: 'in2'}],
        outputs: [{name: 'Sensible Load (kW)'}]
      };
      case 'flc': return {
        inputs: [{name: 'Voltage (V)', key: 'in1'}, {name: 'Phase (1 or 3)', key: 'in2'}, {name: 'Power (kW)', key: 'in3'}, {name: 'Power Factor', key: 'in4'}],
        outputs: [{name: 'Full Load Current (A)'}]
      };
      case 'pipe': return {
        inputs: [{name: 'Flow Rate (L/s)', key: 'in1'}, {name: 'Inner Diameter (mm)', key: 'in2'}],
        outputs: [{name: 'Velocity (m/s)'}]
      };
    }
  };""", """  const getHeaders = () => {
    const isMetric = unitSystem === 'metric';
    switch (systemType) {
      case 'duct': return {
        inputs: [{name: isMetric ? 'Airflow (L/s)' : 'Airflow (CFM)', key: 'in1'}, {name: isMetric ? 'Friction (Pa/m)' : 'Friction (in/100ft)', key: 'in2'}, {name: isMetric ? 'Height (mm)' : 'Height (in)', key: 'in3'}],
        outputs: [{name: isMetric ? 'Eq. Dia (mm)' : 'Eq. Dia (in)'}, {name: isMetric ? 'Width (mm)' : 'Width (in)'}, {name: isMetric ? 'Vel (m/s)' : 'Vel (FPM)'}]
      };
      case 'cooling': return {
        inputs: [{name: isMetric ? 'Airflow (L/s)' : 'Airflow (CFM)', key: 'in1'}, {name: isMetric ? 'Delta T (°C)' : 'Delta T (°F)', key: 'in2'}],
        outputs: [{name: isMetric ? 'Sensible Load (kW)' : 'Sensible Load (BTU/h)'}]
      };
      case 'flc': return {
        inputs: [{name: 'Voltage (V)', key: 'in1'}, {name: 'Phase (1 or 3)', key: 'in2'}, {name: 'Power (kW)', key: 'in3'}, {name: 'Power Factor', key: 'in4'}],
        outputs: [{name: 'Full Load Current (A)'}]
      };
      case 'pipe': return {
        inputs: [{name: isMetric ? 'Flow Rate (L/s)' : 'Flow Rate (GPM)', key: 'in1'}, {name: isMetric ? 'Inner Dia (mm)' : 'Inner Dia (in)', key: 'in2'}],
        outputs: [{name: isMetric ? 'Velocity (m/s)' : 'Velocity (FPM)'}]
      };
    }
  };""")

with open('src/components/BulkCalc.tsx', 'w') as f:
    f.write(content)
