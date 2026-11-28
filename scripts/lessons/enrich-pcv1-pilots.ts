/**
 * GAM EDU — PCV-1 Enriched Pilot Lesson Builder & Strict Production-Compatibility Validator
 *
 * Loads the EXACT live CDN original JSONs for:
 *   A. cambridge-as-a-level-chemistry-hydrocarbons (original hash: 739c1252e89e, 71 slides)
 *   B. b8-sci-t1-atoms-and-the-periodic-table      (original hash: 15080192a16a, 26 slides)
 *
 * Adds ONLY strictly production-compatible (`allowDevOnlyEngines: false`), scientifically
 * verified `slide.interactive` blocks, proves 100% preservation of all existing narration,
 * audio, visuals, cues, checkpoints, mastery checks, and metadata, and writes enriched JSONs.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  assertValidLessonInteractives,
  type SlideInteractiveConfig,
} from '../../src/lib/narrated-lessons/interactive-schema';
import { assertSafeSvg } from '../../src/lib/narrated-lessons/svg-sanitizer';
import type { NarratedLesson } from '../../src/lib/narrated-lessons/types';

const WORK_DIR = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/pcv1-impl';

/* ========================================================================== */
/* PILOT A: CAMBRIDGE AS & A-LEVEL CHEMISTRY — HYDROCARBONS                   */
/* ========================================================================== */

const HYDROCARBONS_ENRICHMENTS: Record<string, SlideInteractiveConfig[]> = {
  a02: [
    {
      id: 'hc-a02-homologous-series',
      engine: 'graph-slider',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      title: 'Alkane Homologous Series Explorer (CnH2n+2)',
      instructions:
        'Vary the integer carbon count n from 1 (methane) to 10 (decane) and observe how adding each successive –CH₂– unit increases hydrogen atoms by 2 and relative molecular mass Mr by 14.',
      accessibilityLabel: 'Interactive alkane homologous series explorer for integer carbon counts 1 to 10',
      fallbackText:
        'Open-chain alkanes follow CnH2n+2 (H = 2n + 2, Mr = 14n + 2). Each successive member differs by one CH2 unit (ΔH = +2, ΔMr = +14).',
      subjectTag: 'A-Level Chemistry · Homologous Series',
      xVar: 'x',
      axes: { xMin: 1, xMax: 10, yMin: 0, yMax: 24, xLabel: 'Carbon count (n)', yLabel: 'Hydrogen atoms (2n + 2)' },
      sliders: [
        { id: 'n', label: 'Carbon count n (integer)', min: 1, max: 10, step: 1, defaultValue: 1, presets: [1, 4, 8] },
      ],
      curves: [
        { id: 'h-count', label: 'H = 2x + 2 (open-chain alkanes)', expr: '2 * x + 2', color: '#0369a1' },
      ],
      readouts: [
        { id: 'r-h', label: 'Hydrogen atoms (2n + 2)', expr: '2 * n + 2' },
        { id: 'r-mr', label: 'Relative molecular mass Mr (dimensionless)', expr: '14 * n + 2' },
        { id: 'r-mm', label: 'Molar mass M (14n + 2)', expr: '14 * n + 2', unit: 'g mol⁻¹' },
      ],
      prediction: {
        prompt: 'Moving from butane (C₄H₁₀) to pentane (C₅H₁₂) adds one –CH₂– group. How much does Mr increase?',
        options: ['+12', '+14', '+16'],
        correctIndex: 1,
        explanation: 'One C atom (12.0) + two H atoms (2 × 1.0) increases Mr by exactly +14.0 per successive homologous member.',
      },
      challenges: [
        {
          id: 'ch-octane',
          prompt: 'Set carbon count n to octane (8 carbons) to verify its hydrogen count (18) and Mr (114).',
          check: { operator: 'AND', conditions: [{ sliderId: 'n', target: 8, tolerance: 0.01 }] },
          successText: 'Verified! Octane (C₈H₁₈) has 2(8) + 2 = 18 H atoms and Mr = 114.',
        },
      ],
      hints: ['Each CH₂ unit adds 1 carbon and 2 hydrogens.', 'For n = 8, 2n + 2 = 18.'],
    },
  ],
  a06: [
    {
      id: 'hc-a06-methane-vsepr',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'molecular-geometry',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'A-Level Chemistry · Molecular Geometry',
      title: 'Methane (CH₄) — Tetrahedral VSEPR Geometry',
      instructions:
        'Select the bonding domains, lone pairs, electron geometry, molecular shape, and bond angle around the central carbon atom in methane (CH₄).',
      accessibilityLabel: 'Methane CH4 tetrahedral geometry explorer',
      fallbackText: 'Methane (CH4) has 4 bonding domains, 0 lone pairs, tetrahedral geometry, 109.5° bond angles, and is nonpolar.',
      modelNote:
        'Note: A flat 2D screen drawing is a simplified projection of a 3D tetrahedral molecule whose four C–H bonds point to the corners of a regular tetrahedron at 109.5°.',
      moleculeFormula: 'CH₄',
      centralElement: 'C',
      surroundingElements: ['H', 'H', 'H', 'H'],
      targetBondingDomains: 4,
      targetLonePairs: 0,
      targetElectronGeometry: 'tetrahedral',
      targetMolecularShape: 'tetrahedral',
      targetBondAngleLabel: '109.5°',
      checkPolarity: true,
      expectedPolar: false,
      prediction: {
        prompt: 'Why is the H–C–H bond angle in methane 109.5° rather than 90°?',
        options: [
          'Four electron pairs repel equally in 3D space to maximise separation',
          'Hydrogen atoms attract one another in a flat square',
          'Carbon forms two double bonds',
        ],
        correctIndex: 0,
        explanation: 'Four equal bonding pairs around carbon arrange in 3D at the corners of a regular tetrahedron (109.5°).',
      },
      hints: ['Carbon has 4 valence electrons and forms 4 single C–H bonds (0 lone pairs).', 'Symmetrical tetrahedral CH₄ has zero net dipole moment (nonpolar).'],
      successExplanation: 'All four C–H bonding pairs repel equally in 3D space, giving tetrahedral geometry (109.5°) and symmetrical nonpolarity.',
    },
  ],
  b01: [
    {
      id: 'hc-b01-boiling-points',
      engine: 'graph-slider',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      title: 'Normal Boiling Points of Straight-Chain Alkanes (C₁ to C₈)',
      instructions:
        'Inspect the verified experimental normal boiling points of methane (n = 1) through octane (n = 8). Use the integer carbon-count slider to explore how boiling point rises with chain length.',
      accessibilityLabel: 'Discrete experimental normal boiling point graph for straight-chain alkanes C1 to C8',
      fallbackText:
        'Experimental normal boiling points (°C): C1 -161.5, C2 -88.6, C3 -42.1, C4 -0.5, C5 36.1, C6 68.7, C7 98.4, C8 125.6. Larger chains have more electrons and stronger London dispersion forces.',
      subjectTag: 'A-Level Chemistry · Intermolecular Forces',
      xVar: 'x',
      axes: { xMin: 1, xMax: 8, yMin: -180, yMax: 150, xLabel: 'Carbon count n (integer molecules only)', yLabel: 'Normal boiling point (°C)' },
      sliders: [
        { id: 'n', label: 'Alkane carbon count (n = 1..8)', min: 1, max: 8, step: 1, defaultValue: 1, presets: [1, 4, 5, 8] },
      ],
      curves: [
        {
          id: 'alkane-bp',
          label: 'Experimental normal bp (°C, discrete C₁–C₈)',
          kind: 'piecewise',
          points: [
            { x: 1, y: -161.5 },
            { x: 2, y: -88.6 },
            { x: 3, y: -42.1 },
            { x: 4, y: -0.5 },
            { x: 5, y: 36.1 },
            { x: 6, y: 68.7 },
            { x: 7, y: 98.4 },
            { x: 8, y: 125.6 },
          ],
          color: '#0369a1',
        },
        { id: 'room-temp', label: 'Room temperature (~25 °C)', expr: '25', color: '#b45309', style: 'dashed', isReference: true },
      ],
      prediction: {
        prompt: 'Which is the smallest straight-chain alkane that is liquid at room temperature (25 °C)?',
        options: ['Butane (C₄H₁₀, bp −0.5 °C)', 'Pentane (C₅H₁₂, bp 36.1 °C)', 'Octane (C₈H₁₈, bp 125.6 °C)'],
        correctIndex: 1,
        explanation: 'Butane boils at −0.5 °C (gas at 25 °C), whereas pentane boils at 36.1 °C and is the first liquid straight-chain alkane at 25 °C.',
      },
      challenges: [
        {
          id: 'ch-first-liquid',
          prompt: 'Move the integer carbon slider to the first straight-chain alkane that is liquid at 25 °C.',
          check: { operator: 'AND', conditions: [{ sliderId: 'n', target: 5, tolerance: 0.01 }] },
          successText: 'Correct! Pentane (n = 5, bp 36.1 °C) is liquid at 25 °C due to stronger instantaneous dipole–induced dipole (London dispersion) forces.',
        },
      ],
      hints: ['Only integer carbon counts represent physical alkane molecules.', 'Find the first integer n whose boiling point lies above the dashed 25 °C line.'],
    },
  ],
  b04: [
    {
      id: 'hc-b04-fractional-distillation',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Crude Oil Refining',
      title: 'Fractional Distillation Column — Temperature Gradient & Mixtures',
      instructions:
        'Step up the fractionating column from the hot furnace (~350 °C) to the cool top (~25 °C). Notice that every fraction collected is a MIXTURE of hydrocarbons with similar boiling ranges, not a single pure compound.',
      accessibilityLabel: 'Fractional distillation column linear process stepper',
      fallbackText:
        'Crude oil vapour rises up a temperature gradient (hot at bottom, cool at top). Longer-chain mixtures condense near the bottom (bitumen, fuel oil, diesel); shorter-chain mixtures rise higher (kerosene, naphtha, petrol, refinery gas).',
      stages: [
        {
          id: 'fd-1',
          title: '1. Furnace & Bottom Residue (Bitumen, >350 °C)',
          summary: 'Crude oil is heated to ~350 °C. Very long chains (>C₃₅) have strong London dispersion forces, never vaporise, and drain off as a viscous bitumen mixture.',
          stateSnapshot: [
            { id: 'tempC', label: 'Temperature', value: '>350 °C' },
            { id: 'chain', label: 'Chain Length', value: '>C₃₅' },
            { id: 'purity', label: 'Composition', value: 'Mixture (not pure)' },
          ],
          prediction: {
            prompt: 'Does each outlet pipe of a fractionating column produce one chemically pure alkane?',
            options: [
              'No — each fraction is still a mixture of hydrocarbons with similar boiling points',
              'Yes — each pipe isolates one pure alkane isomer',
            ],
            correctIndex: 0,
            explanation: 'Industrial fractional distillation separates crude oil into boiling-range mixtures (fractions), never single pure compounds.',
          },
        },
        {
          id: 'fd-2',
          title: '2. Lower Column (Fuel Oil & Diesel, ~250–350 °C)',
          summary: 'Long-chain vapours condense on lower bubble-cap trays where the temperature drops below their high boiling range.',
          stateSnapshot: [
            { id: 'tempC', label: 'Temperature', value: '250–350 °C' },
            { id: 'chain', label: 'Chain Length', value: 'C₁₅–C₃₀' },
            { id: 'purity', label: 'Composition', value: 'Mixture (not pure)' },
          ],
        },
        {
          id: 'fd-3',
          title: '3. Middle Column (Kerosene & Naphtha, ~100–250 °C)',
          summary: 'Medium-chain hydrocarbon mixtures continue rising until they reach cooler middle trays and condense.',
          stateSnapshot: [
            { id: 'tempC', label: 'Temperature', value: '100–250 °C' },
            { id: 'chain', label: 'Chain Length', value: 'C₈–C₁₆' },
            { id: 'purity', label: 'Composition', value: 'Mixture (not pure)' },
          ],
        },
        {
          id: 'fd-4',
          title: '4. Top of Column (Petrol/Gasoline & Refinery Gas, <100 °C)',
          summary: 'Short chains have weak London forces and low boiling points. Petrol condenses near the top; C₁–C₄ refinery gases exit uncondensed.',
          stateSnapshot: [
            { id: 'tempC', label: 'Temperature', value: '<100 °C' },
            { id: 'chain', label: 'Chain Length', value: 'C₁–C₁₀' },
            { id: 'purity', label: 'Composition', value: 'Mixture (not pure)' },
          ],
        },
      ],
      hints: ['Boiling point increases with chain length.', 'Hotter at the bottom, cooler at the top.'],
    },
  ],
  c01: [
    {
      id: 'hc-c01-methane-combustion',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'A-Level Chemistry · Guided Stoichiometry',
      title: 'Guided Balance: Complete Combustion of Methane',
      instructions:
        'Balance the complete combustion of methane in excess oxygen using simplest whole-number coefficients.',
      accessibilityLabel: 'Chemical equation balancer for methane complete combustion',
      fallbackText: 'CH4 + 2O2 -> CO2 + 2H2O.',
      reactants: [{ formula: 'CH4', display: 'CH₄', state: 'g' }, { formula: 'O2', display: 'O₂', state: 'g' }],
      products: [{ formula: 'CO2', display: 'CO₂', state: 'g' }, { formula: 'H2O', display: 'H₂O', state: 'l' }],
      requireSimplestRatio: true,
      hints: ['Balance C first (1 CO₂), then H (2 H₂O), then count total O atoms on the right (4 O = 2 O₂).'],
      successExplanation: 'CH₄ + 2O₂ → CO₂ + 2H₂O conserves 1 C, 4 H, and 4 O atoms.',
    },
    {
      id: 'hc-c01-propane-combustion',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'A-Level Chemistry · Independent Practice',
      title: 'Independent Practice: Complete Combustion of Propane',
      instructions:
        'Now independently balance the complete combustion of propane (C₃H₈) in excess oxygen.',
      accessibilityLabel: 'Chemical equation balancer for propane complete combustion',
      fallbackText: 'C3H8 + 5O2 -> 3CO2 + 4H2O.',
      reactants: [{ formula: 'C3H8', display: 'C₃H₈', state: 'g' }, { formula: 'O2', display: 'O₂', state: 'g' }],
      products: [{ formula: 'CO2', display: 'CO₂', state: 'g' }, { formula: 'H2O', display: 'H₂O', state: 'l' }],
      requireSimplestRatio: true,
      hints: ['3 carbons give 3 CO₂; 8 hydrogens give 4 H₂O.', 'Right-hand oxygen atoms = 3×2 + 4×1 = 10, so you need 5 O₂.'],
      successExplanation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O (3 C, 8 H, 10 O conserved).',
    },
  ],
  c02: [
    {
      id: 'hc-c02-incomplete-combustion',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'A-Level Chemistry · Incomplete Combustion',
      title: 'Incomplete Combustion of Propane (Forming Carbon Soot)',
      instructions:
        'Balance one limiting-oxygen pathway where propane forms solid carbon (soot) and water.',
      accessibilityLabel: 'Chemical equation balancer for incomplete combustion of propane to carbon and water',
      fallbackText: 'C3H8 + 2O2 -> 3C + 4H2O.',
      modelNote:
        'In real oxygen-limited combustion, a mixture of CO, C (soot), and CO₂ is produced simultaneously rather than a single unique product.',
      reactants: [{ formula: 'C3H8', display: 'C₃H₈', state: 'g' }, { formula: 'O2', display: 'O₂', state: 'g' }],
      products: [{ formula: 'C', display: 'C', state: 's' }, { formula: 'H2O', display: 'H₂O', state: 'l' }],
      requireSimplestRatio: true,
      hints: ['3 C atoms give 3 C(s); 8 H atoms give 4 H₂O.', '4 H₂O requires only 2 O₂ (far less than the 5 O₂ needed for complete combustion).'],
      successExplanation: 'C₃H₈ + 2O₂ → 3C + 4H₂O shows why severe oxygen limitation produces black carbon soot.',
    },
  ],
  c04: [
    {
      id: 'hc-c04-catalytic-converter',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'A-Level Chemistry · Environmental Chemistry',
      title: 'Catalytic Converter Redox Equation',
      instructions:
        'Balance the surface-catalysed reaction converting toxic carbon monoxide (CO) and nitrogen monoxide (NO) into carbon dioxide and nitrogen gas.',
      accessibilityLabel: 'Chemical equation balancer for catalytic converter reaction 2CO + 2NO -> 2CO2 + N2',
      fallbackText: '2CO + 2NO -> 2CO2 + N2.',
      modelNote:
        'Platinum/rhodium catalysts lower activation energy to remove toxic CO and NOx; note that greenhouse gas CO₂ is produced rather than removed by this reaction.',
      reactants: [{ formula: 'CO', display: 'CO', state: 'g' }, { formula: 'NO', display: 'NO', state: 'g' }],
      products: [{ formula: 'CO2', display: 'CO₂', state: 'g' }, { formula: 'N2', display: 'N₂', state: 'g' }],
      requireSimplestRatio: true,
      hints: ['N₂ contains 2 nitrogen atoms, so start with 2 NO on the left.', '2 NO supplies 2 oxygen atoms to oxidise 2 CO into 2 CO₂.'],
      successExplanation: '2CO + 2NO → 2CO₂ + N₂ removes toxic CO and NO while leaving CO₂ as a product.',
    },
  ],
  d02: [
    {
      id: 'hc-d02-frs-mechanism',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Free-Radical Substitution',
      title: 'Guided Mechanism Stepper: CH₄ + Cl₂ (Initiation & Propagation)',
      instructions:
        'Step through UV initiation and the two chain-propagating steps. Track the unpaired radical electron (•) and notice how Cl• is regenerated in Propagation Step 2.',
      accessibilityLabel: 'Free-radical substitution initiation and propagation process stepper',
      fallbackText: 'Initiation: Cl2 -> 2Cl• (UV homolytic fission). Prop 1: CH4 + Cl• -> •CH3 + HCl. Prop 2: •CH3 + Cl2 -> CH3Cl + Cl•.',
      stages: [
        {
          id: 'frs-1',
          title: '1. Initiation — UV Homolytic Fission',
          summary: 'UV light breaks the Cl–Cl covalent bond homolytically (two half-headed fishhook arrows, one electron to each Cl atom), generating two chlorine radicals.',
          equation: 'Cl–Cl  —(UV)→  Cl• + Cl•',
          stateSnapshot: [
            { id: 'stageType', label: 'Phase', value: 'Initiation' },
            { id: 'radicals', label: 'Active Radicals', value: '2 Cl•' },
            { id: 'netRad', label: 'Radical Count', value: '0 → 2' },
          ],
        },
        {
          id: 'frs-2',
          title: '2. Propagation Step 1 — Hydrogen Abstraction',
          summary: 'A reactive Cl• radical abstracts a hydrogen atom from methane to form HCl and a methyl radical (•CH₃).',
          equation: 'CH₄ + Cl•  →  •CH₃ + HCl',
          stateSnapshot: [
            { id: 'stageType', label: 'Phase', value: 'Propagation 1' },
            { id: 'radicals', label: 'Active Radicals', value: '•CH₃' },
            { id: 'netRad', label: 'Radical Count', value: '1 → 1' },
          ],
        },
        {
          id: 'frs-3',
          title: '3. Propagation Step 2 — Chlorine Transfer & Chain Regeneration',
          summary: 'The methyl radical attacks another Cl₂ molecule, forming chloromethane (CH₃Cl) and regenerating Cl• to sustain the chain reaction.',
          equation: '•CH₃ + Cl₂  →  CH₃Cl + Cl•',
          stateSnapshot: [
            { id: 'stageType', label: 'Phase', value: 'Propagation 2' },
            { id: 'radicals', label: 'Active Radicals', value: 'Cl• regenerated' },
            { id: 'netRad', label: 'Radical Count', value: '1 → 1' },
          ],
        },
      ],
      sequenceChallenge: {
        id: 'seq-frs',
        prompt: 'Order the initiation and propagation steps of methane chlorination:',
        stageIdsToOrder: ['frs-1', 'frs-2', 'frs-3'],
        explanation: 'UV initiation generates Cl• first, then Cl• abstracts H from CH₄ to form •CH₃, and finally •CH₃ reacts with Cl₂ to form CH₃Cl and regenerate Cl•.',
      },
      hints: ['Radicals must be generated by UV fission before propagation can begin.', 'Cl• is consumed in Step 1 and regenerated in Step 2.'],
    },
  ],
  d03: [
    {
      id: 'hc-d03-termination',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Termination Pathways',
      title: 'Free-Radical Termination Pathways (CH₄ + Cl₂)',
      instructions:
        'Explore all three valid radical-radical collisions that end the chain reaction. Notice that trace ethane (C₂H₆) is direct experimental evidence for methyl radicals (•CH₃).',
      accessibilityLabel: 'Free-radical termination pathways stepper',
      fallbackText: 'Termination removes two radicals to form one neutral molecule: Cl• + Cl• -> Cl2; •CH3 + Cl• -> CH3Cl; •CH3 + •CH3 -> C2H6.',
      stages: [
        {
          id: 'term-1',
          title: 'Pathway A: Two Chlorine Radicals Collide',
          summary: 'Two Cl• radicals pair their unpaired electrons to reform a Cl–Cl covalent bond.',
          equation: 'Cl• + Cl•  →  Cl₂',
          stateSnapshot: [
            { id: 'radIn', label: 'Radicals In', value: '2' },
            { id: 'radOut', label: 'Radicals Out', value: '0' },
            { id: 'prod', label: 'Product', value: 'Cl₂' },
          ],
          prediction: {
            prompt: 'Which termination product provides direct evidence that methyl radicals (•CH₃) are formed during methane chlorination?',
            options: ['Hydrogen chloride (HCl)', 'Trace ethane (C₂H₆)', 'Chlorine gas (Cl₂)'],
            correctIndex: 1,
            explanation: 'Ethane (C₂H₆) can only form when two •CH₃ radicals collide and bond together.',
          },
        },
        {
          id: 'term-2',
          title: 'Pathway B: Methyl Radical + Chlorine Radical',
          summary: 'A •CH₃ radical and a Cl• radical combine directly to form chloromethane.',
          equation: '•CH₃ + Cl•  →  CH₃Cl',
          stateSnapshot: [
            { id: 'radIn', label: 'Radicals In', value: '2' },
            { id: 'radOut', label: 'Radicals Out', value: '0' },
            { id: 'prod', label: 'Product', value: 'CH₃Cl' },
          ],
        },
        {
          id: 'term-3',
          title: 'Pathway C: Two Methyl Radicals Combine (Evidence of •CH₃)',
          summary: 'Two •CH₃ radicals join to form a trace amount of ethane (C₂H₆), proving methyl radicals exist in the mixture.',
          equation: '•CH₃ + •CH₃  →  C₂H₆',
          stateSnapshot: [
            { id: 'radIn', label: 'Radicals In', value: '2' },
            { id: 'radOut', label: 'Radicals Out', value: '0' },
            { id: 'prod', label: 'Product', value: 'C₂H₆ (trace)' },
          ],
        },
      ],
    },
  ],
  e03: [
    {
      id: 'hc-e03-cracking-balance',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'A-Level Chemistry · Thermal Cracking',
      title: 'Balance a Thermal Cracking Equation (Dodecane → Hexane + Ethene)',
      instructions:
        'Given that dodecane (C₁₂H₂₆) cracks to form hexane (C₆H₁₄) and ethene (C₂H₄), balance the equation to conserve carbon and hydrogen atoms.',
      accessibilityLabel: 'Chemical equation balancer for dodecane cracking to hexane and ethene',
      fallbackText: 'C12H26 -> C6H14 + 3C2H4.',
      modelNote:
        'Cracking can yield many different valid alkane + alkene combinations; here the specific products (hexane + ethene) are specified so the stoichiometry is unique.',
      reactants: [{ formula: 'C12H26', display: 'C₁₂H₂₆' }],
      products: [{ formula: 'C6H14', display: 'C₆H₁₄' }, { formula: 'C2H4', display: 'C₂H₄' }],
      requireSimplestRatio: true,
      hints: ['12 C − 6 C = 6 remaining carbons, which form 3 molecules of ethene (C₂H₄).', 'Check H atoms: 14 + 3×4 = 26.'],
      successExplanation: 'C₁₂H₂₆ → C₆H₁₄ + 3C₂H₄ conserves 12 C and 26 H atoms.',
    },
  ],
  f01: [
    {
      id: 'hc-f01-ethene-geometry',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'molecular-geometry',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'A-Level Chemistry · Alkene Bonding',
      title: 'Geometry Around One Carbon Atom in Ethene (C₂H₄)',
      instructions:
        'Each carbon in ethene is bonded to two H atoms and one other C atom (via a C=C double bond = 1 σ bond + 1 π bond). Determine the bonding domains, shape, and H–C–H bond angle around one carbon atom.',
      accessibilityLabel: 'Ethene trigonal planar geometry around carbon',
      fallbackText: 'Each carbon in ethene has 3 regions of electron density (two C-H single bonds and one C=C double bond), 0 lone pairs, trigonal planar geometry, and ~120° bond angles.',
      modelNote:
        'A C=C double bond is NOT two identical sigma bonds: it consists of one head-on σ bond and one sideways-overlap π bond (which counts as one VSEPR bonding domain and restricts rotation).',
      moleculeFormula: 'C(H)₂=C',
      centralElement: 'C',
      surroundingElements: ['C', 'H', 'H'],
      targetBondingDomains: 3,
      targetLonePairs: 0,
      targetElectronGeometry: 'trigonal-planar',
      targetMolecularShape: 'trigonal-planar',
      targetBondAngleLabel: '120°',
      checkPolarity: false,
      hints: ['A double bond counts as 1 region of electron density (1 bonding domain) in VSEPR.', '3 bonding domains and 0 lone pairs give trigonal planar geometry (120°).'],
      successExplanation: 'Each sp² carbon in ethene has 3 bonding domains and 0 lone pairs, producing a planar 120° geometry.',
    },
  ],
  f03: [
    {
      id: 'hc-f03-bromine-water-test',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Virtual Investigation',
      title: 'Virtual Investigation: Bromine-Water Test for Unsaturation',
      instructions:
        'Compare adding aqueous bromine water (Br₂(aq)) to an alkane versus an alkene in the dark. Note: this is a guided virtual observation, not a home-experiment instruction.',
      accessibilityLabel: 'Virtual bromine-water test comparison stepper',
      fallbackText: 'Virtual observation: Alkane + Br2(aq) in dark -> remains orange-brown (no reaction). Alkene + Br2(aq) -> rapidly decolourises to colourless.',
      stages: [
        {
          id: 'br-1',
          title: '1. Tube A (Alkane, e.g. Hexane) + Bromine Water in the Dark',
          summary: 'Hexane has only strong non-polar C–C and C–H σ bonds. Without UV light, no reaction occurs; the bromine layer stays orange-brown.',
          stateSnapshot: [
            { id: 'hc', label: 'Hydrocarbon', value: 'Hexane (saturated)' },
            { id: 'obs', label: 'Observation', value: 'Stays orange-brown' },
            { id: 'rxn', label: 'Reaction', value: 'None in dark' },
          ],
          prediction: {
            prompt: 'What observation confirms the presence of a C=C double bond when shaken with bromine water?',
            options: ['Orange-brown solution turns colourless rapidly', 'Colourless solution turns orange-brown', 'White precipitate forms'],
            correctIndex: 0,
            explanation: 'Use the exact exam wording: bromine water changes from orange-brown to colourless (decolourises) — never say "turns clear" alone.',
          },
        },
        {
          id: 'br-2',
          title: '2. Tube B (Alkene, e.g. Hex-1-ene) + Bromine Water',
          summary: 'The electron-rich C=C π bond reacts rapidly at room temperature via electrophilic addition, consuming Br₂ so the solution turns colourless.',
          equation: 'C=C + Br₂  →  –C(Br)–C(Br)– (colourless)',
          stateSnapshot: [
            { id: 'hc', label: 'Hydrocarbon', value: 'Alkene (unsaturated)' },
            { id: 'obs', label: 'Observation', value: 'Rapidly decolourises (orange → colourless)' },
            { id: 'rxn', label: 'Reaction', value: 'Electrophilic addition' },
          ],
        },
      ],
    },
  ],
  g05: [
    {
      id: 'hc-g05-atom-economy',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'A-Level Chemistry · Green Chemistry',
      title: 'Atom Economy of Direct Ethene Hydration',
      instructions:
        'Calculate the theoretical atom economy (%) of C₂H₄ + H₂O → C₂H₅OH (Mr(C₂H₄) = 28.0, Mr(H₂O) = 18.0, Mr(C₂H₅OH) = 46.0). Enter the numeric percentage value.',
      accessibilityLabel: 'Calculate atom economy of ethene hydration',
      fallbackText: 'Atom economy = (46.0 / (28.0 + 18.0)) × 100% = 100%.',
      expectedValue: '100',
      unitSpec: { expectedUnit: '%', allowEquivalentUnits: false },
      prediction: {
        prompt: 'Why does an addition reaction with a single product always have 100% atom economy even if its experimental percentage yield is only 70%?',
        options: [
          'Atom economy is theoretical (from the balanced equation with no by-products); percentage yield reflects actual experimental losses',
          'Atom economy and percentage yield are always equal',
        ],
        correctIndex: 0,
        explanation: 'Every reactant atom enters the single desired product (100% atom economy), whereas percentage yield measures practical recovery.',
      },
      hints: ['Atom economy = (Mr of desired product / total Mr of all reactants) × 100%.'],
      successExplanation: '100% atom economy — all reactant atoms are incorporated into ethanol, distinct from experimental percentage yield.',
    },
  ],
  h02: [
    {
      id: 'hc-h02-electrophilic-addition-hbr',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Electrophilic Addition Mechanism',
      title: 'Electrophilic Addition of HBr to Ethene (6-Stage Mechanism)',
      instructions:
        'Step carefully through electron-pair movement, heterolytic cleavage, carbocation intermediate formation, and nucleophilic attack by Br⁻. Total atoms (C₂H₅Br) and net charge (0) are conserved at every stage.',
      accessibilityLabel: 'Six-stage electrophilic addition mechanism of HBr to ethene',
      fallbackText: '1. Polar Hδ+–Brδ- approaches C=C. 2. π-bond electron pair attacks Hδ+. 3. H–Br breaks heterolytically. 4. CH3CH2+ carbocation + :Br- intermediate. 5. :Br- lone pair attacks C+. 6. Bromoethane CH3CH2Br.',
      stages: [
        { id: 'ea-1', title: '1. Reactants & Bond Polarity', summary: 'Bromine is more electronegative than hydrogen, creating a permanent dipole Hδ⁺–Brδ⁻ near the electron-rich C=C π bond.', equation: 'CH₂=CH₂  +  Hδ⁺–Brδ⁻', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '0' }, { id: 'atoms', label: 'Atoms', value: 'C₂H₅Br' }] },
        { id: 'ea-2', title: '2. π-Bond Electron-Pair Movement', summary: 'A full-headed curly arrow starts from the C=C π bond and points to the electrophilic Hδ⁺ atom.', equation: 'C=C (π pair)  ⟶  Hδ⁺', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '0' }, { id: 'arrow', label: 'Curly Arrow', value: 'Full-headed (2 e⁻)' }] },
        { id: 'ea-3', title: '3. Heterolytic Cleavage of H–Br', summary: 'Simultaneously, the H–Br bonding electron pair moves entirely onto Br (heterolytic fission).', equation: 'H–Br  ⟶  H (bonded to C) + :Br⁻', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '0' }, { id: 'fission', label: 'Bond Fission', value: 'Heterolytic' }] },
        { id: 'ea-4', title: '4. Carbocation & Bromide Intermediate', summary: 'A positively charged ethyl carbocation (CH₃–CH₂⁺) and a negatively charged bromide ion (:Br⁻) form; overall charge remains 0.', equation: 'CH₃–CH₂⁺  +  :Br⁻', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '+1 + (−1) = 0' }, { id: 'inter', label: 'Intermediate', value: 'CH₃CH₂⁺ + Br⁻' }] },
        { id: 'ea-5', title: '5. Bromide Lone-Pair Donation', summary: 'A full-headed curly arrow starts from a lone pair on :Br⁻ and points directly to the positively charged carbon atom.', equation: ':Br⁻ (lone pair)  ⟶  ⁺CH₂–CH₃', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '0' }, { id: 'role', label: 'Br⁻ Role', value: 'Nucleophile' }] },
        { id: 'ea-6', title: '6. Bromoethane Product', summary: 'A new C–Br σ bond forms, giving neutral bromoethane (CH₃CH₂Br) with all carbons tetravalent.', equation: 'CH₃–CH₂–Br', stateSnapshot: [{ id: 'chg', label: 'Net Charge', value: '0' }, { id: 'prod', label: 'Product', value: 'Bromoethane (C₂H₅Br)' }] },
      ],
      sequenceChallenge: {
        id: 'seq-ea-hbr',
        prompt: 'Sequence the four core stages of electrophilic addition of HBr to ethene:',
        stageIdsToOrder: ['ea-1', 'ea-2', 'ea-4', 'ea-6'],
        explanation: 'First polar HBr approaches C=C, then the π-bond pair attacks Hδ⁺ to form the carbocation + Br⁻ intermediate, and finally Br⁻ donates a lone pair to give bromoethane.',
      },
      hints: ['Curly arrows always show electron-pair movement (never positive-charge movement).'],
    },
  ],
  i03: [
    {
      id: 'hc-i03-propene-carbocations',
      engine: 'process-stepper',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      mode: 'linear',
      visualMode: 'diagram',
      subjectTag: 'A-Level Chemistry · Regioselectivity',
      title: 'Propene + HBr: Comparing Secondary vs Primary Carbocation Pathways',
      instructions:
        'Compare the two possible carbocation intermediates when H⁺ adds to propene under standard electrophilic-addition conditions. Note that regioselectivity depends on mechanism and reaction conditions.',
      accessibilityLabel: 'Propene plus HBr secondary vs primary carbocation comparison',
      fallbackText: 'Adding H+ to C-1 gives the more stable secondary carbocation CH3CH+CH3 (two electron-donating alkyl groups) -> major product 2-bromopropane. Adding H+ to C-2 gives primary CH3CH2CH2+ -> minor product 1-bromopropane.',
      stages: [
        {
          id: 'pr-1',
          title: '1. Major Pathway — Secondary Carbocation',
          summary: 'H⁺ bonds to C-1, placing the positive charge on C-2. Two electron-donating alkyl (–CH₃) groups disperse the positive charge via the positive inductive effect, lowering activation energy.',
          equation: 'CH₃–CH⁺–CH₃  +  :Br⁻  →  CH₃–CH(Br)–CH₃ (2-bromopropane, major)',
          stateSnapshot: [
            { id: 'cat', label: 'Carbocation', value: 'Secondary (2°)' },
            { id: 'alkyl', label: 'Alkyl Groups', value: '2' },
            { id: 'share', label: 'Product Share', value: 'Major' },
          ],
          prediction: {
            prompt: 'Why is 2-bromopropane the major product when propene reacts with HBr under ordinary electrophilic-addition conditions?',
            options: [
              'It forms via a more stable secondary carbocation intermediate stabilised by two alkyl groups',
              'Primary carbocations are impossible to form under any conditions',
            ],
            correctIndex: 0,
            explanation: 'Both pathways occur, but the secondary carbocation is more stable (two electron-donating alkyl groups), making 2-bromopropane the major product.',
          },
        },
        {
          id: 'pr-2',
          title: '2. Minor Pathway — Primary Carbocation',
          summary: 'H⁺ bonds to C-2, placing the positive charge on C-1. Only one alkyl group stabilises the charge, so this higher-energy pathway produces less product under ordinary electrophilic conditions.',
          equation: 'CH₃–CH₂–CH₂⁺  +  :Br⁻  →  CH₃–CH₂–CH₂Br (1-bromopropane, minor)',
          stateSnapshot: [
            { id: 'cat', label: 'Carbocation', value: 'Primary (1°)' },
            { id: 'alkyl', label: 'Alkyl Groups', value: '1' },
            { id: 'share', label: 'Product Share', value: 'Minor' },
          ],
        },
      ],
    },
  ],
  p01: [
    {
      id: 'hc-p01-balance',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      subjectTag: 'Exam Practice 1 · Step 1',
      title: 'Step 1: Balance Complete Combustion of Propane',
      instructions: 'First balance the equation for the complete combustion of propane (C₃H₈) before calculating gas volumes.',
      accessibilityLabel: 'Balance propane combustion equation for Practice 1',
      fallbackText: 'C3H8 + 5O2 -> 3CO2 + 4H2O.',
      reactants: [{ formula: 'C3H8', display: 'C₃H₈', state: 'g' }, { formula: 'O2', display: 'O₂', state: 'g' }],
      products: [{ formula: 'CO2', display: 'CO₂', state: 'g' }, { formula: 'H2O', display: 'H₂O', state: 'l' }],
      requireSimplestRatio: true,
    },
    {
      id: 'hc-p01-o2-vol',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 1 · Step 2',
      title: 'Step 2: Volume of Oxygen Required (cm³)',
      instructions: '20 cm³ of propane burns completely at constant T and P. Using your balanced equation (1 : 5 molar ratio), enter the volume of O₂ required in cm³.',
      accessibilityLabel: 'Enter oxygen volume in cm3',
      fallbackText: '20 cm³ × 5 = 100 cm³ O2.',
      expectedValue: '100',
      unitSpec: { expectedUnit: 'cm^3', allowEquivalentUnits: true },
      hints: ['At constant T and P, gas volume ratios equal mole ratios (1 C₃H₈ : 5 O₂).'],
      successExplanation: '20 cm³ × 5 = 100 cm³ of oxygen.',
    },
    {
      id: 'hc-p01-co2-vol',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 1 · Step 3',
      title: 'Step 3: Volume of Carbon Dioxide Produced (cm³)',
      instructions: 'Using the balanced equation (1 C₃H₈ : 3 CO₂), enter the volume of CO₂ produced in cm³.',
      accessibilityLabel: 'Enter carbon dioxide volume in cm3',
      fallbackText: '20 cm³ × 3 = 60 cm³ CO2.',
      expectedValue: '60',
      unitSpec: { expectedUnit: 'cm^3', allowEquivalentUnits: true },
      hints: ['Multiply 20 cm³ by the CO₂ stoichiometric coefficient (3).'],
      successExplanation: '20 cm³ × 3 = 60 cm³ of CO₂.',
    },
  ],
  p03: [
    {
      id: 'hc-p03-moles',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 2 · Step 1',
      title: 'Step 1: Moles of Ethene (14.0 g, Mr = 28.0)',
      instructions: 'Calculate the amount in moles of 14.0 g of ethene (Mr = 28.0). Give your answer to 3 significant figures.',
      accessibilityLabel: 'Calculate moles of ethene',
      fallbackText: '14.0 / 28.0 = 0.500 mol.',
      expectedValue: '0.500',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: 'mol', allowEquivalentUnits: false },
      hints: ['n = mass / Mr = 14.0 / 28.0.'],
    },
    {
      id: 'hc-p03-theo-mass',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 2 · Step 2',
      title: 'Step 2: Theoretical Mass of Ethanol (Mr = 46.0)',
      instructions: 'Using the 1 : 1 molar ratio (C₂H₄ → C₂H₅OH), calculate the theoretical mass of ethanol in grams (3 s.f.).',
      accessibilityLabel: 'Calculate theoretical mass of ethanol in grams',
      fallbackText: '0.500 mol × 46.0 g/mol = 23.0 g.',
      expectedValue: '23.0',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: 'g', allowEquivalentUnits: false },
      hints: ['Theoretical mass = moles × Mr(ethanol) = 0.500 × 46.0.'],
    },
    {
      id: 'hc-p03-pct-yield',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 2 · Step 3',
      title: 'Step 3: Percentage Yield (Actual = 16.1 g)',
      instructions: 'Calculate the percentage yield if 16.1 g of ethanol is actually obtained (3 s.f.).',
      accessibilityLabel: 'Calculate percentage yield of ethanol',
      fallbackText: '(16.1 / 23.0) × 100% = 70.0%.',
      expectedValue: '70.0',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: '%', allowEquivalentUnits: false },
      hints: ['Percentage yield = (actual mass / theoretical mass) × 100% = (16.1 / 23.0) × 100%.'],
    },
  ],
  p09: [
    {
      id: 'hc-p09-moles',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 5 · Step 1',
      title: 'Step 1: Moles of Ethene (5.60 g, Mr = 28.0)',
      instructions: 'Calculate the moles of ethene in 5.60 g (3 s.f.).',
      accessibilityLabel: 'Calculate moles of ethene for Practice 5',
      fallbackText: '5.60 / 28.0 = 0.200 mol.',
      expectedValue: '0.200',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: 'mol', allowEquivalentUnits: false },
    },
    {
      id: 'hc-p09-theo',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 5 · Step 2',
      title: 'Step 2: Theoretical Mass of 1,2-Dibromoethane (Mr = 188.0)',
      instructions: 'Calculate the theoretical mass of 1,2-dibromoethane produced from 0.200 mol ethene (3 s.f., in g).',
      accessibilityLabel: 'Calculate theoretical mass of 1,2-dibromoethane',
      fallbackText: '0.200 × 188.0 = 37.6 g.',
      expectedValue: '37.6',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: 'g', allowEquivalentUnits: false },
    },
    {
      id: 'hc-p09-yield',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 5 · Step 3',
      title: 'Step 3: Percentage Yield (Actual = 33.84 g)',
      instructions: 'Calculate the percentage yield when 33.84 g is obtained (3 s.f., in %).',
      accessibilityLabel: 'Calculate percentage yield for Practice 5',
      fallbackText: '(33.84 / 37.6) × 100% = 90.0%.',
      expectedValue: '90.0',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: '%', allowEquivalentUnits: false },
    },
    {
      id: 'hc-p09-75pct',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'as-a-level',
      subjectTag: 'Exam Practice 5 · Step 4',
      title: 'Step 4: Mass Expected at 75.0% Yield (g)',
      instructions: 'What mass of 1,2-dibromoethane would be collected if the yield were 75.0% (3 s.f., in g)?',
      accessibilityLabel: 'Calculate product mass at 75 percent yield',
      fallbackText: '0.750 × 37.6 g = 28.2 g.',
      expectedValue: '28.2',
      precisionRule: { kind: 'sig-figs', count: 3 },
      unitSpec: { expectedUnit: 'g', allowEquivalentUnits: false },
    },
  ],
};

/* ========================================================================== */
/* PILOT B: NaCCA BASIC 8 SCIENCE — ATOMS AND THE PERIODIC TABLE              */
/* ========================================================================== */

const ATOMS_ENRICHMENTS: Record<string, SlideInteractiveConfig[]> = {
  s04: [
    {
      id: 'b8-s04-carbon-atom',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Atomic Structure',
      title: 'Build a Neutral Carbon-12 Atom',
      instructions: 'Add protons, neutrons, and electrons to construct a neutral Carbon-12 atom (6 protons, 6 neutrons, 6 electrons).',
      accessibilityLabel: 'Build a neutral Carbon-12 atom in Bohr shell model',
      fallbackText: 'Carbon-12 has 6 protons and 6 neutrons in the nucleus and 6 electrons arranged as 2, 4 in shells.',
      modelNote: 'The shell rings are a helpful teaching model showing electron energy levels, not literal circular planet tracks.',
      targetElement: 'C',
      targetMassNumber: 12,
      targetCharge: 0,
      initialProtons: 4,
      initialNeutrons: 4,
      initialElectrons: 4,
      hints: ['Carbon has atomic number 6, so it needs 6 protons.', 'For a neutral atom, electrons equal protons (6).'],
      successExplanation: 'Well done! Carbon-12 has 6 protons, 6 neutrons, and 6 electrons (arrangement 2, 4).',
    },
  ],
  s06: [
    {
      id: 'b8-s06-neutral-lithium',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Electrical Neutrality',
      title: 'Make Lithium Electrically Neutral',
      instructions: 'This Lithium-7 nucleus has 3 protons and 4 neutrons, but only 1 electron. Adjust the electrons so the atom becomes electrically neutral (net charge = 0).',
      accessibilityLabel: 'Balance electrons in Lithium-7 to achieve electrical neutrality',
      fallbackText: 'Neutral Lithium-7 has 3 protons (+3) and 3 electrons (−3), giving net charge 0.',
      targetElement: 'Li',
      targetMassNumber: 7,
      targetCharge: 0,
      initialProtons: 3,
      initialNeutrons: 4,
      initialElectrons: 1,
      lockNucleus: true,
      prediction: {
        prompt: 'If an atom has 3 protons (+3) and only 2 electrons (−2), is it neutral?',
        options: ['No — it has a +1 charge (an ion)', 'Yes — protons and neutrons cancel out'],
        correctIndex: 0,
        explanation: 'Neutrons have 0 charge. An atom is neutral ONLY when the number of protons equals the number of electrons.',
      },
      hints: ['Match the number of negative electrons to the 3 positive protons.'],
      successExplanation: 'Spot on! 3 protons (+3) and 3 electrons (−3) balance to a net charge of 0.',
    },
  ],
  s07: [
    {
      id: 'b8-s07-proton-identity',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Atomic Number',
      title: 'Proton Number Defines the Element: Build Nitrogen-14',
      instructions: 'Start from Carbon-12 (6 protons) and change the proton, neutron, and electron counts to build a neutral Nitrogen-14 atom (atomic number 7). Notice how changing proton number changes the element!',
      accessibilityLabel: 'Build Nitrogen-14 starting from Carbon-12 to see how proton number defines element identity',
      fallbackText: 'Nitrogen-14 has 7 protons, 7 neutrons, and 7 electrons.',
      targetElement: 'N',
      targetMassNumber: 14,
      targetCharge: 0,
      initialProtons: 6,
      initialNeutrons: 6,
      initialElectrons: 6,
      hints: ['Atomic number 7 means 7 protons.', 'Mass number 14 means 14 − 7 = 7 neutrons.'],
      successExplanation: 'Adding 1 proton changes Carbon (Z = 6) into Nitrogen (Z = 7)!',
    },
  ],
  s09: [
    {
      id: 'b8-s09-isotope-c14',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Mass Number & Isotopes',
      title: 'Explore Isotopes: Build Carbon-14',
      instructions: 'Carbon-12 has 6 protons and 6 neutrons. Build the heavier isotope Carbon-14 (mass number 14) without changing the element.',
      accessibilityLabel: 'Build Carbon-14 isotope by adjusting neutrons only',
      fallbackText: 'Carbon-14 has 6 protons, 8 neutrons (mass number 6 + 8 = 14), and 6 electrons.',
      modelNote: 'Mass number (an integer count of protons + neutrons for one specific isotope) is distinct from relative atomic mass (weighted average across isotopes).',
      targetElement: 'C',
      targetMassNumber: 14,
      targetCharge: 0,
      initialProtons: 6,
      initialNeutrons: 6,
      initialElectrons: 6,
      hints: ['Keep protons = 6 so it stays Carbon.', 'Add 2 neutrons so 6 + 8 = 14.'],
      successExplanation: 'Carbon-14 still has 6 protons (so it is still Carbon), with 8 neutrons giving mass number 14.',
    },
  ],
  s10: [
    {
      id: 'b8-s10-fluorine-neutrons',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'lower-secondary',
      subjectTag: 'Basic 8 Science · Particle Counting',
      title: 'Calculate Neutrons in Fluorine-19',
      instructions: 'Fluorine has atomic number 9 and mass number 19. How many neutrons are in a Fluorine-19 nucleus?',
      accessibilityLabel: 'Enter number of neutrons in Fluorine-19',
      fallbackText: 'Neutrons = Mass number − Atomic number = 19 − 9 = 10.',
      expectedValue: '10',
      hints: ['Use Neutrons = Mass number − Atomic number.'],
      successExplanation: '19 − 9 = 10 neutrons.',
    },
  ],
  s12: [
    {
      id: 'b8-s12-mg-neutrons',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'lower-secondary',
      subjectTag: 'Basic 8 Science · Independent Practice',
      title: 'New Practice 1: Neutrons in Magnesium-24 (Z = 12, A = 24)',
      instructions: 'Magnesium has atomic number 12 and mass number 24. Enter the number of neutrons.',
      accessibilityLabel: 'Enter neutrons in Magnesium-24',
      fallbackText: '24 − 12 = 12 neutrons.',
      expectedValue: '12',
      hints: ['Subtract atomic number (12) from mass number (24).'],
    },
    {
      id: 'b8-s12-p-electrons',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'lower-secondary',
      subjectTag: 'Basic 8 Science · Independent Practice',
      title: 'New Practice 2: Electrons in Neutral Phosphorus-31 (Z = 15, A = 31)',
      instructions: 'A neutral Phosphorus-31 atom has atomic number 15. How many electrons does it have?',
      accessibilityLabel: 'Enter electrons in neutral Phosphorus-31',
      fallbackText: 'A neutral atom has electrons = protons = 15.',
      expectedValue: '15',
      hints: ['In any neutral atom, electrons equal protons (atomic number).'],
    },
  ],
  s18: [
    {
      id: 'b8-s18-neon-shells',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Electron Shells',
      title: 'Fill the First Two Shells: Neon (2, 8)',
      instructions: 'Neon has 10 protons in its nucleus. Add 10 electrons and observe how the first shell holds 2 and the second shell holds 8.',
      accessibilityLabel: 'Fill Neon electron shells 2, 8',
      fallbackText: 'Neon (Z = 10) has electron arrangement 2, 8 (full outer shell).',
      targetElement: 'Ne',
      targetMassNumber: 20,
      targetCharge: 0,
      initialProtons: 10,
      initialNeutrons: 10,
      initialElectrons: 0,
      lockNucleus: true,
      hints: ['Add 10 electrons so the first shell has 2 and the second shell has 8.'],
      successExplanation: 'Neon (2, 8) has a completely full outer shell of 8 electrons!',
    },
  ],
  s20: [
    {
      id: 'b8-s20-sodium-shells',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Valence Electrons',
      title: 'Build Sodium’s Electron Arrangement (2, 8, 1)',
      instructions: 'Place 11 electrons around the Sodium-23 nucleus and observe the single outer (valence) electron in Shell 3.',
      accessibilityLabel: 'Build Sodium 2, 8, 1 electron arrangement',
      fallbackText: 'Sodium (Z = 11) has electron arrangement 2, 8, 1 (1 valence electron).',
      targetElement: 'Na',
      targetMassNumber: 23,
      targetCharge: 0,
      initialProtons: 11,
      initialNeutrons: 12,
      initialElectrons: 2,
      lockNucleus: true,
      hints: ['Shell 1 holds 2, Shell 2 holds 8, and the 11th electron goes into Shell 3.'],
      successExplanation: 'Sodium (2, 8, 1) has 1 valence electron in its third shell, placing it in Group 1, Period 3.',
    },
  ],
  s21: [
    {
      id: 'b8-s21-chlorine-shells',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Independent Practice',
      title: 'Independent Practice: Build Chlorine (Z = 17)',
      instructions: 'Using its atomic number (Z = 17), arrange the electrons of a neutral Chlorine atom across the energy levels.',
      accessibilityLabel: 'Build neutral Chlorine electron arrangement from atomic number 17',
      fallbackText: 'Chlorine (Z = 17) has 17 electrons arranged as 2, 8, 7.',
      modelNote: 'The first-20-elements shell-filling pattern applies to elements H through Ca (Z = 1..20).',
      targetElement: 'Cl',
      targetMassNumber: 35,
      targetCharge: 0,
      initialProtons: 17,
      initialNeutrons: 18,
      initialElectrons: 0,
      lockNucleus: true,
      hints: ['Fill Shell 1 (2) and Shell 2 (8) first, then place the remaining electrons in Shell 3.'],
    },
    {
      id: 'b8-s21-calcium-shells',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Independent Practice',
      title: 'Independent Practice: Build Calcium (Z = 20)',
      instructions: 'Using its atomic number (Z = 20), construct the electron arrangement of a neutral Calcium atom.',
      accessibilityLabel: 'Build neutral Calcium electron arrangement from atomic number 20',
      fallbackText: 'Calcium (Z = 20) has 20 electrons arranged as 2, 8, 8, 2.',
      targetElement: 'Ca',
      targetMassNumber: 40,
      targetCharge: 0,
      initialProtons: 20,
      initialNeutrons: 20,
      initialElectrons: 0,
      lockNucleus: true,
      hints: ['In the first-20 teaching model, fill Shells 1, 2, and 3 (2, 8, 8) before placing the remaining 2 electrons in Shell 4.'],
    },
  ],
  s22: [
    {
      id: 'b8-s22-fluoride-ion',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Ion Formation',
      title: 'Form a Fluoride Ion (F⁻)',
      instructions: 'Neutral Fluorine has 9 protons and 9 electrons (2, 7). Add 1 electron (leaving the 9 protons unchanged) to form a negatively charged Fluoride ion (F⁻).',
      accessibilityLabel: 'Form a Fluoride ion F minus by adding one electron',
      fallbackText: 'F- has 9 protons and 10 electrons (arrangement 2, 8), giving net charge −1.',
      targetElement: 'F',
      targetMassNumber: 19,
      targetCharge: -1,
      initialProtons: 9,
      initialNeutrons: 10,
      initialElectrons: 9,
      lockNucleus: true,
      prediction: {
        prompt: 'When a neutral Fluorine atom gains 1 electron, what happens to its net charge?',
        options: ['It becomes −1 (more negative electrons than positive protons)', 'It becomes +1', 'It turns into Neon'],
        correctIndex: 0,
        explanation: 'Gaining 1 negative electron gives 9 protons (+9) and 10 electrons (−10) = −1 charge. Proton number stays 9, so it is still Fluorine!',
      },
      hints: ['Add 1 electron so total electrons = 10 while protons stay 9.'],
      successExplanation: 'Fluoride (F⁻) has 9 protons and 10 electrons (2, 8) with a net charge of −1.',
    },
  ],
  s23: [
    {
      id: 'b8-s23-nacl-ionic',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'ionic-bonding',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Ionic Bonding',
      title: 'Guided Ionic Transfer: Sodium Chloride (NaCl)',
      instructions: 'Combine Sodium (Na⁺) and Chloride (Cl⁻) ions in the simplest electrically neutral ratio to model sodium chloride.',
      accessibilityLabel: 'Ionic bonding builder for sodium chloride NaCl',
      fallbackText: '1 Na+ ion and 1 Cl- ion balance to zero net charge (NaCl).',
      modelNote: 'Solid sodium chloride is a giant 3D ionic lattice of alternating Na⁺ and Cl⁻ ions held by electrostatic attraction — NaCl shows the simplest 1:1 ratio.',
      cationElement: 'Na',
      anionElement: 'Cl',
      targetCationCount: 1,
      targetAnionCount: 1,
      targetCationCharge: 1,
      targetAnionCharge: -1,
      requireSimplestRatio: true,
      hints: ['Na loses 1 electron to become Na⁺ (+1); Cl gains 1 electron to become Cl⁻ (−1).'],
      successExplanation: 'Na⁺ and Cl⁻ attract electrostatically in a 1 : 1 ratio to form the NaCl ionic lattice.',
    },
    {
      id: 'b8-s23-mgo-ionic',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'ionic-bonding',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Independent Practice',
      title: 'New Independent Practice: Magnesium Oxide (MgO)',
      instructions: 'Magnesium (2, 8, 2) loses 2 electrons to form Mg²⁺, and Oxygen (2, 6) gains 2 electrons to form O²⁻. Build the neutral ionic ratio for Magnesium Oxide.',
      accessibilityLabel: 'Ionic bonding builder for magnesium oxide MgO',
      fallbackText: '1 Mg2+ ion (+2) and 1 O2- ion (-2) balance to MgO.',
      cationElement: 'Mg',
      anionElement: 'O',
      targetCationCount: 1,
      targetAnionCount: 1,
      targetCationCharge: 2,
      targetAnionCharge: -2,
      requireSimplestRatio: true,
      hints: ['+2 and −2 already sum to 0, so the simplest ratio is 1 : 1 (MgO).'],
      successExplanation: 'Well done! Mg²⁺ and O²⁻ combine 1 : 1 to form Magnesium Oxide (MgO).',
    },
  ],
  s25: [
    {
      id: 'b8-s25-water-covalent',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'covalent-bonding',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Covalent Molecules',
      title: 'Build a Water Molecule (H₂O — Compound)',
      instructions: 'Connect Oxygen to both Hydrogen atoms using single covalent bonds so every atom achieves a full outer shell (duet for H, octet for O).',
      accessibilityLabel: 'Covalent bonding builder for water H2O',
      fallbackText: 'Water (H2O) has two single O–H covalent bonds and 2 lone pairs on Oxygen.',
      formulaDisplay: 'H₂O',
      netCharge: 0,
      octetPolicy: 'strict-duet-octet',
      atoms: [
        { id: 'O1', element: 'O', xPct: 50, yPct: 45, isCentral: true },
        { id: 'H1', element: 'H', xPct: 24, yPct: 68 },
        { id: 'H2', element: 'H', xPct: 76, yPct: 68 },
      ],
      allowedBondOrders: [1],
      allowDativeBonds: false,
      initialBonds: [],
      referenceBonds: [
        { id: 'b1', from: 'O1', to: 'H1', order: 1 },
        { id: 'b2', from: 'O1', to: 'H2', order: 1 },
      ],
      initialLonePairs: { O1: 2 },
      hints: ['Each Hydrogen needs 1 shared pair (single bond); Oxygen needs 2 single bonds.'],
      successExplanation: 'Water (H₂O) is a covalent molecule of a compound formed by two O–H single bonds.',
    },
    {
      id: 'b8-s25-co2-covalent',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'covalent-bonding',
      schemaVersion: 1,
      minEngineVersion: '1.2.0',
      curriculumLevel: 'introductory',
      subjectTag: 'Basic 8 Science · Covalent Double Bonds',
      title: 'Build Carbon Dioxide (CO₂ — Double Covalent Bonds)',
      instructions: 'Connect Carbon to each Oxygen atom using double covalent bonds (O=C=O) so all three atoms achieve a full octet.',
      accessibilityLabel: 'Covalent bonding builder for carbon dioxide CO2',
      fallbackText: 'Carbon dioxide (CO2) has two C=O double bonds (O=C=O).',
      formulaDisplay: 'CO₂',
      netCharge: 0,
      octetPolicy: 'strict-duet-octet',
      atoms: [
        { id: 'O1', element: 'O', xPct: 20, yPct: 50 },
        { id: 'C1', element: 'C', xPct: 50, yPct: 50, isCentral: true },
        { id: 'O2', element: 'O', xPct: 80, yPct: 50 },
      ],
      allowedBondOrders: [1, 2],
      allowDativeBonds: false,
      initialBonds: [],
      referenceBonds: [
        { id: 'b1', from: 'C1', to: 'O1', order: 2 },
        { id: 'b2', from: 'C1', to: 'O2', order: 2 },
      ],
      initialLonePairs: { O1: 2, O2: 2 },
      hints: ['Carbon needs 4 bonds total; each Oxygen needs 2 bonds (use double bonds).'],
      successExplanation: 'O=C=O satisfies the octet rule for carbon and both oxygen atoms.',
    },
  ],
  s26: [
    {
      id: 'b8-s26-argon-neutrons',
      engine: 'math-evaluator',
      mode: 'numeric-quantity',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'lower-secondary',
      subjectTag: 'Basic 8 Science · Practical Mastery',
      title: 'Mastery Practice: Neutrons in Argon-40 (Z = 18, A = 40)',
      instructions: 'Argon has atomic number 18 and mass number 40. Enter the number of neutrons (practice exploration — not recorded in teacher gradebooks).',
      accessibilityLabel: 'Enter neutrons in Argon-40',
      fallbackText: '40 − 18 = 22 neutrons.',
      expectedValue: '22',
      hints: ['Neutrons = 40 − 18.'],
      successExplanation: '40 − 18 = 22 neutrons.',
    },
  ],
};

function enrichAndVerify(lessonId: string, enrichments: Record<string, SlideInteractiveConfig[]>) {
  const origPath = path.join(WORK_DIR, `${lessonId}.original.json`);
  const original = JSON.parse(fs.readFileSync(origPath, 'utf8')) as NarratedLesson;
  const enriched = JSON.parse(JSON.stringify(original)) as NarratedLesson;

  let addedActivities = 0;
  let enrichedSlides = 0;
  for (const slide of enriched.slides) {
    const acts = enrichments[slide.id];
    if (acts && acts.length > 0) {
      slide.interactive = acts;
      addedActivities += acts.length;
      enrichedSlides++;
    }
  }

  // 1. Strict PRODUCTION-COMPATIBLE interactive validation (allowDevOnlyEngines: false!)
  assertValidLessonInteractives(enriched, { allowDevOnlyEngines: false });

  // 2. Verify all existing SVGs remain safe
  for (const slide of enriched.slides) {
    if (slide.visual.svgCode) assertSafeSvg(slide.visual.svgCode, `${lessonId}/${slide.id}`);
  }

  // 3. Structural preservation check: stripping `slide.interactive` MUST produce byte-for-byte identical JSON!
  const stripped = JSON.parse(JSON.stringify(enriched)) as NarratedLesson;
  for (const slide of stripped.slides) delete slide.interactive;
  if (JSON.stringify(stripped) !== JSON.stringify(original)) {
    throw new Error(`PRESERVATION CHECK FAILED for ${lessonId}: non-interactive fields changed!`);
  }

  const outPath = path.join(WORK_DIR, `${lessonId}.enriched.json`);
  fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');
  console.log(
    JSON.stringify({
      lessonId,
      totalSlides: enriched.slides.length,
      enrichedSlides,
      addedActivities,
      productionGate: 'PASSED (allowDevOnlyEngines: false)',
      preservationDiff: 'IDENTICAL (0 non-interactive fields changed)',
      outPath,
    }),
  );
}

enrichAndVerify('cambridge-as-a-level-chemistry-hydrocarbons', HYDROCARBONS_ENRICHMENTS);
enrichAndVerify('b8-sci-t1-atoms-and-the-periodic-table', ATOMS_ENRICHMENTS);

// Also generate the upgraded Basic 8 v1.8.0 Open-Ended Playground JSON (validated with allowDevOnlyEngines: true;
// ready for 1-command --skip-media publication after owner manual Vercel promotion & 1.8.0 activation!)
(() => {
  const origPath = path.join(WORK_DIR, 'b8-sci-t1-atoms-and-the-periodic-table.original.json');
  const baseEnriched = JSON.parse(
    fs.readFileSync(path.join(WORK_DIR, 'b8-sci-t1-atoms-and-the-periodic-table.enriched.json'), 'utf8'),
  ) as NarratedLesson;
  const orig = JSON.parse(fs.readFileSync(origPath, 'utf8')) as NarratedLesson;

  const s04 = baseEnriched.slides.find((s) => s.id === 's04');
  if (s04) {
    s04.interactive = [
      {
        id: 'b8-s04-atomic-playground',
        engine: 'construction-lab',
        labKind: 'atom-bond-builder',
        mode: 'atomic-structure',
        representation: 'shells',
        interactionMode: 'free-exploration',
        allowElementSelector: true,
        maxElementZ: 20,
        startEmpty: true,
        schemaVersion: 1,
        minEngineVersion: '1.8.0',
        curriculumLevel: 'introductory',
        subjectTag: 'Basic 8 Science · Open-Ended Playground',
        title: 'Open-Ended Atomic Structure Playground (Elements 1–20)',
        instructions:
          'Start from an empty atom or pick any of the first 20 elements on the Periodic Table! Add or remove protons, neutrons, and electrons to discover how protons change the element, neutrons create isotopes (e.g. Carbon-12, 13, 14), and electrons form ions (e.g. Na⁺, Cl⁻, Mg²⁺, O²⁻).',
        accessibilityLabel: 'Open-ended atomic structure playground for elements 1 to 20',
        fallbackText: 'Explore any element Z = 1..20, isotopes, and ions using the first-20 shell model.',
        modelNote:
          'Shell rings represent quantised energy levels (not circular paths). The 2, 8, 8, 2 shell-filling pattern is a simplified teaching model for the first 20 elements.',
        hints: [
          'Change protons to change the element identity.',
          'Keep protons fixed and change neutrons to explore isotopes (like C-12, C-13, C-14).',
          'Add or remove electrons to see how net charge forms positive or negative ions.',
        ],
      },
    ];
  }

  const s14 = baseEnriched.slides.find((s) => s.id === 's14');
  if (s14) {
    s14.interactive = [
      {
        id: 'b8-s14-periodic-explorer',
        engine: 'construction-lab',
        labKind: 'atom-bond-builder',
        mode: 'atomic-structure',
        representation: 'shells',
        interactionMode: 'free-exploration',
        allowElementSelector: true,
        maxElementZ: 20,
        startEmpty: false,
        initialProtons: 1,
        initialNeutrons: 0,
        initialElectrons: 1,
        schemaVersion: 1,
        minEngineVersion: '1.8.0',
        curriculumLevel: 'introductory',
        subjectTag: 'Basic 8 Science · Periodic Table Explorer',
        title: 'Interactive Periodic Table Explorer (First 20 Elements)',
        instructions:
          'Select elements across Periods 1–4 and Groups 1–18 to compare atomic numbers, shell counts (periods), and outer valence electrons (main groups).',
        accessibilityLabel: 'Interactive first-20 periodic table explorer',
        fallbackText: 'Period equals the number of occupied shells; main-group number relates to outer electrons.',
      },
    ];
  }

  const s21 = baseEnriched.slides.find((s) => s.id === 's21');
  if (s21) {
    s21.interactive = [
      {
        id: 'b8-s21-indep-challenges',
        engine: 'construction-lab',
        labKind: 'atom-bond-builder',
        mode: 'atomic-structure',
        representation: 'shells',
        interactionMode: 'independent-challenge',
        schemaVersion: 1,
        minEngineVersion: '1.8.0',
        curriculumLevel: 'introductory',
        subjectTag: 'Basic 8 Science · Independent Challenge',
        title: 'Independent Practice: Construct Electron Arrangements (H, O, Cl, Ca)',
        instructions:
          'Select each challenge tab and arrange the electrons for the neutral atom using its atomic number.',
        accessibilityLabel: 'Multi-target independent electron arrangement challenge for H, O, Cl, and Ca',
        fallbackText: 'Construct neutral electron arrangements for Hydrogen (Z=1), Oxygen (Z=8), Chlorine (Z=17), and Calcium (Z=20).',
        modelNote: 'Uses the first-20-elements shell-filling model (H through Ca).',
        challengeTargets: [
          { id: 'ch-h', prompt: 'Challenge 1: Arrange the electrons for a neutral Hydrogen atom (Z = 1).', targetElement: 'H', targetMassNumber: 1, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
          { id: 'ch-o', prompt: 'Challenge 2: Arrange the electrons for a neutral Oxygen atom (Z = 8).', targetElement: 'O', targetMassNumber: 16, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
          { id: 'ch-cl', prompt: 'Challenge 3: Arrange the electrons for a neutral Chlorine atom (Z = 17).', targetElement: 'Cl', targetMassNumber: 35, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
          { id: 'ch-ca', prompt: 'Challenge 4: Arrange the electrons for a neutral Calcium atom (Z = 20).', targetElement: 'Ca', targetMassNumber: 40, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
        ],
      },
    ];
  }

  assertValidLessonInteractives(baseEnriched, { allowDevOnlyEngines: true });
  const stripped = JSON.parse(JSON.stringify(baseEnriched)) as NarratedLesson;
  for (const slide of stripped.slides) delete slide.interactive;
  if (JSON.stringify(stripped) !== JSON.stringify(orig)) {
    throw new Error('PRESERVATION CHECK FAILED for v1.8.0 playground Basic 8 JSON!');
  }
  const outV180 = path.join(WORK_DIR, 'b8-sci-t1-atoms-and-the-periodic-table.playground-v1.8.0.json');
  fs.writeFileSync(outV180, JSON.stringify(baseEnriched, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ lessonId: 'b8-sci-t1-atoms-and-the-periodic-table (v1.8.0 playground)', devGate: 'PASSED (allowDevOnlyEngines: true)', preservationDiff: 'IDENTICAL', outV180 }));
})();
