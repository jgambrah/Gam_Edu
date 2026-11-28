# Independent scientific verification — checkpoint 2

Extends `docs/audit/2026-11-28/SCIENTIFIC_ACCURACY_VERIFICATION.md` (preserved). Oracles are independent of the code under test.

| Area | Evidence | Result |
|---|---|---|
| Electron configurations Z=1–30 | Madelung/Aufbau generator with the Cr and Cu exceptions | All 30 neutral configurations match; electron count equals Z |
| Ions | 15 hand-listed configurations: Na⁺, Mg²⁺, Al³⁺, Ca²⁺, **Fe²⁺ (4s lost first)**, Fe³⁺, Cu⁺, Cu²⁺, **Cr³⁺**, Zn²⁺, Ti⁴⁺, Cl⁻, O²⁻, N³⁻, H⁻ | All match; unsupported charges (Na²⁺, O²⁺, unknown element) return null rather than inventing a configuration |
| Electronegativities | 20 published Pauling values | Match |
| Formula parsing | Ca(OH)₂, Al₂(SO₄)₃, (NH₄)₂SO₄; 8 malformed inputs | Correct counts; all malformed inputs rejected |
| Equation balance | 7 balanced equations incl. charge cases (Fe³⁺ + 3e⁻ → Fe, Zn + 2Ag⁺ → Zn²⁺ + 2Ag); independent atom/charge bookkeeping; single-coefficient error detection; doubled equation balanced but **not simplest ratio**; atoms balanced but charge unbalanced | All agree with the oracle |
| Genetic code | 64 codons, 61 sense + 3 stop, published degeneracy (Leu/Ser/Arg 6; Ala/Gly/Pro/Thr/Val 4; Ile 3; 9 amino acids with 2; Met/Trp 1) | Exact match |
| Transcription / translation | Complement and template→mRNA with U; translation stops at the first stop codon and assigns nothing at/after it; trailing partial codon ignored | Correct |
| Punnett squares | Aa×Aa = 25/50/25 (75 % dominant); AA×aa = 100 % Aa; test cross Aa×aa = 50/50 | Correct |
| DC circuits | Series 6 V / (2+4 Ω): R=6, I=1 A, V₂=4 V, KVL residual ≈ 0; parallel 6 Ω ‖ 3 Ω: 1 A + 2 A = 3 A, Req = 2 Ω, KCL residual ≈ 0; open switch → open circuit; closed loop with no resistance → **short circuit with no finite/infinite current reported**; voltmeter in series → misconnection and no current; component swap changes the answer consistently | Correct |

**No scientific defects found** in these models. 54 new tests (`chemistry-biology-independent.test.ts` 42 + `dc-circuit-independent.test.ts` 6 + earlier 16 stats/5 cube-net).

## Not yet verified (carried forward)
- Ionic/covalent bonding, formal charge, dative bonds, VSEPR geometry and polarity (existing tests only), electrolysis and reaction-mechanism stepper content, process-stepper biology activities.
- Measuring instruments (all nine): model code was read at checkpoint 1; **rendered** vernier coincidence, micrometer sleeve/thimble, meniscus, parallax and tare geometry still need browser inspection (D-030).
- Visual circuit diagram vs physical model agreement (needs the browser).
- Simplified-model labelling inside lesson text (lesson content not reviewed).
