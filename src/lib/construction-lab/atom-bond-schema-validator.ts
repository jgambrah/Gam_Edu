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
] as const;

const ATOMIC_STRUCTURE_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  'representation',
  'targetElement',
  'targetMassNumber',
  'targetCharge',
  'initialProtons',
  'initialNeutrons',
  'initialElectrons',
  'lockNucleus',
  'allowHypotheticalIsotope',
]);

const IONIC_BONDING_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
  'cationElement',
  'anionElement',
  'targetCationCount',
  'targetAnionCount',
  'targetCationCharge',
  'targetAnionCharge',
  'requireSimplestRatio',
]);

const COVALENT_BONDING_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
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
]);

const MOLECULAR_GEOMETRY_KEYS = new Set([
  ...SHARED_ATOM_BOND_KEYS,
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
]);

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
    const sym = typeof obj.targetElement === 'string' ? obj.targetElement : '';
    const el = getElementBySymbol(sym);
    if (!el) {
      errors.push(`atomic-structure "targetElement" "${sym}" is not in the approved element set.`);
      return;
    }
    if (rep === 'shells' && el.z > 20) {
      errors.push(`atomic-structure "shells" representation supports Z = 1..20 only (got ${el.symbol}, Z = ${el.z}). Use "subshells" for Z = 21..30.`);
    }
    if (rep === 'subshells' && (el.z > 30 || !el.neutralSubshells)) {
      errors.push(`atomic-structure "subshells" representation supports Z = 1..30 only (got ${el.symbol}, Z = ${el.z}).`);
    }
    const charge = obj.targetCharge === undefined ? 0 : obj.targetCharge;
    if (typeof charge !== 'number' || !Number.isInteger(charge) || !el.supportedCharges.includes(charge)) {
      errors.push(`atomic-structure "targetCharge" ${String(charge)} is not a scientifically supported charge for ${el.symbol}.`);
    } else if (rep === 'subshells' && !getExpectedSubshells(el.symbol, charge)) {
      errors.push(`atomic-structure cannot derive valid subshell configuration for ${el.symbol} with charge ${charge}.`);
    }
    const mass = obj.targetMassNumber;
    if (typeof mass !== 'number' || !Number.isInteger(mass) || mass < el.z || mass > el.z * 3 + 10) {
      errors.push(`atomic-structure "targetMassNumber" must be a valid integer >= Z (${el.z}).`);
    } else if (obj.allowHypotheticalIsotope !== true) {
      const known = el.isotopes.some((iso) => iso.massNumber === mass);
      if (!known) {
        errors.push(`atomic-structure targetMassNumber ${mass} is not a physically supported isotope of ${el.symbol} (set allowHypotheticalIsotope: true only for hypothetical particle-count reasoning).`);
      }
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

  if (mode === 'ionic-bonding') {
    checkAllowed(obj, IONIC_BONDING_KEYS, 'atom-bond-builder(ionic-bonding)', errors);
    const cat = typeof obj.cationElement === 'string' ? getElementBySymbol(obj.cationElement) : null;
    const an = typeof obj.anionElement === 'string' ? getElementBySymbol(obj.anionElement) : null;
    if (!cat || !cat.isMetal) {
      errors.push(`ionic-bonding "cationElement" "${String(obj.cationElement)}" must be an approved metal.`);
    }
    if (!an || !an.isNonMetal) {
      errors.push(`ionic-bonding "anionElement" "${String(obj.anionElement)}" must be an approved non-metal.`);
    }
    const cc = obj.targetCationCount;
    const ac = obj.targetAnionCount;
    const cq = obj.targetCationCharge;
    const aq = obj.targetAnionCharge;
    if (typeof cc !== 'number' || !Number.isInteger(cc) || cc < 1 || cc > IONIC_LIMITS.maxCations) {
      errors.push(`ionic-bonding "targetCationCount" must be an integer 1..${IONIC_LIMITS.maxCations}.`);
    }
    if (typeof ac !== 'number' || !Number.isInteger(ac) || ac < 1 || ac > IONIC_LIMITS.maxAnions) {
      errors.push(`ionic-bonding "targetAnionCount" must be an integer 1..${IONIC_LIMITS.maxAnions}.`);
    }
    if (typeof cc === 'number' && typeof ac === 'number' && cc + ac > IONIC_LIMITS.maxTotalIons) {
      errors.push(`ionic-bonding total ions (${cc + ac}) exceeds limit of ${IONIC_LIMITS.maxTotalIons}.`);
    }
    if (typeof cq !== 'number' || !Number.isInteger(cq) || cq < 1 || cq > 3 || (cat && !cat.supportedCharges.includes(cq))) {
      errors.push(`ionic-bonding "targetCationCharge" ${String(cq)} is invalid for ${cat?.symbol ?? 'cation'}.`);
    }
    if (typeof aq !== 'number' || !Number.isInteger(aq) || aq > -1 || aq < -3 || (an && !an.supportedCharges.includes(aq))) {
      errors.push(`ionic-bonding "targetAnionCharge" ${String(aq)} is invalid for ${an?.symbol ?? 'anion'}.`);
    }
    if (typeof cc === 'number' && typeof ac === 'number' && typeof cq === 'number' && typeof aq === 'number') {
      if (cc * cq + ac * aq !== 0) {
        errors.push(`ionic-bonding target charges do not sum to zero (${cc}×${cq} + ${ac}×${aq} != 0).`);
      }
      if (obj.requireSimplestRatio !== false && gcd(cc, ac) > 1) {
        errors.push(`ionic-bonding target counts (${cc}:${ac}) are not in simplest whole-number empirical ratio.`);
      }
    }
    return;
  }

  if (mode === 'covalent-bonding') {
    checkAllowed(obj, COVALENT_BONDING_KEYS, 'atom-bond-builder(covalent-bonding)', errors);
    if (typeof obj.formulaDisplay !== 'string' || obj.formulaDisplay.trim().length < 2) {
      errors.push('covalent-bonding "formulaDisplay" must be a non-empty string.');
    }
    if (typeof obj.octetPolicy !== 'string' || !VALID_OCTET_POLICIES.has(obj.octetPolicy as OctetPolicy)) {
      errors.push('covalent-bonding "octetPolicy" must be "strict-duet-octet", "electron-deficient", or "expanded-octet".');
    }
    const netCharge = obj.netCharge === undefined ? 0 : obj.netCharge;
    if (typeof netCharge !== 'number' || !Number.isInteger(netCharge) || netCharge < -3 || netCharge > 3) {
      errors.push('covalent-bonding "netCharge" must be an integer between -3 and +3.');
    }
    if (!Array.isArray(obj.atoms) || obj.atoms.length < 2 || obj.atoms.length > COVALENT_LIMITS.maxAtoms) {
      errors.push(`covalent-bonding "atoms" must contain 2 to ${COVALENT_LIMITS.maxAtoms} atoms.`);
      return;
    }

    const atomIds = new Set<string>();
    const atomCounts: Record<string, number> = {};
    for (let i = 0; i < obj.atoms.length; i++) {
      const a = obj.atoms[i] as Record<string, unknown>;
      if (!a || typeof a !== 'object' || Array.isArray(a)) {
        errors.push(`covalent-bonding atoms[${i}] must be an object.`);
        continue;
      }
      checkAllowed(a, ATOM_NODE_KEYS, `covalent-bonding.atoms[${i}]`, errors);
      if (typeof a.id !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(a.id)) {
        errors.push(`covalent-bonding atoms[${i}].id must be a valid identifier.`);
      } else if (atomIds.has(a.id)) {
        errors.push(`Duplicate atom id "${a.id}" in covalent-bonding.`);
      } else {
        atomIds.add(a.id);
      }
      if (typeof a.element !== 'string' || !APPROVED_ELEMENTS[a.element]) {
        errors.push(`covalent-bonding atoms[${i}].element "${String(a.element)}" is not in the approved element set.`);
      } else {
        atomCounts[a.element] = (atomCounts[a.element] ?? 0) + 1;
      }
      if (typeof a.xPct !== 'number' || a.xPct < 5 || a.xPct > 95 || typeof a.yPct !== 'number' || a.yPct < 5 || a.yPct > 95) {
        errors.push(`covalent-bonding atoms[${i}] xPct/yPct must be numbers between 5 and 95.`);
      }
    }

    // Validate formulaDisplay matches declared atoms
    if (typeof obj.formulaDisplay === 'string' && Object.keys(atomCounts).length > 0) {
      const parsed = parseDisplayElementCounts(obj.formulaDisplay);
      if (parsed) {
        const allSyms = new Set([...Object.keys(atomCounts), ...Object.keys(parsed)]);
        for (const s of allSyms) {
          if ((atomCounts[s] ?? 0) !== (parsed[s] ?? 0)) {
            errors.push(
              `covalent-bonding formulaDisplay "${obj.formulaDisplay}" does not match declared atoms for element "${s}" (display: ${parsed[s] ?? 0}, atoms: ${atomCounts[s] ?? 0}).`,
            );
          }
        }
      }
    }

    // Reject odd-electron radicals cleanly
    if (typeof netCharge === 'number') {
      const totalV = computeExpectedValenceElectrons(obj.atoms as CovalentAtomNode[], netCharge);
      if (totalV === null || totalV <= 0 || totalV % 2 !== 0) {
        errors.push(
          `covalent-bonding species has ${String(totalV)} valence electrons; odd-electron radicals are outside the Step 4E Lewis model.`,
        );
      }
    }

    if (
      !Array.isArray(obj.allowedBondOrders) ||
      obj.allowedBondOrders.length === 0 ||
      obj.allowedBondOrders.some((o) => o !== 1 && o !== 2 && o !== 3)
    ) {
      errors.push('covalent-bonding "allowedBondOrders" must be a non-empty subset of [1, 2, 3].');
    }

    for (const bondField of ['initialBonds', 'referenceBonds'] as const) {
      const rawBonds = obj[bondField];
      if (rawBonds === undefined) continue;
      if (!Array.isArray(rawBonds) || rawBonds.length > COVALENT_LIMITS.maxBonds) {
        errors.push(`covalent-bonding "${bondField}" must contain at most ${COVALENT_LIMITS.maxBonds} bonds.`);
        continue;
      }
      const seen = new Set<string>();
      for (let i = 0; i < rawBonds.length; i++) {
        const b = rawBonds[i] as Record<string, unknown>;
        if (!b || typeof b !== 'object' || Array.isArray(b)) {
          errors.push(`covalent-bonding ${bondField}[${i}] must be an object.`);
          continue;
        }
        checkAllowed(b, BOND_DEF_KEYS, `covalent-bonding.${bondField}[${i}]`, errors);
        const from = b.from as string;
        const to = b.to as string;
        if (!atomIds.has(from) || !atomIds.has(to)) {
          errors.push(`covalent-bonding ${bondField}[${i}] references unknown atom "${from}" or "${to}".`);
        } else if (from === to) {
          errors.push(`covalent-bonding ${bondField}[${i}] cannot be a self-bond on "${from}".`);
        } else {
          const pk = from < to ? `${from}|${to}` : `${to}|${from}`;
          if (seen.has(pk)) {
            errors.push(`Duplicate bond between "${from}" and "${to}" in ${bondField}.`);
          }
          seen.add(pk);
        }
        if (b.order !== 1 && b.order !== 2 && b.order !== 3) {
          errors.push(`covalent-bonding ${bondField}[${i}].order must be 1, 2, or 3.`);
        }
      }
    }
    return;
  }

  // molecular-geometry
  checkAllowed(obj, MOLECULAR_GEOMETRY_KEYS, 'atom-bond-builder(molecular-geometry)', errors);
  if (typeof obj.moleculeFormula !== 'string' || obj.moleculeFormula.trim().length < 2) {
    errors.push('molecular-geometry "moleculeFormula" must be a non-empty string.');
  }
  const central = typeof obj.centralElement === 'string' ? getElementBySymbol(obj.centralElement) : null;
  if (!central) {
    errors.push(`molecular-geometry "centralElement" "${String(obj.centralElement)}" is not in the approved element set.`);
  }
  if (
    !Array.isArray(obj.surroundingElements) ||
    obj.surroundingElements.length < 2 ||
    obj.surroundingElements.length > 6 ||
    obj.surroundingElements.some((s) => typeof s !== 'string' || !APPROVED_ELEMENTS[s])
  ) {
    errors.push('molecular-geometry "surroundingElements" must contain 2 to 6 approved element symbols.');
  }
  const bd = obj.targetBondingDomains;
  const lp = obj.targetLonePairs;
  if (typeof bd !== 'number' || !Number.isInteger(bd) || bd < 2 || bd > 6) {
    errors.push('molecular-geometry "targetBondingDomains" must be an integer 2..6.');
  }
  if (typeof lp !== 'number' || !Number.isInteger(lp) || lp < 0 || lp > 3) {
    errors.push('molecular-geometry "targetLonePairs" must be an integer 0..3.');
  }
  if (typeof bd === 'number' && typeof lp === 'number') {
    if (Array.isArray(obj.surroundingElements) && obj.surroundingElements.length !== bd) {
      errors.push(`molecular-geometry surroundingElements length (${obj.surroundingElements.length}) must equal targetBondingDomains (${bd}).`);
    }
    const ref = lookupVseprEntry(bd, lp);
    if (!ref) {
      errors.push(`molecular-geometry AX${bd}E${lp} is not a supported VSEPR combination (steric number must be 2..6).`);
    } else {
      if (obj.targetElectronGeometry !== ref.electronGeometry) {
        errors.push(`molecular-geometry targetElectronGeometry "${String(obj.targetElectronGeometry)}" conflicts with AX${bd}E${lp} (expected "${ref.electronGeometry}").`);
      }
      if (obj.targetMolecularShape !== ref.molecularShape) {
        errors.push(`molecular-geometry targetMolecularShape "${String(obj.targetMolecularShape)}" conflicts with AX${bd}E${lp} (expected "${ref.molecularShape}").`);
      }
    }
  }
  if (typeof obj.targetElectronGeometry !== 'string' || !VALID_SHAPES.has(obj.targetElectronGeometry as VseprShapeId)) {
    errors.push('molecular-geometry "targetElectronGeometry" must be a supported VSEPR shape.');
  }
  if (typeof obj.targetMolecularShape !== 'string' || !VALID_SHAPES.has(obj.targetMolecularShape as VseprShapeId)) {
    errors.push('molecular-geometry "targetMolecularShape" must be a supported VSEPR shape.');
  }
  if (typeof obj.targetBondAngleLabel !== 'string' || obj.targetBondAngleLabel.trim().length < 2) {
    errors.push('molecular-geometry "targetBondAngleLabel" must be a non-empty string.');
  }
}
