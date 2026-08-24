const IPC_FIXTURES = [
  { id: 'wc_pub_fv', name: 'Water Closet (Public) - Flushometer (1.6 GPF)', wsfu: 10, dfu: 4, lu: 2.0, du: 2.0, isFlushometer: true },
  { id: 'wc_pub_ft', name: 'Water Closet (Public) - Flush Tank', wsfu: 5, dfu: 4, lu: 2.0, du: 2.0 },
  { id: 'wc_priv_fv', name: 'Water Closet (Private) - Flushometer', wsfu: 6, dfu: 4, lu: 2.0, du: 2.0, isFlushometer: true },
  { id: 'wc_priv_ft', name: 'Water Closet (Private) - Flush Tank', wsfu: 2.2, dfu: 3, lu: 2.0, du: 2.0 },
  { id: 'lav_pub', name: 'Lavatory (Public) - Faucet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5 },
  { id: 'lav_priv', name: 'Lavatory (Private) - Faucet', wsfu: 0.7, dfu: 1, lu: 1.0, du: 0.5 },
  { id: 'shower_pub', name: 'Shower (Public) - Mixing Valve', wsfu: 4.0, dfu: 2, lu: 2.0, du: 0.6 },
  { id: 'shower_priv', name: 'Shower (Private) - Mixing Valve', wsfu: 1.4, dfu: 2, lu: 2.0, du: 0.6 },
  { id: 'sink_pub', name: 'Service Sink (Public) - Faucet', wsfu: 3.0, dfu: 2, lu: 3.0, du: 0.8 },
  { id: 'sink_priv', name: 'Kitchen Sink (Private) - Faucet', wsfu: 1.4, dfu: 2, lu: 3.0, du: 0.8 },
  { id: 'urinal_pub_fv', name: 'Urinal (Public) - 1" Flushometer', wsfu: 10, dfu: 4, lu: 1.5, du: 0.5, isFlushometer: true },
  { id: 'drink_fount', name: 'Drinking Fountain (Public/Private)', wsfu: 0.25, dfu: 0.5, lu: 0.1, du: 0.1 },
  { id: 'bathtub', name: 'Bathtub', wsfu: 1.4, dfu: 2, lu: 1.0, du: 0.8 },
  { id: 'bidet', name: 'Bidet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5 },
  { id: 'dishwasher_dom', name: 'Dishwasher (Domestic)', wsfu: 1.4, dfu: 2, lu: 1.5, du: 0.8 },
  { id: 'washing_mach', name: 'Washing Machine (8 lb)', wsfu: 1.4, dfu: 2, lu: 1.5, du: 0.8 }
];

const getFixtureById = (id) => IPC_FIXTURES.find(f => f.id === id);

const fixtures = [
  { ...getFixtureById('wc_pub_fv'), qty: 10, baseName: 'Water Closet - Flushometer (1.6 GPF)', usageType: 'public', options: { public: 'wc_pub_fv', private: 'wc_priv_fv' } },
  { ...getFixtureById('wc_pub_ft'), qty: 0, baseName: 'Water Closet - Flush Tank', usageType: 'public', options: { public: 'wc_pub_ft', private: 'wc_priv_ft' } },
  { ...getFixtureById('lav_pub'), qty: 12, baseName: 'Lavatory - Faucet', usageType: 'public', options: { public: 'lav_pub', private: 'lav_priv' } },
  { ...getFixtureById('shower_pub'), qty: 8, baseName: 'Shower - Mixing Valve', usageType: 'public', options: { public: 'shower_pub', private: 'shower_priv' } },
  { ...getFixtureById('sink_priv'), qty: 4, baseName: 'Sink - Faucet', usageType: 'private', options: { public: 'sink_pub', private: 'sink_priv' } },
  { ...getFixtureById('urinal_pub_fv'), qty: 4, baseName: 'Urinal - 1" Flushometer', usageType: 'public', options: { public: 'urinal_pub_fv' } },
  { ...getFixtureById('drink_fount'), qty: 0, baseName: 'Drinking Fountain', usageType: 'na', options: { na: 'drink_fount' } },
  { ...getFixtureById('bathtub'), qty: 0, baseName: 'Bathtub', usageType: 'private', options: { private: 'bathtub' } },
  { ...getFixtureById('bidet'), qty: 0, baseName: 'Bidet', usageType: 'private', options: { private: 'bidet' } },
  { ...getFixtureById('dishwasher_dom'), qty: 0, baseName: 'Dishwasher (Domestic)', usageType: 'private', options: { private: 'dishwasher_dom' } },
  { ...getFixtureById('washing_mach'), qty: 0, baseName: 'Washing Machine (8 lb)', usageType: 'private', options: { private: 'washing_mach' } },
];

// simulate turning off all flushometers and using flush tanks
const appliedFixtures = fixtures.map(f => {
  if (f.id === 'wc_pub_fv') return { ...f, qty: 0 };
  if (f.id === 'urinal_pub_fv') return { ...f, qty: 0 };
  if (f.id === 'wc_pub_ft') return { ...f, qty: 10 };
  return f;
});

const determineSystemType = (fxs) => {
  const valveWSFU = fxs.filter(f => f.id.includes('_fv')).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
  const tankWSFU = fxs.filter(f => !f.id.includes('_fv')).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
  console.log({valveWSFU, tankWSFU});
  return valveWSFU > tankWSFU ? 'valve' : 'tank';
};

const sys = determineSystemType(appliedFixtures);
console.log("systemType", sys);

