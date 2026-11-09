import type { Activity, GlossaryEntry } from './premium';
import glossaryIndexJson from './story-glossary-index.json';

export interface WordHelpResult {
  word: string;
  definition: string;
  phonetic?: string;
  spokenText?: string;
  fromFallback?: boolean;
}

const INDEX = glossaryIndexJson as Record<string, { definition: string; phonetic?: string }>;

const clean = (w: string) =>
  w
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

const CONTRACTIONS: Record<string, string> = {
  "don't": 'Short for "do not" — used to say something does not happen or should not be done.',
  "doesn't": 'Short for "does not".',
  "didn't": 'Short for "did not" — used for something that did not happen in the past.',
  "can't": 'Short for "cannot" — not able to do something.',
  "couldn't": 'Short for "could not" — was not able to do something.',
  "won't": 'Short for "will not".',
  "wouldn't": 'Short for "would not".',
  "shouldn't": 'Short for "should not" — not wise or safe to do.',
  "isn't": 'Short for "is not".',
  "aren't": 'Short for "are not".',
  "wasn't": 'Short for "was not".',
  "weren't": 'Short for "were not".',
  "hasn't": 'Short for "has not".',
  "haven't": 'Short for "have not".',
  "hadn't": 'Short for "had not".',
  "mustn't": 'Short for "must not".',
  "it's": 'Short for "it is" or "it has".',
  "that's": 'Short for "that is" or "that has".',
  "what's": 'Short for "what is".',
  "who's": 'Short for "who is" or "who has".',
  "where's": 'Short for "where is".',
  "there's": 'Short for "there is".',
  "here's": 'Short for "here is".',
  "let's": 'Short for "let us" — an invitation to do something together.',
  "i'm": 'Short for "I am".',
  "i'll": 'Short for "I will".',
  "i've": 'Short for "I have".',
  "i'd": 'Short for "I would" or "I had".',
  "you're": 'Short for "you are".',
  "you'll": 'Short for "you will".',
  "you've": 'Short for "you have".',
  "you'd": 'Short for "you would" or "you had".',
  "we're": 'Short for "we are".',
  "we'll": 'Short for "we will".',
  "we've": 'Short for "we have".',
  "we'd": 'Short for "we would" or "we had".',
  "they're": 'Short for "they are".',
  "they'll": 'Short for "they will".',
  "they've": 'Short for "they have".',
  "they'd": 'Short for "they would" or "they had".',
  "he's": 'Short for "he is" or "he has".',
  "she's": 'Short for "she is" or "she has".',
  "he'll": 'Short for "he will".',
  "she'll": 'Short for "she will".',
  "he'd": 'Short for "he would" or "he had".',
  "she'd": 'Short for "she would" or "she had".',
};

const IRREGULAR_STEMS: Record<string, { base: string; note: string }> = {
  children: { base: 'child', note: 'Plural of child' },
  feet: { base: 'foot', note: 'Plural of foot' },
  teeth: { base: 'tooth', note: 'Plural of tooth' },
  mice: { base: 'mouse', note: 'Plural of mouse' },
  geese: { base: 'goose', note: 'Plural of goose' },
  men: { base: 'man', note: 'Plural of man' },
  women: { base: 'woman', note: 'Plural of woman' },
  leaves: { base: 'leaf', note: 'Plural of leaf (or present form of leave)' },
  halves: { base: 'half', note: 'Plural of half' },
  knives: { base: 'knife', note: 'Plural of knife' },
  wives: { base: 'wife', note: 'Plural of wife' },
  wolves: { base: 'wolf', note: 'Plural of wolf' },
  shelves: { base: 'shelf', note: 'Plural of shelf' },
  calves: { base: 'calf', note: 'Plural of calf' },
  loaves: { base: 'loaf', note: 'Plural of loaf' },
  thieves: { base: 'thief', note: 'Plural of thief' },
  sang: { base: 'sing', note: 'Past tense of sing' },
  sung: { base: 'sing', note: 'Past participle of sing' },
  rang: { base: 'ring', note: 'Past tense of ring' },
  rung: { base: 'ring', note: 'Past participle of ring' },
  drank: { base: 'drink', note: 'Past tense of drink' },
  drunk: { base: 'drink', note: 'Past participle of drink' },
  sank: { base: 'sink', note: 'Past tense of sink' },
  sunk: { base: 'sink', note: 'Past participle of sink' },
  swam: { base: 'swim', note: 'Past tense of swim' },
  swum: { base: 'swim', note: 'Past participle of swim' },
  began: { base: 'begin', note: 'Past tense of begin' },
  begun: { base: 'begin', note: 'Past participle of begin' },
  ran: { base: 'run', note: 'Past tense of run' },
  ate: { base: 'eat', note: 'Past tense of eat' },
  eaten: { base: 'eat', note: 'Past participle of eat' },
  fell: { base: 'fall', note: 'Past tense of fall' },
  fallen: { base: 'fall', note: 'Past participle of fall' },
  chose: { base: 'choose', note: 'Past tense of choose' },
  chosen: { base: 'choose', note: 'Past participle of choose' },
  froze: { base: 'freeze', note: 'Past tense of freeze' },
  frozen: { base: 'freeze', note: 'Past participle of freeze' },
  spoke: { base: 'speak', note: 'Past tense of speak' },
  spoken: { base: 'speak', note: 'Past participle of speak' },
  broke: { base: 'break', note: 'Past tense of break' },
  broken: { base: 'break', note: 'Past participle of break' },
  woke: { base: 'wake', note: 'Past tense of wake' },
  woken: { base: 'wake', note: 'Past participle of wake' },
  stole: { base: 'steal', note: 'Past tense of steal' },
  stolen: { base: 'steal', note: 'Past participle of steal' },
  wrote: { base: 'write', note: 'Past tense of write' },
  written: { base: 'write', note: 'Past participle of write' },
  rode: { base: 'ride', note: 'Past tense of ride' },
  ridden: { base: 'ride', note: 'Past participle of ride' },
  drove: { base: 'drive', note: 'Past tense of drive' },
  driven: { base: 'drive', note: 'Past participle of drive' },
  rose: { base: 'rise', note: 'Past tense of rise' },
  risen: { base: 'rise', note: 'Past participle of rise' },
  flew: { base: 'fly', note: 'Past tense of fly' },
  flown: { base: 'fly', note: 'Past participle of fly' },
  grew: { base: 'grow', note: 'Past tense of grow' },
  grown: { base: 'grow', note: 'Past participle of grow' },
  blew: { base: 'blow', note: 'Past tense of blow' },
  blown: { base: 'blow', note: 'Past participle of blow' },
  knew: { base: 'know', note: 'Past tense of know' },
  known: { base: 'know', note: 'Past participle of know' },
  threw: { base: 'throw', note: 'Past tense of throw' },
  thrown: { base: 'throw', note: 'Past participle of throw' },
  drew: { base: 'draw', note: 'Past tense of draw' },
  drawn: { base: 'draw', note: 'Past participle of draw' },
  wore: { base: 'wear', note: 'Past tense of wear' },
  worn: { base: 'wear', note: 'Past participle of wear' },
  tore: { base: 'tear', note: 'Past tense of tear' },
  torn: { base: 'tear', note: 'Past participle of tear' },
  dug: { base: 'dig', note: 'Past tense of dig' },
  spun: { base: 'spin', note: 'Past tense of spin' },
  won: { base: 'win', note: 'Past tense of win' },
  hung: { base: 'hang', note: 'Past tense of hang' },
  stung: { base: 'sting', note: 'Past tense of sting' },
  swung: { base: 'swing', note: 'Past tense of swing' },
  met: { base: 'meet', note: 'Past tense of meet' },
  fed: { base: 'feed', note: 'Past tense of feed' },
  led: { base: 'lead', note: 'Past tense of lead' },
  lit: { base: 'light', note: 'Past tense of light' },
  slid: { base: 'slide', note: 'Past tense of slide' },
  hid: { base: 'hide', note: 'Past tense of hide' },
  hidden: { base: 'hide', note: 'Past participle of hide' },
  bit: { base: 'bite', note: 'Past tense of bite' },
  bitten: { base: 'bite', note: 'Past participle of bite' },
  caught: { base: 'catch', note: 'Past tense of catch' },
  taught: { base: 'teach', note: 'Past tense of teach' },
  bought: { base: 'buy', note: 'Past tense of buy' },
  brought: { base: 'bring', note: 'Past tense of bring' },
  thought: { base: 'think', note: 'Past tense of think' },
  fought: { base: 'fight', note: 'Past tense of fight' },
  sought: { base: 'seek', note: 'Past tense of seek' },
  sent: { base: 'send', note: 'Past tense of send' },
  spent: { base: 'spend', note: 'Past tense of spend' },
  lent: { base: 'lend', note: 'Past tense of lend' },
  bent: { base: 'bend', note: 'Past tense of bend' },
  built: { base: 'build', note: 'Past tense of build' },
  slept: { base: 'sleep', note: 'Past tense of sleep' },
  swept: { base: 'sweep', note: 'Past tense of sweep' },
  kept: { base: 'keep', note: 'Past tense of keep' },
  wept: { base: 'weep', note: 'Past tense of weep' },
  crept: { base: 'creep', note: 'Past tense of creep' },
  leapt: { base: 'leap', note: 'Past tense of leap' },
  felt: { base: 'feel', note: 'Past tense of feel' },
  knelt: { base: 'kneel', note: 'Past tense of kneel' },
  meant: { base: 'mean', note: 'Past tense of mean' },
  learnt: { base: 'learn', note: 'Past tense of learn' },
  burnt: { base: 'burn', note: 'Past tense of burn' },
  heard: { base: 'hear', note: 'Past tense of hear' },
  sold: { base: 'sell', note: 'Past tense of sell' },
  told: { base: 'tell', note: 'Past tense of tell' },
  held: { base: 'hold', note: 'Past tense of hold' },
  stood: { base: 'stand', note: 'Past tense of stand' },
  understood: { base: 'understand', note: 'Past tense of understand' },
  paid: { base: 'pay', note: 'Past tense of pay' },
  laid: { base: 'lay', note: 'Past tense of lay' },
  said: { base: 'say', note: 'Past tense of say' },
  made: { base: 'make', note: 'Past tense of make' },
  shone: { base: 'shine', note: 'Past tense of shine' },
  lost: { base: 'lose', note: 'Past tense of lose' },
  found: { base: 'find', note: 'Past tense of find' },
  wound: { base: 'wind', note: 'Past tense of wind' },
  bound: { base: 'bind', note: 'Past tense of bind' },
  ground: { base: 'grind', note: 'Past tense of grind' },
};

/** Generate candidate base stems for a word and describe the inflection. */
function stemCandidates(w: string): Array<{ stem: string; label: string }> {
  const out: Array<{ stem: string; label: string }> = [];
  if (IRREGULAR_STEMS[w]) {
    out.push({ stem: IRREGULAR_STEMS[w].base, label: IRREGULAR_STEMS[w].note });
  }
  if (w.length <= 3) return out;

  // Plurals & 3rd-person singular (-ies, -ves, -es, -s)
  if (w.endsWith('ies') && w.length > 4) {
    out.push({ stem: w.slice(0, -3) + 'y', label: `Form of "${w.slice(0, -3)}y"` });
  }
  if (w.endsWith('ves') && w.length > 4) {
    out.push({ stem: w.slice(0, -3) + 'f', label: `Plural of "${w.slice(0, -3)}f"` });
    out.push({ stem: w.slice(0, -3) + 'fe', label: `Plural of "${w.slice(0, -3)}fe"` });
  }
  if (w.endsWith('es') && w.length > 4) {
    out.push({ stem: w.slice(0, -2), label: `Form of "${w.slice(0, -2)}"` });
    out.push({ stem: w.slice(0, -1), label: `Form of "${w.slice(0, -1)}"` });
  }
  if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) {
    out.push({ stem: w.slice(0, -1), label: `Plural or present form of "${w.slice(0, -1)}"` });
  }

  // Past tense (-ied, -ed, -d)
  if (w.endsWith('ied') && w.length > 4) {
    out.push({ stem: w.slice(0, -3) + 'y', label: `Past tense of "${w.slice(0, -3)}y"` });
  }
  if (w.endsWith('ed') && w.length > 4) {
    const base = w.slice(0, -2);
    out.push({ stem: base, label: `Past form of "${base}"` });
    out.push({ stem: base + 'e', label: `Past form of "${base}e"` });
    if (base.length >= 3 && base[base.length - 1] === base[base.length - 2]) {
      out.push({ stem: base.slice(0, -1), label: `Past form of "${base.slice(0, -1)}"` });
    }
  }

  // Present participle / gerund (-ying, -ing)
  if (w.endsWith('ying') && w.length > 5) {
    out.push({ stem: w.slice(0, -4) + 'ie', label: `"-ing" form of "${w.slice(0, -4)}ie"` });
  }
  if (w.endsWith('ing') && w.length > 5) {
    const base = w.slice(0, -3);
    out.push({ stem: base, label: `"-ing" form of "${base}"` });
    out.push({ stem: base + 'e', label: `"-ing" form of "${base}e"` });
    if (base.length >= 3 && base[base.length - 1] === base[base.length - 2]) {
      out.push({ stem: base.slice(0, -1), label: `"-ing" form of "${base.slice(0, -1)}"` });
    }
  }

  // Adverbs (-ily, -ally, -ly)
  if (w.endsWith('ily') && w.length > 5) {
    out.push({ stem: w.slice(0, -3) + 'y', label: `In a "${w.slice(0, -3)}y" way` });
  }
  if (w.endsWith('ally') && w.length > 6) {
    out.push({ stem: w.slice(0, -4) + 'al', label: `In a "${w.slice(0, -4)}al" way` });
  }
  if (w.endsWith('ly') && w.length > 4) {
    out.push({ stem: w.slice(0, -2), label: `In a "${w.slice(0, -2)}" way` });
    out.push({ stem: w.slice(0, -2) + 'le', label: `In a "${w.slice(0, -2)}le" way` });
  }

  // Comparatives & superlatives (-ier, -iest, -er, -est)
  if (w.endsWith('ier') && w.length > 5) {
    out.push({ stem: w.slice(0, -3) + 'y', label: `More "${w.slice(0, -3)}y"` });
  }
  if (w.endsWith('iest') && w.length > 6) {
    out.push({ stem: w.slice(0, -4) + 'y', label: `Most "${w.slice(0, -4)}y"` });
  }
  if (w.endsWith('er') && w.length > 4) {
    const base = w.slice(0, -2);
    out.push({ stem: base, label: `Related to "${base}"` });
    out.push({ stem: base + 'e', label: `Related to "${base}e"` });
    if (base.length >= 3 && base[base.length - 1] === base[base.length - 2]) {
      out.push({ stem: base.slice(0, -1), label: `Related to "${base.slice(0, -1)}"` });
    }
  }
  if (w.endsWith('est') && w.length > 5) {
    const base = w.slice(0, -3);
    out.push({ stem: base, label: `Most "${base}"` });
    out.push({ stem: base + 'e', label: `Most "${base}e"` });
    if (base.length >= 3 && base[base.length - 1] === base[base.length - 2]) {
      out.push({ stem: base.slice(0, -1), label: `Most "${base.slice(0, -1)}"` });
    }
  }

  // Derivational suffixes (-ness, -ful, -less, -ment, -able, -ible, -tion, -sion, -ous, -ive, -al, -ish, -y)
  const suffixes: Array<[string, (b: string) => string]> = [
    ['ness', (b) => `The quality or state of being "${b}"`],
    ['ful', (b) => `Full of or having "${b}"`],
    ['less', (b) => `Without "${b}"`],
    ['ment', (b) => `The action or result of "${b}"`],
    ['able', (b) => `Able to be "${b}"`],
    ['ible', (b) => `Able to be "${b}"`],
    ['tion', (b) => `The act or process of "${b}"`],
    ['ation', (b) => `The act or process of "${b}"`],
    ['sion', (b) => `The act or state of "${b}"`],
    ['ous', (b) => `Full of or having the quality of "${b}"`],
    ['ive', (b) => `Relating to or tending to "${b}"`],
    ['al', (b) => `Relating to "${b}"`],
    ['ish', (b) => `Somewhat like "${b}"`],
    ['y', (b) => `Having or covered with "${b}"`],
  ];
  for (const [suf, fn] of suffixes) {
    if (w.endsWith(suf) && w.length > suf.length + 2) {
      const b = w.slice(0, -suf.length);
      out.push({ stem: b, label: fn(b) });
      out.push({ stem: b + 'e', label: fn(b + 'e') });
      if (b.endsWith('i')) out.push({ stem: b.slice(0, -1) + 'y', label: fn(b.slice(0, -1) + 'y') });
    }
  }

  // Common prefixes (un-, re-, pre-, mis-, non-, over-, under-, dis-, out-)
  const prefixes: Array<[string, (b: string) => string]> = [
    ['un', (b) => `Not "${b}" or the opposite of "${b}"`],
    ['re', (b) => `"${b}" again`],
    ['pre', (b) => `Before "${b}"`],
    ['mis', (b) => `"${b}" wrongly or badly`],
    ['non', (b) => `Not "${b}"`],
    ['over', (b) => `Too much or above "${b}"`],
    ['under', (b) => `Beneath or below "${b}"`],
    ['dis', (b) => `Opposite of "${b}"`],
  ];
  for (const [pre, fn] of prefixes) {
    if (w.startsWith(pre) && w.length > pre.length + 3) {
      const b = w.slice(pre.length);
      out.push({ stem: b, label: fn(b) });
    }
  }

  return out;
}

/** Split a word into readable syllables for pronunciation & reading support. */
export function breakIntoSyllables(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 4) return w;
  const parts = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))*/g);
  return parts && parts.length > 1 ? parts.join('·') : w;
}

function findDirectMatch(
  w: string,
  glossary?: GlossaryEntry[],
  pageNumber?: number,
  activities?: Activity[],
): { definition: string; phonetic?: string } | undefined {
  if (!w) return undefined;

  // 1. Exact glossary match on current page
  if (glossary && pageNumber !== undefined) {
    const onPage = glossary.find((g) => clean(g.word) === w && g.pages.includes(pageNumber));
    if (onPage) return { definition: onPage.definition, phonetic: INDEX[w]?.phonetic };
  }

  // 2. Exact glossary match on any page of the current story
  if (glossary) {
    const anyPage = glossary.find((g) => clean(g.word) === w);
    if (anyPage) return { definition: anyPage.definition, phonetic: INDEX[w]?.phonetic };
  }

  // 3. Vocabulary activity match in the current story
  if (activities) {
    for (const a of activities) {
      if (a.type === 'vocabulary' && 'word' in a && 'definition' in a && clean((a as any).word) === w) {
        return { definition: (a as any).definition, phonetic: INDEX[w]?.phonetic };
      }
    }
  }

  // 4. Contractions
  if (CONTRACTIONS[w]) {
    return { definition: CONTRACTIONS[w] };
  }

  // 5. Global Story Spark glossary & children's dictionary index
  if (INDEX[w]) {
    return INDEX[w];
  }

  return undefined;
}

/**
 * Comprehensive word-help lookup for any tapped word in a story.
 * Resolves exact matches, possessives, contractions, morphological inflections,
 * hyphenated compounds, numbers, and contextual fallback so every word has helpful meaning.
 */
export function lookupWordHelp(
  token: string,
  options?: {
    glossary?: GlossaryEntry[];
    pageNumber?: number;
    activities?: Activity[];
    pageText?: string;
  },
): WordHelpResult {
  const rawDisplay = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '') || token.trim();
  const w = clean(token);
  const { glossary, pageNumber, activities } = options ?? {};

  if (!w) {
    return { word: rawDisplay, definition: 'A punctuation mark or symbol in the story.' };
  }

  // 1. Direct match
  const direct = findDirectMatch(w, glossary, pageNumber, activities);
  if (direct) {
    return {
      word: rawDisplay,
      definition: direct.definition,
      phonetic: direct.phonetic,
      spokenText: direct.phonetic || rawDisplay,
    };
  }

  // 2. Possessive form (e.g. "Ama's", "traveller's", "farmers'")
  if (w.endsWith("'s") || w.endsWith("s'")) {
    const owner = w.endsWith("'s") ? w.slice(0, -2) : w.slice(0, -1);
    const ownerMatch =
      findDirectMatch(owner, glossary, pageNumber, activities) ||
      stemCandidates(owner)
        .map((c) => findDirectMatch(c.stem, glossary, pageNumber, activities))
        .find(Boolean);
    if (ownerMatch) {
      return {
        word: rawDisplay,
        definition: `Belonging to ${owner}: ${ownerMatch.definition}`,
        phonetic: ownerMatch.phonetic,
        spokenText: rawDisplay,
      };
    }
  }

  // 3. Numbers, years, percentages, and measurements
  if (/^[\d,._]+(%|°c|cm|mm|km|kg|g|m|s)?$/i.test(w)) {
    return {
      word: rawDisplay,
      definition: `A number or measurement (${rawDisplay}) used to count, measure, or record an exact value in the story.`,
      spokenText: rawDisplay,
    };
  }

  // 4. Morphological stemmer match (plurals, past tense, -ing, -ly, -er, -est, prefixes/suffixes)
  for (const cand of stemCandidates(w)) {
    const stemMatch = findDirectMatch(cand.stem, glossary, pageNumber, activities);
    if (stemMatch) {
      return {
        word: rawDisplay,
        definition: `${cand.label}: ${stemMatch.definition}`,
        phonetic: stemMatch.phonetic,
        spokenText: rawDisplay,
      };
    }
    // Check two-step stem (e.g., "carefully" -> "careful" -> "care", or "scientist's" -> "scientists" -> "scientist")
    for (const sub of stemCandidates(cand.stem)) {
      const subMatch = findDirectMatch(sub.stem, glossary, pageNumber, activities);
      if (subMatch) {
        return {
          word: rawDisplay,
          definition: `${cand.label}: ${subMatch.definition}`,
          phonetic: subMatch.phonetic,
          spokenText: rawDisplay,
        };
      }
    }
  }

  // 5. Hyphenated compound words (e.g. "fourteen-year-old", "hand-painted", "power-cut")
  if (w.includes('-')) {
    const parts = w.split('-').map(clean).filter(Boolean);
    const partMeanings: string[] = [];
    for (const p of parts) {
      const m =
        findDirectMatch(p, glossary, pageNumber, activities) ||
        stemCandidates(p)
          .map((c) => findDirectMatch(c.stem, glossary, pageNumber, activities))
          .find(Boolean);
      if (m) {
        partMeanings.push(`"${p}" (${m.definition.replace(/\.$/, '')})`);
      }
    }
    if (partMeanings.length > 0) {
      return {
        word: rawDisplay,
        definition: `A compound word combining ${partMeanings.join(' + ')}.`,
        spokenText: rawDisplay.replace(/-/g, ' '),
      };
    }
  }

  // 6. Contextual fallback (syllable guide + role in the story sentence; upgraded asynchronously if online)
  const syllables = breakIntoSyllables(rawDisplay);
  const isCapitalized = /^\p{Lu}/u.test(rawDisplay);
  if (isCapitalized) {
    return {
      word: rawDisplay,
      definition: `A name, place, or title in this story (say it slowly: ${syllables}).`,
      phonetic: syllables,
      spokenText: rawDisplay,
      fromFallback: true,
    };
  }

  return {
    word: rawDisplay,
    definition: `Story word (say it in parts: ${syllables}). Listen to how it fits the sentence on this page.`,
    phonetic: syllables,
    spokenText: rawDisplay,
    fromFallback: true,
  };
}

