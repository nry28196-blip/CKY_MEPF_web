# Ventilation Engineering Methodology

## 1. Overview
The application's ventilation engine implements the **Ventilation Rate Procedure (VRP)** to calculate both single-zone and multi-zone outdoor air requirements. The computational pipeline ensures strict adherence to established mechanical engineering standards, adapting dynamically based on architectural topography, equipment types, and psychrometric constraints.

## 2. Supported Engineering Standards
The calculation engine dynamically references the following jurisdictional standards to ensure compliance:
*   **ASHRAE 62.1** (Editions: 2019, 2022, 2025): Ventilation for Acceptable Indoor Air Quality (Commercial, Institutional, and High-Rise Residential Buildings).
*   **ASHRAE 62.2** (Editions: 2019, 2022, 2025): Ventilation and Acceptable Indoor Air Quality in Residential Buildings.
*   **ASHRAE 154 / IMC**: Commercial Kitchen Ventilation requirements.

Both standard (Imperial) and metric (SI) unit systems are fully natively supported for normative tables (Space Types, $R_p$, $R_a$, Default Occupancy Density) and formulas.

## 3. Density Correction & Psychrometrics
To account for varying air densities across different site elevations and temperatures, the application implements the **Ideal Gas Law** to derive the local moist air density.

### Density Computation
1.  **Atmospheric Pressure ($P$)** is calculated using the Barometric formula:
    $$P = P_0 \cdot \left(1 - \frac{L \cdot h}{T_0}\right)^{\frac{g \cdot M}{R_0 \cdot L}}$$
2.  **Saturation Vapor Pressure ($P_{sat}$)** is calculated using the Tetens equation.
3.  **Moist Air Density ($\rho_{actual}$)** is calculated assuming a mixture of dry air and water vapor (derived from relative humidity inputs):
    $$\rho = \frac{P_d}{R_d \cdot T} + \frac{P_v}{R_v \cdot T}$$
4.  **Density Ratio**: The ratio of the actual density to standard air density (defined at 101.325 kPa and 21.11°C / 70°F).

Calculated theoretical outdoor airflows are converted to **actual volumetric airflow ($Q_{actual}$)** at the intake elevation:
$$Q_{actual} = \frac{Q_{standard}}{\text{Density Ratio}}$$

## 4. Multi-Zone Calculation Methodology (VRP)
The engine strictly executes the VRP multi-zone equations per the normative procedures.

### Zone-Level Computations
For each individual zone $z$:
*   **Breathing Zone Outdoor Air ($V_{bz}$)**: 
    $$V_{bz} = (R_p \times P_z) + (R_a \times A_z) \quad \text{[Eq 6.2.2.1]}$$
*   **Zone Outdoor Air ($V_{oz}$)**: 
    $$V_{oz} = \frac{V_{bz}}{E_z} \quad \text{[Eq 6.2.2.3]}$$
    Where $E_z$ is the Zone Air Distribution Effectiveness from Table 6.2.2.2.

### System-Level Computations
For multi-zone Variable Air Volume (VAV) or Constant Volume (CV) architectures:
1.  **Occupant Diversity Ratio ($D$)**:
    $$D = \frac{P_s}{\sum P_z}$$
    *Assumption:* If Peak System Population ($P_s$) is not explicitly provided by the engineer, it defaults to the sum of peak zone populations ($\sum P_z$), yielding $D = 1.0$.
2.  **Uncorrected Outdoor Air ($V_{ou}$)**:
    $$V_{ou} = D \times \sum(R_p \times P_z) + \sum(R_a \times A_z) \quad \text{[Eq 6.2.5.3]}$$
3.  **System Primary Airflow ($V_{ps}$)**:
    *Assumption:* Assumed to be the sum of the minimum expected primary airflows to all zones ($\sum V_{pz-min}$). If $V_{pz-min}$ is omitted by the user, the engine conservatively derives it as $\max(0.3 \times V_{pz}, V_{oz})$ to guarantee system compliance for VAV operation.
4.  **System Primary Fraction ($X_s$)**:
    $$X_s = \frac{V_{ou}}{V_{ps}}$$
5.  **System Ventilation Efficiency ($E_v$)**:
    The backend computes the exact $E_{vz}$ for each zone using Normative Appendix A principles:
    $$E_{vz} = \frac{F_a + X_s \cdot F_b - Z_{pz} \cdot E_p \cdot F_c}{F_a}$$
    The system efficiency ($E_v$) is identified as the minimum $E_{vz}$ across all zones.
6.  **Required System Outdoor Air Intake ($V_{ot}$)**:
    $$V_{ot} = \frac{V_{ou}}{E_v} \quad \text{[Eq 6.2.5.1]}$$

## 5. Engineering Assumptions & Safeguards
*   **Critical Zone Fallbacks:** If a zone's primary airflow $V_{pz-min}$ is extremely low relative to its fresh air requirement $V_{oz}$, the Zone Outdoor Air Fraction ($Z_{pz}$) approaches infinity. The system safeguards against division by zero by clamping efficiency metrics to a minimum theoretical floor ($E_v \ge 0.1$) to highlight system non-compliance without crashing calculations.
*   **Ev Upper Bounds:** System Ventilation Efficiency ($E_v$) is mathematically capped at $1.0$ (100% efficient).
*   **Double-Correction Prevention**: Altitude/density correction factors are applied precisely at the final system intake calculation ($V_{ot\_actual}$) to prevent cascading errors across sub-zone logic.
