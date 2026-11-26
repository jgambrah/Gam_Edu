/**
 * GAM EDU — Step 4D Domain 3: Pure TypeScript Biological Sequence & Inheritance Engine
 *
 * Supports four distinct bounded biological construction modes without conflating rules:
 * 1. 'dna-base-pairing'   : Antiparallel DNA complementary base pairing (A<->T, C<->G)
 * 2. 'dna-to-mrna'        : Transcription from 3'->5' DNA template strand to 5'->3' mRNA (A->U, T->A, C<->G)
 * 3. 'mrna-translation'   : Standard 64-codon genetic code translation (5'->3' mRNA -> N- to C-terminus polypeptide;
 *                           handles AUG start & UAA/UAG/UGA stop codons without assigning an amino acid to STOP)
 * 4. 'monohybrid-punnett' : Gamete formation & 2x2 allele pairing with probability-based genotype/phenotype ratios
 */

export type BioSequenceMode =
  | 'dna-base-pairing'
  | 'dna-to-mrna'
  | 'mrna-translation'
  | 'monohybrid-punnett';

export const BIO_SEQUENCE_LIMITS = {
  minSequenceLength: 3,
  maxSequenceLength: 24,
  maxCodons: 8,
} as const;

export const DNA_COMPLEMENT: Readonly<Record<string, string>> = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

export const DNA_TO_MRNA_COMPLEMENT: Readonly<Record<string, string>> = {
  A: 'U',
  T: 'A',
  C: 'G',
  G: 'C',
};

/** Standard nuclear genetic code (5' -> 3' mRNA codons). STOP codons map to 'STOP' (never an amino acid). */
export const STANDARD_GENETIC_CODE: Readonly<Record<string, string>> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP',
  UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
};

export function computeExpectedDnaComplement(template: readonly string[]): string[] {
  return template.map((b) => DNA_COMPLEMENT[b] ?? '?');
}

export function computeExpectedMrnaFromTemplate(dnaTemplate: readonly string[]): string[] {
  return dnaTemplate.map((b) => DNA_TO_MRNA_COMPLEMENT[b] ?? '?');
}

export interface TranslationReferenceResult {
  codons: string[];
  expectedTokens: string[];
  aminoAcids: string[];
  terminatedAtStop: boolean;
  stopCodonIndex: number | null;
}

/**
 * Translates a 5'->3' mRNA base sequence in reading frame 0.
 * Stops translation upon encountering a STOP codon (UAA, UAG, UGA): STOP is represented as
 * the termination marker 'STOP' and NO amino acid is assigned to or after a stop codon.
 */
export function translateMrnaCodons(mrnaBases: readonly string[]): TranslationReferenceResult {
  const codons: string[] = [];
  for (let i = 0; i + 2 < mrnaBases.length; i += 3) {
    codons.push(`${mrnaBases[i]}${mrnaBases[i + 1]}${mrnaBases[i + 2]}`);
  }
  const expectedTokens: string[] = [];
  const aminoAcids: string[] = [];
  let terminatedAtStop = false;
  let stopCodonIndex: number | null = null;

  for (let idx = 0; idx < codons.length; idx++) {
    const aa = STANDARD_GENETIC_CODE[codons[idx]] ?? '?';
    expectedTokens.push(aa);
    if (aa === 'STOP') {
      terminatedAtStop = true;
      stopCodonIndex = idx;
      break;
    }
    aminoAcids.push(aa);
  }

  return { codons, expectedTokens, aminoAcids, terminatedAtStop, stopCodonIndex };
}

export interface SequenceCheckResult {
  passed: boolean;
  matchedCount: number;
  totalExpected: number;
  perSlotCorrect: boolean[];
  misconceptionMessages: string[];
  feedback: string;
}

export function evaluateBaseSequence(
  mode: 'dna-base-pairing' | 'dna-to-mrna',
  template: readonly string[],
  studentTokens: readonly (string | null)[],
): SequenceCheckResult {
  const expected =
    mode === 'dna-base-pairing'
      ? computeExpectedDnaComplement(template)
      : computeExpectedMrnaFromTemplate(template);

  const perSlotCorrect: boolean[] = [];
  const misconceptions = new Set<string>();
  let matched = 0;

  for (let i = 0; i < expected.length; i++) {
    const pick = studentTokens[i];
    const ok = pick === expected[i];
    perSlotCorrect.push(ok);
    if (ok) {
      matched++;
    } else if (pick) {
      if (mode === 'dna-to-mrna' && pick === 'T') {
        misconceptions.add('Thymine (T) is found in DNA, not RNA. Pair DNA Adenine (A) with Uracil (U) in mRNA.');
      } else if (mode === 'dna-base-pairing' && pick === 'U') {
        misconceptions.add('Uracil (U) occurs in RNA, not DNA. In DNA, Adenine (A) pairs with Thymine (T).');
      }
    }
  }

  const passed = matched === expected.length;
  const feedback = passed
    ? mode === 'dna-base-pairing'
      ? 'Correct! Antiparallel complementary DNA strand assembled with A–T (2 H-bonds) and C–G (3 H-bonds) pairing.'
      : 'Correct! Complementary 5′→3′ mRNA transcript synthesised from the 3′→5′ DNA template strand using Uracil (U) opposite Adenine (A).'
    : misconceptions.size > 0
      ? Array.from(misconceptions).join(' ')
      : `${matched} of ${expected.length} bases matched. Check complementary base-pairing rules and antiparallel orientation.`;

  return {
    passed,
    matchedCount: matched,
    totalExpected: expected.length,
    perSlotCorrect,
    misconceptionMessages: Array.from(misconceptions),
    feedback,
  };
}

export function evaluateMrnaTranslation(
  mrnaBases: readonly string[],
  studentTokens: readonly (string | null)[],
): SequenceCheckResult {
  const ref = translateMrnaCodons(mrnaBases);
  const perSlotCorrect: boolean[] = [];
  const misconceptions = new Set<string>();
  let matched = 0;

  for (let i = 0; i < ref.expectedTokens.length; i++) {
    const pick = studentTokens[i];
    const exp = ref.expectedTokens[i];
    const ok = pick === exp;
    perSlotCorrect.push(ok);
    if (ok) {
      matched++;
    } else if (exp === 'STOP' && pick && pick !== 'STOP') {
      misconceptions.add(
        `Codon ${ref.codons[i]} is a stop codon: it signals translation termination and does NOT code for an amino acid.`,
      );
    }
  }

  const passed = matched === ref.expectedTokens.length;
  const peptideCount = Math.max(0, ref.aminoAcids.length - 1);
  const feedback = passed
    ? `Correct! Polypeptide assembled in N-terminus → C-terminus order (${ref.aminoAcids.join('–')}), joined by ${peptideCount} peptide bond(s) formed via condensation reactions${ref.terminatedAtStop ? ', terminating cleanly at the STOP codon.' : '.'}`
    : misconceptions.size > 0
      ? Array.from(misconceptions).join(' ')
      : `${matched} of ${ref.expectedTokens.length} codon positions matched. Read each 5′→3′ triplet in the standard genetic code table.`;

  return {
    passed,
    matchedCount: matched,
    totalExpected: ref.expectedTokens.length,
    perSlotCorrect,
    misconceptionMessages: Array.from(misconceptions),
    feedback,
  };
}

export function canonicaliseDiploidGenotype(allele1: string, allele2: string): string {
  const a1Upper = allele1 === allele1.toUpperCase() && allele1 !== allele1.toLowerCase();
  const a2Upper = allele2 === allele2.toUpperCase() && allele2 !== allele2.toLowerCase();
  if (!a1Upper && a2Upper) return `${allele2}${allele1}`;
  return `${allele1}${allele2}`;
}

export interface PunnettReferenceResult {
  parent1Gametes: [string, string];
  parent2Gametes: [string, string];
  expectedCells: [string, string, string, string]; // [r0c0, r0c1, r1c0, r1c1]
  genotypeProbabilities: Record<string, number>; // percentage 0..100
  dominantProbabilityPct: number;
  recessiveProbabilityPct: number;
}

export function computeMonohybridPunnett(
  parent1Genotype: string,
  parent2Genotype: string,
  dominantAllele: string,
): PunnettReferenceResult {
  const p1: [string, string] = [parent1Genotype[0], parent1Genotype[1]];
  const p2: [string, string] = [parent2Genotype[0], parent2Genotype[1]];
  const expectedCells: [string, string, string, string] = [
    canonicaliseDiploidGenotype(p1[0], p2[0]),
    canonicaliseDiploidGenotype(p1[0], p2[1]),
    canonicaliseDiploidGenotype(p1[1], p2[0]),
    canonicaliseDiploidGenotype(p1[1], p2[1]),
  ];

  const genotypeCounts: Record<string, number> = {};
  let dominantCount = 0;
  for (const g of expectedCells) {
    genotypeCounts[g] = (genotypeCounts[g] ?? 0) + 1;
    if (g.includes(dominantAllele)) dominantCount++;
  }

  const genotypeProbabilities: Record<string, number> = {};
  for (const [g, count] of Object.entries(genotypeCounts)) {
    genotypeProbabilities[g] = (count / 4) * 100;
  }

  return {
    parent1Gametes: p1,
    parent2Gametes: p2,
    expectedCells,
    genotypeProbabilities,
    dominantProbabilityPct: (dominantCount / 4) * 100,
    recessiveProbabilityPct: ((4 - dominantCount) / 4) * 100,
  };
}

export function evaluateMonohybridPunnett(
  parent1Genotype: string,
  parent2Genotype: string,
  dominantAllele: string,
  studentCells: readonly (string | null)[],
): SequenceCheckResult {
  const ref = computeMonohybridPunnett(parent1Genotype, parent2Genotype, dominantAllele);
  const perSlotCorrect: boolean[] = [];
  let matched = 0;

  for (let i = 0; i < 4; i++) {
    const raw = studentCells[i];
    const canonicalStudent = raw && raw.length === 2 ? canonicaliseDiploidGenotype(raw[0], raw[1]) : null;
    const ok = canonicalStudent === ref.expectedCells[i];
    perSlotCorrect.push(ok);
    if (ok) matched++;
  }

  const passed = matched === 4;
  const probSummary = Object.entries(ref.genotypeProbabilities)
    .map(([g, pct]) => `${g}: ${pct}%`)
    .join(', ');

  return {
    passed,
    matchedCount: matched,
    totalExpected: 4,
    perSlotCorrect,
    misconceptionMessages: [],
    feedback: passed
      ? `Correct! Offspring genotype probabilities: ${probSummary}. Under complete dominance, phenotype probability is ${ref.dominantProbabilityPct}% dominant and ${ref.recessiveProbabilityPct}% recessive (ratios represent probabilities per fertilisation event, not guaranteed counts).`
      : `${matched} of 4 Punnett squares matched. Combine one gamete allele from Parent 1 with one gamete allele from Parent 2 in each box.`,
  };
}
