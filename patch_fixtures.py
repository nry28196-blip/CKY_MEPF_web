import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Replace the initial state of fixtures
search_str = """  // State 1: Fixtures
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc', name: 'Water Closet (Toilet)', wsfu: 10, dfu: 6, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'lav', name: 'Lavatory Sink (Bathroom)', wsfu: 1.5, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'shower', name: 'Shower Head (Domestic)', wsfu: 2, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'sink', name: 'Kitchen Sink', wsfu: 2.5, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal', name: 'Urinal (Flushometer/Bowl)', wsfu: 5, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
  ]);"""

replacement_str = """  // State 1: Fixtures (IPC Appendix E & Chapter 7 Compliant)
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc_pub_fv', name: 'Water Closet (Public) - Flushometer', wsfu: 10, dfu: 6, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'wc_pub_ft', name: 'Water Closet (Public) - Flush Tank', wsfu: 5, dfu: 4, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'wc_priv_fv', name: 'Water Closet (Private) - Flushometer', wsfu: 6, dfu: 4, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'wc_priv_ft', name: 'Water Closet (Private) - Flush Tank', wsfu: 2.2, dfu: 3, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'lav_pub', name: 'Lavatory (Public) - Faucet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'lav_priv', name: 'Lavatory (Private) - Faucet', wsfu: 0.7, dfu: 1, lu: 1.0, du: 0.5, qty: 0 },
    { id: 'shower_pub', name: 'Shower (Public) - Mixing Valve', wsfu: 4.0, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'shower_priv', name: 'Shower (Private) - Mixing Valve', wsfu: 1.4, dfu: 2, lu: 2.0, du: 0.6, qty: 0 },
    { id: 'sink_pub', name: 'Service Sink (Public) - Faucet', wsfu: 3.0, dfu: 2, lu: 3.0, du: 0.8, qty: 0 },
    { id: 'sink_priv', name: 'Kitchen Sink (Private) - Faucet', wsfu: 1.4, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal_pub_fv', name: 'Urinal (Public) - 1" Flushometer', wsfu: 5.0, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
    { id: 'drink_fount', name: 'Drinking Fountain (Public/Private)', wsfu: 0.25, dfu: 0.5, lu: 0.1, du: 0.1, qty: 0 },
  ]);"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/PlumbingCalc.tsx', 'w') as f:
        f.write(content)
    print("Patched fixtures successfully")
else:
    print("Fixtures string not found")

# Replace getHuntersFlowGPM
search_str2 = """  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    if (type === 'valve') {
      // Commercial Flushometer Valve Curve
      if (wsfu <= 5) return 10 + (2.5 * wsfu);
      if (wsfu <= 20) return 22 + (1.2 * (wsfu - 5));
      if (wsfu <= 100) return 40 + (0.45 * (wsfu - 20));
      return 76 + (0.22 * (wsfu - 100));
    } else {
      // Residential Flush Tank Curve
      if (wsfu <= 5) return 1.5 * wsfu;
      if (wsfu <= 20) return 5 + (0.8 * (wsfu - 5));
      if (wsfu <= 100) return 17 + (0.35 * (wsfu - 20));
      return 45 + (0.18 * (wsfu - 100));
    }
  };"""

replacement_str2 = """  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    // IPC 2018 Table E103.3(3) Hunter's Curve Interpolation
    if (type === 'valve') {
      if (wsfu <= 10) return 27; // Minimum starting point for flushometer
      if (wsfu <= 20) return 27 + ((wsfu - 10) * (35 - 27) / 10);
      if (wsfu <= 30) return 35 + ((wsfu - 20) * (42 - 35) / 10);
      if (wsfu <= 40) return 42 + ((wsfu - 30) * (46 - 42) / 10);
      if (wsfu <= 50) return 46 + ((wsfu - 40) * (51.5 - 46) / 10);
      if (wsfu <= 100) return 51.5 + ((wsfu - 50) * (68 - 51.5) / 50);
      if (wsfu <= 200) return 68 + ((wsfu - 100) * (91 - 68) / 100);
      if (wsfu <= 500) return 91 + ((wsfu - 200) * (143 - 91) / 300);
      return 143 + ((wsfu - 500) * 0.15); // Approximation above 500
    } else {
      // Flush tank
      if (wsfu <= 1) return 3;
      if (wsfu <= 2) return 5;
      if (wsfu <= 5) return 5 + ((wsfu - 2) * (9.4 - 5) / 3);
      if (wsfu <= 10) return 9.4 + ((wsfu - 5) * (16 - 9.4) / 5);
      if (wsfu <= 20) return 16 + ((wsfu - 10) * (25 - 16) / 10);
      if (wsfu <= 30) return 25 + ((wsfu - 20) * (33.3 - 25) / 10);
      if (wsfu <= 40) return 33.3 + ((wsfu - 30) * (40 - 33.3) / 10);
      if (wsfu <= 50) return 40 + ((wsfu - 40) * (46 - 40) / 10);
      if (wsfu <= 100) return 46 + ((wsfu - 50) * (68 - 46) / 50);
      if (wsfu <= 200) return 68 + ((wsfu - 100) * (91 - 68) / 100);
      if (wsfu <= 500) return 91 + ((wsfu - 200) * (143 - 91) / 300);
      return 143 + ((wsfu - 500) * 0.15); // Approximation above 500
    }
  };"""

if search_str2 in content:
    content = content.replace(search_str2, replacement_str2)
    with open('src/components/PlumbingCalc.tsx', 'w') as f:
        f.write(content)
    print("Patched getHuntersFlowGPM successfully")
else:
    print("getHuntersFlowGPM string not found")

