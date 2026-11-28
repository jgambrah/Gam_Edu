/**
 * GAM EDU — Step 4E Strict Schema & Scientific Consistency Validator for `labKind: 'atom-bond-builder'`
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * Enforces strict per-mode key allowlists, approved element/charge/isotope sets,
 * covalent radical/formula-display checks, and VSEPR AXmEn scientific consistency.
 */

import {
  APPROVED_ELEMENTS,
  COVALENT_LIMITS,
  IONIC_LIMITS,
  computeExpectedValenceElectrons,
  getElementBySymbol,
  getExpectedSubshells,
  lookupVseprEntry,
  type AtomBondMode,
  type CovalentAtomNode,
  type CovalentBondDef,
  type OctetPolicy,
  type VseprShapeId,
} from './atom-bond-engine';

const SHARED_ATOM_BOND_KEYS = [
  'id',
  'engine',
  'schemaVersion',
  'minEngineVersion',
  'title',
  'instructions',
  'accessibilityLabel',
  'fallbackText',
  'hints',
  'persistCompletion',
  'labKind',
  'mode',
  'curriculumLevel',
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'exploreFurther',
  'isAssessment',
] as const;

const SHARED_EXAMPLE_META_KEYS = ['id', 'label', 'prompt', 'modelNote', 'successExplanation'] as const;

const ATOMIC_STRUCTURE_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  'representation',
  'interactionMode',
  'allowElementSelector',
  'maxElementZ',
  'startEmpty',
  'challengeTargets',
  'targetElement',
  'targetMassNumber',
  'targetCharge',
  'initialProtons',
  'initialNeutrons',
  'initialElectrons',
  'lockNucleus',
  'allowHypotheticalIsotope',
]);

const IONIC_CORE_KEYS = [
  'cationElement',
  'anionElement',
  'targetCationCount',
  'targetAnionCount',
  'targetCationCharge',
  'targetAnionCharge',
  'requireSimplestRatio',
] as const;

const IONIC_BONDING_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  ...IONIC_CORE_KEYS,
  'examples',
]);

const IONIC_EXAMPLE_KEYS = new Set([...SHARED_EXAMPLE_META_KEYS, ...IONIC_CORE_KEYS]);

const COVALENT_CORE_KEYS = [
  'formulaDisplay',
  'netCharge',
  'octetPolicy',
  'atoms',
  'allowedBondOrders',
  'allowDativeBonds',
  'initialBonds',
  'referenceBonds',
  'expectedDativeCount',
  'initialLonePairs',
] as const;

const COVALENT_BONDING_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  ...COVALENT_CORE_KEYS,
  'examples',
]);

const COVALENT_EXAMPLE_KEYS = new Set([...SHARED_EXAMPLE_META_KEYS, ...COVALENT_CORE_KEYS]);

const VSEPR_CORE_KEYS = [
  'moleculeFormula',
  'centralElement',
  'surroundingElements',
  'targetBondingDomains',
  'targetLonePairs',
  'targetElectronGeometry',
  'targetMolecularShape',
  'targetBondAngleLabel',
  'checkPolarity',
  'expectedPolar',
  'bondOrdersDisplay',
] as const;

const MOLECULAR_GEOMETRY_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  ...VSEPR_CORE_KEYS,
  'examples',
]);

const VSEPR_EXAMPLE_KEYS = new Set([...SHARED_EXAMPLE_META_KEYS, ...VSEPR_CORE_KEYS]);

const MAX_ATOM_BOND_EXAMPLES = 8;

const ATOM_NODE_KEYS = new Set([
  'id',
  'element',
  'xPct',
  'yPct',
  'isCentral',
  'minValenceElectrons',
  'maxValenceElectrons',
  'isCoordinateAcceptor',
  'isCoordinateDonor',
]);

const BOND_DEF_KEYS = new Set(['id', 'from', 'to', 'order', 'isDative']);

const VALID_CURRICULUM_LEVELS = new Set(['introductory', 'igcse', 'as-a-level']);
const VALID_OCTET_POLICIES = new Set<OctetPolicy>(['strict-duet-octet', 'electron-deficient', 'expanded-octet']);
const VALID_SHAPES = new Set<VseprShapeId>([
  'linear',
  'bent',
  'trigonal-planar',
  'trigonal-pyramidal',
  'tetrahedral',
  'trigonal-bipyramidal',
  'seesaw',
  't-shaped',
  'octahedral',
  'square-pyramidal',
  'square-planar',
]);

function checkAllowed(
  rec: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  ctx: string,
  errors: string[],
): void {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in ${ctx}.`);
    }
  }
}

/**
 * Parses ASCII/Unicode chemical formula display (e.g. "NH₄⁺", "H₂O", "SF₆", "CO₂")
 * into element counts and checks it matches the declared atom nodes.
 */
function parseDisplayElementCounts(formula: string): Record<string, number> | null {
  const subMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  const normalized = formula
    .replace(/[₀-₉]/g, (ch) => subMap[ch] ?? ch)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻+\-\s]/g, '');
  const counts: Record<string, number> = {};
  const re = /([A-Z][a-z]?)(\d*)/g;
  let consumed = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(normalized)) !== null) {
    consumed += m[0].length;
    const sym = m[1];
    const n = m[2] ? parseInt(m[2], 10) : 1;
    counts[sym] = (counts[sym] ?? 0) + n;
  }
  return consumed === normalized.length && Object.keys(counts).length > 0 ? counts : null;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function validateAtomBondBuilderConfig(
  obj: Record<string, unknown>,
  errors: string[],
): void {
  const mode = obj.mode as AtomBondMode;
  if (
    mode !== 'atomic-structure' &&
    mode !== 'ionic-bonding' &&
    mode !== 'covalent-bonding' &&
    mode !== 'molecular-geometry'
  ) {
    errors.push(`atom-bond-builder "mode" must be atomic-structure, ionic-bonding, covalent-bonding, or molecular-geometry.`);
    return;
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_CURRICULUM_LEVELS.has(obj.curriculumLevel)) {
    errors.push('atom-bond-builder "curriculumLevel" must be "introductory", "igcse", or "as-a-level".');
  }

  if (mode === 'atomic-structure') {
    checkAllowed(obj, ATOMIC_STRUCTURE_KEYS, 'atom-bond-builder(atomic-structure)', errors);
    const rep = obj.representation;
    if (rep !== 'shells' && rep !== 'subshells') {
      errors.push('atomic-structure "representation" must be "shells" or "subshells".');
      return;
    }
    const iMode = obj.interactionMode === undefined ? 'guided' : obj.interactionMode;
    if (iMode !== 'guided' && iMode !== 'free-exploration' && iMode !== 'independent-challenge') {
      errors.push('atomic-structure "interactionMode" must be "guided", "free-exploration", or "independent-challenge".');
      return;
    }
    if (obj.allowElementSelector !== undefined && typeof obj.allowElementSelector !== 'boolean') {
      errors.push('atomic-structure "allowElementSelector" must be a boolean.');
    }
    if (obj.startEmpty !== undefined && typeof obj.startEmpty !== 'boolean') {
      errors.push('atomic-structure "startEmpty" must be a boolean.');
    }
    const maxCapZ = rep === 'subshells' ? 30 : 20;
    if (obj.maxElementZ !== undefined) {
      if (typeof obj.maxElementZ !== 'number' || !Number.isInteger(obj.maxElementZ) || obj.maxElementZ < 1 || obj.maxElementZ > maxCapZ) {
        errors.push(`atomic-structure "maxElementZ" must be an integer in 1..${maxCapZ} for "${rep}".`);
      }
    }

    const validateSingleTarget = (
      tSym: unknown,
      tMass: unknown,
      tCharge: unknown,
      allowHyp: boolean,
      ctx: string,
    ) => {
      const sym = typeof tSym === 'string' ? tSym : '';
      const el = getElementBySymbol(sym);
      if (!el) {
        errors.push(`${ctx} "targetElement" "${sym}" is not in the approved element set.`);
        return;
      }
      if (rep === 'shells' && el.z > 20) {
        errors.push(`${ctx} "shells" representation supports Z = 1..20 only (got ${el.symbol}, Z = ${el.z}). Use "subshells" for Z = 21..30.`);
      }
      if (rep === 'subshells' && (el.z > 30 || !el.neutralSubshells)) {
        errors.push(`${ctx} "subshells" representation supports Z = 1..30 only (got ${el.symbol}, Z = ${el.z}).`);
      }
      const charge = tCharge === undefined ? 0 : tCharge;
      if (typeof charge !== 'number' || !Number.isInteger(charge) || !el.supportedCharges.includes(charge)) {
        errors.push(`${ctx} "targetCharge" ${String(charge)} is not a scientifically supported charge for ${el.symbol}.`);
      } else if (rep === 'subshells' && !getExpectedSubshells(el.symbol, charge)) {
        errors.push(`${ctx} cannot derive valid subshell configuration for ${el.symbol} with charge ${charge}.`);
      }
      if (typeof tMass !== 'number' || !Number.isInteger(tMass) || tMass < el.z || tMass > el.z * 3 + 10) {
        errors.push(`${ctx} "targetMassNumber" must be a valid integer >= Z (${el.z}).`);
      } else if (!allowHyp) {
        const known = el.isotopes.some((iso) => iso.massNumber === tMass);
        if (!known) {
          errors.push(`${ctx} targetMassNumber ${tMass} is not a physically supported isotope of ${el.symbol} (set allowHypotheticalIsotope: true only for hypothetical particle-count reasoning).`);
        }
      }
    };

    if (iMode === 'independent-challenge') {
      const targets = obj.challengeTargets;
      if (!Array.isArray(targets) || targets.length < 1 || targets.length > 8) {
        errors.push('atomic-structure(independent-challenge) requires 1..8 "challengeTargets".');
      } else {
        targets.forEach((t, idx) => {
          if (!t || typeof t !== 'object' || Array.isArray(t)) {
            errors.push(`challengeTargets[${idx}] must be an object.`);
            return;
          }
          const rec = t as Record<string, unknown>;
          if (typeof rec.prompt !== 'string' || !rec.prompt.trim()) {
            errors.push(`challengeTargets[${idx}].prompt must be a non-empty string.`);
          }
          validateSingleTarget(
            rec.targetElement,
            rec.targetMassNumber,
            rec.targetCharge,
            obj.allowHypotheticalIsotope === true,
            `challengeTargets[${idx}]`,
          );
        });
      }
    } else if (iMode === 'guided') {
      validateSingleTarget(
        obj.targetElement,
        obj.targetMassNumber,
        obj.targetCharge,
        obj.allowHypotheticalIsotope === true,
        'atomic-structure',
      );
    }

    for (const field of ['initialProtons', 'initialNeutrons', 'initialElectrons'] as const) {
      if (obj[field] !== undefined) {
        const v = obj[field];
        if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 60) {
          errors.push(`atomic-structure "${field}" must be a non-negative integer <= 60.`);
        }
      }
    }
    return;
  }

  const validateExamplesArray = (
    rawExamples: unknown,
    allowedKeys: ReadonlySet<string>,
    modeCtx: string,
    validateCore: (rec: Record<string, unknown>, ctx: string) => void,
  ) => {
    if (rawExamples === undefined) return;
    if (!Array.isArray(rawExamples) || rawExamples.length < 1 || rawExamples.length > MAX_ATOM_BOND_EXAMPLES) {
      errors.push(`${modeCtx} "examples" must contain 1 to ${MAX_ATOM_BOND_EXAMPLES} validated examples.`);
      return;
    }
    const seenIds = new Set<string>();
    rawExamples.forEach((rawEx, idx) => {
      const ctx = `${modeCtx}.examples[${idx}]`;
      if (!rawEx || typeof rawEx !== 'object' || Array.isArray(rawEx)) {
        errors.push(`${ctx} must be an object.`);
        return;
      }
      const rec = rawEx as Record<string, unknown>;
      checkAllowed(rec, allowedKeys, ctx, errors);
      if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
        errors.push(`${ctx}.id must be a 1-40 char identifier.`);
      } else if (seenIds.has(rec.id)) {
        errors.push(`Duplicate example id "${rec.id}" in ${modeCtx}.examples.`);
      } else {
        seenIds.add(rec.id);
      }
      if (typeof rec.label !== 'string' || rec.label.trim().length < 2) {
        errors.push(`${ctx}.label must be a non-empty string.`);
      }
      for (const optStr of ['prompt', 'modelNote', 'successExplanation'] as const) {
        if (rec[optStr] !== undefined && typeof rec[optStr] !== 'string') {
          errors.push(`${ctx}.${optStr} must be a string.`);
        }
      }
      validateCore(rec, ctx);
    });
  };

  if (mode === 'ionic-bonding') {
    checkAllowed(obj, IONIC_BONDING_KEYS, 'atom-bond-builder(ionic-bonding)', errors);
    const validateIonicCore = (rec: Record<string, unknown>, ctx: string) => {
      const cat = typeof rec.cationElement === 'string' ? getElementBySymbol(rec.cationElement) : null;
      const an = typeof rec.anionElement === 'string' ? getElementBySymbol(rec.anionElement) : null;
      if (!cat || !cat.isMetal) {
        errors.push(`${ctx} "cationElement" "${String(rec.cationElement)}" must be an approved metal.`);
      }
      if (!an || !an.isNonMetal) {
        errors.push(`${ctx} "anionElement" "${String(rec.anionElement)}" must be an approved non-metal.`);
      }
      const cc = rec.targetCationCount;
      const ac = rec.targetAnionCount;
      const cq = rec.targetCationCharge;
      const aq = rec.targetAnionCharge;
      if (typeof cc !== 'number' || !Number.isInteger(cc) || cc < 1 || cc > IONIC_LIMITS.maxCations) {
        errors.push(`${ctx} "targetCationCount" must be an integer 1..${IONIC_LIMITS.maxCations}.`);
      }
      if (typeof ac !== 'number' || !Number.isInteger(ac) || ac < 1 || ac > IONIC_LIMITS.maxAnions) {
        errors.push(`${ctx} "targetAnionCount" must be an integer 1..${IONIC_LIMITS.maxAnions}.`);
      }
      if (typeof cc === 'number' && typeof ac === 'number' && cc + ac > IONIC_LIMITS.maxTotalIons) {
        errors.push(`${ctx} total ions (${cc + ac}) exceeds limit of ${IONIC_LIMITS.maxTotalIons}.`);
      }
      if (typeof cq !== 'number' || !Number.isInteger(cq) || cq < 1 || cq > 3 || (cat && !cat.supportedCharges.includes(cq))) {
        errors.push(`${ctx} "targetCationCharge" ${String(cq)} is invalid for ${cat?.symbol ?? 'cation'}.`);
      }
      if (typeof aq !== 'number' || !Number.isInteger(aq) || aq > -1 || aq < -3 || (an && !an.supportedCharges.includes(aq))) {
        errors.push(`${ctx} "targetAnionCharge" ${String(aq)} is invalid for ${an?.symbol ?? 'anion'}.`);
      }
      if (typeof cc === 'number' && typeof ac === 'number' && typeof cq === 'number' && typeof aq === 'number') {
        if (cc * cq + ac * aq !== 0) {
          errors.push(`${ctx} target charges do not sum to zero (${cc}×${cq} + ${ac}×${aq} != 0).`);
        }
        if (rec.requireSimplestRatio !== false && gcd(cc, ac) > 1) {
          errors.push(`${ctx} target counts (${cc}:${ac}) are not in simplest whole-number empirical ratio.`);
        }
      }
    };
    validateIonicCore(obj, 'ionic-bonding');
    validateExamplesArray(obj.examples, IONIC_EXAMPLE_KEYS, 'ionic-bonding', validateIonicCore);
    return;
  }

  if (mode === 'covalent-bonding') {
    checkAllowed(obj, COVALENT_BONDING_KEYS, 'atom-bond-builder(covalent-bonding)', errors);
    const validateCovalentCore = (rec: Record<string, unknown>, ctx: string) => {
      if (typeof rec.formulaDisplay !== 'string' || rec.formulaDisplay.trim().length < 2) {
        errors.push(`${ctx} "formulaDisplay" must be a non-empty string.`);
      }
      if (typeof rec.octetPolicy !== 'string' || !VALID_OCTET_POLICIES.has(rec.octetPolicy as OctetPolicy)) {
        errors.push(`${ctx} "octetPolicy" must be "strict-duet-octet", "electron-deficient", or "expanded-octet".`);
      }
      const netCharge = rec.netCharge === undefined ? 0 : rec.netCharge;
      if (typeof netCharge !== 'number' || !Number.isInteger(netCharge) || netCharge < -3 || netCharge > 3) {
        errors.push(`${ctx} "netCharge" must be an integer between -3 and +3.`);
      }
      if (!Array.isArray(rec.atoms) || rec.atoms.length < 2 || rec.atoms.length > COVALENT_LIMITS.maxAtoms) {
        errors.push(`${ctx} "atoms" must contain 2 to ${COVALENT_LIMITS.maxAtoms} atoms.`);
        return;
      }

      const atomIds = new Set<string>();
      const atomCounts: Record<string, number> = {};
      for (let i = 0; i < rec.atoms.length; i++) {
        const a = rec.atoms[i] as Record<string, unknown>;
        if (!a || typeof a !== 'object' || Array.isArray(a)) {
          errors.push(`${ctx} atoms[${i}] must be an object.`);
          continue;
        }
        checkAllowed(a, ATOM_NODE_KEYS, `${ctx}.atoms[${i}]`, errors);
        if (typeof a.id !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(a.id)) {
          errors.push(`${ctx} atoms[${i}].id must be a valid identifier.`);
        } else if (atomIds.has(a.id)) {
          errors.push(`Duplicate atom id "${a.id}" in ${ctx}.`);
        } else {
          atomIds.add(a.id);
        }
        if (typeof a.element !== 'string' || !APPROVED_ELEMENTS[a.element]) {
          errors.push(`${ctx} atoms[${i}].element "${String(a.element)}" is not in the approved element set.`);
        } else {
          atomCounts[a.element] = (atomCounts[a.element] ?? 0) + 1;
        }
        if (typeof a.xPct !== 'number' || a.xPct < 5 || a.xPct > 95 || typeof a.yPct !== 'number' || a.yPct < 5 || a.yPct > 95) {
          errors.push(`${ctx} atoms[${i}] xPct/yPct must be numbers between 5 and 95.`);
        }
      }

      if (typeof rec.formulaDisplay === 'string' && Object.keys(atomCounts).length > 0) {
        const parsed = parseDisplayElementCounts(rec.formulaDisplay);
        if (parsed) {
          const allSyms = new Set([...Object.keys(atomCounts), ...Object.keys(parsed)]);
          for (const s of allSyms) {
            if ((atomCounts[s] ?? 0) !== (parsed[s] ?? 0)) {
              errors.push(
                `${ctx} formulaDisplay "${rec.formulaDisplay}" does not match declared atoms for element "${s}" (display: ${parsed[s] ?? 0}, atoms: ${atomCounts[s] ?? 0}).`,
              );
            }
          }
        }
      }

      if (typeof netCharge === 'number') {
        const totalV = computeExpectedValenceElectrons(rec.atoms as CovalentAtomNode[], netCharge);
        if (totalV === null || totalV <= 0 || totalV % 2 !== 0) {
          errors.push(
            `${ctx} species has ${String(totalV)} valence electrons; odd-electron radicals are outside the Step 4E Lewis model.`,
          );
        }
      }

      if (
        !Array.isArray(rec.allowedBondOrders) ||
        rec.allowedBondOrders.length === 0 ||
        rec.allowedBondOrders.some((o) => o !== 1 && o !== 2 && o !== 3)
      ) {
        errors.push(`${ctx} "allowedBondOrders" must be a non-empty subset of [1, 2, 3].`);
      }

      for (const bondField of ['initialBonds', 'referenceBonds'] as const) {
        const rawBonds = rec[bondField];
        if (rawBonds === undefined) continue;
        if (!Array.isArray(rawBonds) || rawBonds.length > COVALENT_LIMITS.maxBonds) {
          errors.push(`${ctx} "${bondField}" must contain at most ${COVALENT_LIMITS.maxBonds} bonds.`);
          continue;
        }
        const seen = new Set<string>();
        for (let i = 0; i < rawBonds.length; i++) {
          const b = rawBonds[i] as Record<string, unknown>;
          if (!b || typeof b !== 'object' || Array.isArray(b)) {
            errors.push(`${ctx} ${bondField}[${i}] must be an object.`);
            continue;
          }
          checkAllowed(b, BOND_DEF_KEYS, `${ctx}.${bondField}[${i}]`, errors);
          const from = b.from as string;
          const to = b.to as string;
          if (!atomIds.has(from) || !atomIds.has(to)) {
            errors.push(`${ctx} ${bondField}[${i}] references unknown atom "${from}" or "${to}".`);
          } else if (from === to) {
            errors.push(`${ctx} ${bondField}[${i}] cannot be a self-bond on "${from}".`);
          } else {
            const pk = from < to ? `${from}|${to}` : `${to}|${from}`;
            if (seen.has(pk)) {
              errors.push(`Duplicate bond between "${from}" and "${to}" in ${ctx}.${bondField}.`);
            }
            seen.add(pk);
          }
          if (b.order !== 1 && b.order !== 2 && b.order !== 3) {
            errors.push(`${ctx} ${bondField}[${i}].order must be 1, 2, or 3.`);
          }
        }
      }
    };
    validateCovalentCore(obj, 'covalent-bonding');
    validateExamplesArray(obj.examples, COVALENT_EXAMPLE_KEYS, 'covalent-bonding', validateCovalentCore);
    return;
  }

  // molecular-geometry
  checkAllowed(obj, MOLECULAR_GEOMETRY_KEYS, 'atom-bond-builder(molecular-geometry)', errors);
  const validateVseprCore = (rec: Record<string, unknown>, ctx: string) => {
    if (typeof rec.moleculeFormula !== 'string' || rec.moleculeFormula.trim().length < 2) {
      errors.push(`${ctx} "moleculeFormula" must be a non-empty string.`);
    }
    const central = typeof rec.centralElement === 'string' ? getElementBySymbol(rec.centralElement) : null;
    if (!central) {
      errors.push(`${ctx} "centralElement" "${String(rec.centralElement)}" is not in the approved element set.`);
    }
    if (
      !Array.isArray(rec.surroundingElements) ||
      rec.surroundingElements.length < 2 ||
      rec.surroundingElements.length > 6 ||
      rec.surroundingElements.some((s) => typeof s !== 'string' || !APPROVED_ELEMENTS[s])
    ) {
      errors.push(`${ctx} "surroundingElements" must contain 2 to 6 approved element symbols.`);
    }
    const bd = rec.targetBondingDomains;
    const lp = rec.targetLonePairs;
    if (typeof bd !== 'number' || !Number.isInteger(bd) || bd < 2 || bd > 6) {
      errors.push(`${ctx} "targetBondingDomains" must be an integer 2..6.`);
    }
    if (typeof lp !== 'number' || !Number.isInteger(lp) || lp < 0 || lp > 3) {
      errors.push(`${ctx} "targetLonePairs" must be an integer 0..3.`);
    }
    if (typeof bd === 'number' && typeof lp === 'number') {
      if (Array.isArray(rec.surroundingElements) && rec.surroundingElements.length !== bd) {
        errors.push(`${ctx} surroundingElements length (${rec.surroundingElements.length}) must equal targetBondingDomains (${bd}).`);
      }
      const ref = lookupVseprEntry(bd, lp);
      if (!ref) {
        errors.push(`${ctx} AX${bd}E${lp} is not a supported VSEPR combination (steric number must be 2..6).`);
      } else {
        if (rec.targetElectronGeometry !== ref.electronGeometry) {
          errors.push(`${ctx} targetElectronGeometry "${String(rec.targetElectronGeometry)}" conflicts with AX${bd}E${lp} (expected "${ref.electronGeometry}").`);
        }
        if (rec.targetMolecularShape !== ref.molecularShape) {
          errors.push(`${ctx} targetMolecularShape "${String(rec.targetMolecularShape)}" conflicts with AX${bd}E${lp} (expected "${ref.molecularShape}").`);
        }
      }
    }
    if (typeof rec.targetElectronGeometry !== 'string' || !VALID_SHAPES.has(rec.targetElectronGeometry as VseprShapeId)) {
      errors.push(`${ctx} "targetElectronGeometry" must be a supported VSEPR shape.`);
    }
    if (typeof rec.targetMolecularShape !== 'string' || !VALID_SHAPES.has(rec.targetMolecularShape as VseprShapeId)) {
      errors.push(`${ctx} "targetMolecularShape" must be a supported VSEPR shape.`);
    }
    if (typeof rec.targetBondAngleLabel !== 'string' || rec.targetBondAngleLabel.trim().length < 2) {
      errors.push(`${ctx} "targetBondAngleLabel" must be a non-empty string.`);
    }
  };
  validateVseprCore(obj, 'molecular-geometry');
  validateExamplesArray(obj.examples, VSEPR_EXAMPLE_KEYS, 'molecular-geometry', validateVseprCore);
}
