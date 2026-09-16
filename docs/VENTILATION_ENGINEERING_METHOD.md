# Ventilation Engineering Methodology

## 1. Overview
The application's ventilation engine executes calculations to determine outdoor air requirements for commercial and residential buildings. The computational pipeline ensures strict adherence to established mechanical engineering standards, adapting dynamically based on architectural topography, equipment types, and psychrometric constraints.

## 2. Supported ASHRAE Calculation Methods
The engine supports multiple distinct calculation pathways depending on the system architecture, in accordance with **ASHRAE 62.1** and **ASHRAE 62.2**.

### A. Single-Zone Systems
For systems supplying a single temperature control zone, the Zone Outdoor Air ($V_{oz}$) is calculated from the breathing zone requirements ($V_{bz}$) and the zone ventilation efficiency ($E_z$).
*   Formula: $V_{oz} = \frac{V_{bz}}{E_z} \times E_{\rho}$

### B. 100% Outdoor Air Systems
Dedicated Outdoor Air Systems (DOAS) providing 100% fresh air directly to zones bypass recirculation efficiency penalties.
*   The system ventilation efficiency ($E_v$) is evaluated mathematically as $1.0$.
*   Required system outdoor air ($V_{ot}$) equals the sum of all zone outdoor air requirements ($\sum V_{oz}$).

### C. Multiple-Zone Recirculating Systems (VRP)
Executes the full **Ventilation Rate Procedure (VRP)** for VAV and CV systems.
1.  **Occupant Diversity Ratio ($D$)**: Applies population diversity across the system ($D = P_s / \sum P_z$).
2.  **Uncorrected Outdoor Air ($V_{ou}$)**: Derives the system baseline without efficiency penalties. $V_{ou} = D \sum (R_p \times P_z) + \sum (R_a \times A_z)$. Note: The density factor $E_{\rho}$ is strictly **NOT** applied to $V_{ou}$ in multiple-zone simplified and alternative procedures as it leads to a double-correction.
3.  **System Ventilation Efficiency ($E_v$)**: The exact efficiency $E_{vz}$ is computed for each zone using Normative Appendix A principles (evaluating the primary fraction $X_s$ and maximum zone fraction $Z_{pz}$). The minimum $E_{vz}$ across all zones defines the overall $E_v$.
4.  **System Outdoor Air ($V_{ot}$)**: $V_{ot} = V_{ou} / E_v$. (Note: $E_{\rho}$ is omitted here because it is applied when deriving the individual $V_{oz}$ parameters for components, adhering to Addendum j).

## 3. Density Conversion Logic & Psychrometrics
To account for varying air densities across different site elevations and temperatures, the application implements the **ASHRAE 62.1 Addendum j** rules to derive local air density factor $E_{\rho}$.
1.  **Standard Conditions**: $1.2$ kg/m³ at $21$°C and $101.3$ kPa.
2.  **Table 6-5 Method**: Defaults to elevation bands (e.g., <= 158m = 1.00; <= 566m = 1.05) up to 3437m.
3.  **Analytical Method (Normative Appendix D)**: If elevation > 3437m or if selected explicitly, $E_{\rho}$ is calculated via the lowest coincident design-condition density.
4.  **Density Factor ($E_{\rho}$)**: Applied at the $V_{oz}$ level ($V_{oz} = \frac{V_{bz}}{E_z} \times E_{\rho}$) and nowhere else, ensuring a single true density propagation path. 

### Double-Correction Prevention
The engine ensures that density conversions ($E_{\rho}$) are only applied directly at the Zone Outdoor Air ($V_{oz}$) derivation layer (Equation 6-2) and are strictly omitted from multiplying $V_{ou}$ within the Simplified or Alternative Multi-Zone Procedures. 

## 4. Primary Engineering Assumptions & Safeguards
When specific variables are omitted by the user, the calculation engine applies the following conservative engineering assumptions to maintain compliance:
*   **Peak System Population ($P_s$)**: If omitted, $P_s$ defaults to the sum of the individual peak zone populations ($\sum P_z$). This forces the Diversity Ratio ($D$) to $1.0$.
*   **System Primary Airflow ($V_{ps}$)**: If omitted, the engine assumes $V_{ps}$ equals the sum of the minimum expected primary airflows to all zones ($\sum V_{pz-min}$).
*   **Zone Minimum Primary Airflow ($V_{pz-min}$)**: If omitted in a VAV multi-zone setup, the engine conservatively derives it as $\max(0.3 \times V_{pz}, V_{oz})$ to guarantee system compliance for minimum VAV damper positions.
*   **Mathematical Clamping**: To prevent calculation crashes (e.g., division by zero if $V_{pz-min} = 0$), System Ventilation Efficiency ($E_v$) is constrained to a minimum theoretical floor of $0.1$. It is mathematically capped at $1.0$ (100% efficient).
