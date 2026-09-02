# Ventilation Engineering Methodology

## 1. Overview
The application's ventilation engine executes calculations to determine outdoor air requirements for commercial and residential buildings. The computational pipeline ensures strict adherence to established mechanical engineering standards, adapting dynamically based on architectural topography, equipment types, and psychrometric constraints.

## 2. Supported ASHRAE Calculation Methods
The engine supports multiple distinct calculation pathways depending on the system architecture, in accordance with **ASHRAE 62.1** and **ASHRAE 62.2**.

### A. Single-Zone Systems
For systems supplying a single temperature control zone, the uncorrected outdoor air ($V_{ou}$) is calculated directly from the breathing zone requirements ($V_{bz}$). The zone ventilation efficiency ($E_z$) dictates the final Zone Outdoor Air ($V_{oz}$).
*   Formula: $V_{oz} = \frac{V_{bz}}{E_z}$

### B. 100% Outdoor Air Systems
Dedicated Outdoor Air Systems (DOAS) providing 100% fresh air directly to zones bypass recirculation efficiency penalties.
*   The system ventilation efficiency ($E_v$) is evaluated mathematically as $1.0$.
*   Required system outdoor air ($V_{ot}$) equals the sum of all zone outdoor air requirements ($\sum V_{oz}$).

### C. Multiple-Zone Recirculating Systems (VRP)
Executes the full **Ventilation Rate Procedure (VRP)** for VAV and CV systems.
1.  **Occupant Diversity Ratio ($D$)**: Applies population diversity across the system ($D = P_s / \sum P_z$).
2.  **Uncorrected Outdoor Air ($V_{ou}$)**: Derives the system baseline without efficiency penalties.
3.  **System Ventilation Efficiency ($E_v$)**: The exact efficiency $E_{vz}$ is computed for each zone using Normative Appendix A principles (evaluating the primary fraction $X_s$ and maximum zone fraction $Z_{pz}$). The minimum $E_{vz}$ across all zones defines the overall $E_v$.
4.  **System Outdoor Air ($V_{ot}$)**: $V_{ot} = V_{ou} / E_v$

## 3. Density Conversion Logic & Psychrometrics
To account for varying air densities across different site elevations and temperatures, the application implements the **Ideal Gas Law** to derive local moist air density.

1.  **Atmospheric Pressure ($P$)**: Calculated using the standard Barometric formula based on site elevation ($h$).
2.  **Moist Air Density ($\rho_{actual}$)**: Calculated assuming a mixture of dry air and water vapor based on design temperatures.
3.  **Density Ratio ($E_{\rho}$)**: The ratio of the actual site density to standard air density (101.325 kPa at 21.11°C / 70°F).

### Volumetric Airflow Conversion
All normative ASHRAE tables define fresh air rates at standard conditions ($Q_{standard}$). The engine dynamically converts these targets to **actual volumetric airflow ($Q_{actual}$)** at the intake elevation:
$$Q_{actual} = \frac{Q_{standard}}{E_{\rho}}$$
*Double-Correction Prevention*: The engine ensures that density conversions are only applied at the final system intake ($V_{ot\_actual}$) and never cascades prematurely through component sub-zone calculations.

## 4. Primary Engineering Assumptions & Safeguards
When specific variables are omitted by the user, the calculation engine applies the following conservative engineering assumptions to maintain compliance:

*   **Peak System Population ($P_s$)**: If omitted, $P_s$ defaults to the sum of the individual peak zone populations ($\sum P_z$). This forces the Diversity Ratio ($D$) to $1.0$.
*   **System Primary Airflow ($V_{ps}$)**: If omitted, the engine assumes $V_{ps}$ equals the sum of the minimum expected primary airflows to all zones ($\sum V_{pz-min}$).
*   **Zone Minimum Primary Airflow ($V_{pz-min}$)**: If omitted in a VAV multi-zone setup, the engine conservatively derives it as $\max(0.3 \times V_{pz}, V_{oz})$ to guarantee system compliance for minimum VAV damper positions.
*   **Mathematical Clamping**: To prevent calculation crashes (e.g., division by zero if $V_{pz-min} = 0$), System Ventilation Efficiency ($E_v$) is constrained to a minimum theoretical floor of $0.1$. It is mathematically capped at $1.0$ (100% efficient).
