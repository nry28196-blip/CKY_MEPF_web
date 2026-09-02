# Validation Matrix

| Requirement | Implemented? | Tested? | Standard | Edition | Reference | Limitations |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Zone Vbz Calculation** (Rp*Pz + Ra*Az) | YES | YES | ASHRAE 62.1 | 2025 | Sec 6.2.2.1 | None |
| **Zone Voz Calculation** (Vbz/Ez) | YES | YES | ASHRAE 62.1 | 2025 | Sec 6.2.2.3 | Ez must be supplied by user |
| **System Vot (Multi-zone)** | YES | YES | ASHRAE 62.1 | 2025 | Sec 6.2.5 | Vpz-min handled explicitly |
| **System Population Diversity** | YES | YES | ASHRAE 62.1 | 2025 | Sec 6.2.5.1 | Auto-defaults to ΣPz if not provided |
| **Air Density Correction** | YES | YES | ASHRAE 62.1 | 2025 | Sec 6.2.7 | E_rho ratio based on temp/alt |
| **Air Balance Net Flow** | YES | YES | ASHRAE 62.1 | 2025 | App B | ACH reporting provided |
| **Fan Duty & Affinity Laws** | YES | YES | Engineering | N/A | Fundamentals | Assumes RPM^2.5 exponent for VFD |
| **Whole-Dwelling (62.2)** | YES | YES | ASHRAE 62.2 | 2025 | Sec 4.1.1 | Eq. 4.1.1 exact implementation |
| **Kitchen Hood (62.2)** | YES | YES | ASHRAE 62.2 | 2025 | Sec 5 | Covers continuous & intermittent |
| **Local Exhaust (62.1)** | YES | YES | ASHRAE 62.1 | 2025 | Table 6.5 | Basic coverage |
