const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('src/data/ashrae62_1_2025.json', 'utf8'));

const structuredData = {
  metadata: {
    standard: "ASHRAE 62.1",
    edition: "2025",
    description: "ASHRAE 62.1-2025 Ventilation for Acceptable Indoor Air Quality Database",
    versionSegregation: "strict",
    legacyCompatibility: false
  },
  coefficients: {
    ventilationSpaceTypes: rawData.spaces,
    airDistribution: rawData.airDistribution
  },
  airQualityStandards: {
    // Adding stubs for air quality/filtration/exhaust for a complete 2025 representation
    filtrationRequirements: {
      minimumMERV: 8,
      pm25DesignThreshold: 12.0,
      ozoneNonattainmentRequired: true
    },
    exhaustClasses: [
      { class: 1, recirculationAllowed: true, description: "Low contaminant concentration" },
      { class: 2, recirculationAllowed: "limited", description: "Moderate contaminant concentration" },
      { class: 3, recirculationAllowed: false, description: "Significant contaminant concentration" },
      { class: 4, recirculationAllowed: false, description: "Highly objectionable/harmful" }
    ]
  }
};

fs.writeFileSync('src/data/ashrae62_1_2025.json', JSON.stringify(structuredData, null, 2));

console.log("Structured JSON saved to src/data/ashrae62_1_2025.json");
