import type { PronunciationDictionary, PronunciationEntry } from './types';

/**
 * Starter Ghanaian pronunciation dictionary.
 *
 * STATUS OF EVERY ENTRY: `needs-native-review`. The respellings below are CANDIDATES written by a non-native drafter from
 * widely known English renderings of these names. They have NOT been verified by a native speaker, they are NOT IPA, and
 * Akan is a tonal language, which no respelling or current general-purpose speech engine can express. They exist so the
 * pipeline can be exercised and so a native speaker has something concrete to correct. Until an entry is verified,
 * `usableForPublishedAudio` returns false and the readiness check treats narration that uses it as unreviewed.
 *
 * What IS well established and safe to state: the Akan day-name system (a child is named for the day of birth) and the
 * day each name below belongs to.
 */
const AKAN = 'Akan (Twi/Fante)';
const entry = (e: Omit<PronunciationEntry, 'status' | 'engines'> & { respell: string; hint: string; reviewerNotes: string[] }): PronunciationEntry => {
  const { respell, hint, ...rest } = e;
  return {
    ...rest,
    status: 'needs-native-review',
    engines: {
      browser: { kind: 'respell', text: respell, candidate: true },
      espeak: { kind: 'respell', text: respell, candidate: true },
      'gemini-tts': { kind: 'prompt-hint', text: hint, candidate: true },
      // cloud-tts: deliberately absent. SSML <phoneme> needs verified IPA, which nobody has supplied yet.
    },
  };
};

export const GHANAIAN_PRONUNCIATIONS: PronunciationDictionary = {
  version: 1,
  entries: [
    entry({ id: 'efua', written: 'Efua', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a girl born on Friday',
      guidance: 'Candidate: three soft syllables, "eh-FOO-ah". A two-syllable "EH-fwah" is also heard in English speech.',
      respell: 'eh-foo-ah', hint: 'Efua is a Ghanaian (Akan) girl’s name; say it as three syllables, roughly "eh-FOO-ah".',
      reviewerNotes: ['Choose between "eh-FOO-ah" (3 syllables) and "EH-fwah" (2) for the narrator voice.', 'Supply IPA and mark tone if wanted.'] }),
    entry({ id: 'kwame', written: 'Kwame', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a boy born on Saturday',
      guidance: 'Candidate: "KWAH-meh". English speakers often say "KWAH-mee"; confirm the final vowel.',
      respell: 'kwah-meh', hint: 'Kwame is a Ghanaian (Akan) boy’s name; say "KWAH-meh", with a short "eh" at the end.',
      reviewerNotes: ['Confirm final vowel (meh vs mee) and the "kw" onset.'] }),
    entry({ id: 'kofi', written: 'Kofi', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a boy born on Friday',
      guidance: 'Candidate: "KOH-fee".', respell: 'koh-fee', hint: 'Kofi is a Ghanaian (Akan) boy’s name; say "KOH-fee".',
      reviewerNotes: ['Confirm the vowel in the first syllable (oh vs aw).'] }),
    entry({ id: 'kwabena', written: 'Kwabena', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a boy born on Tuesday',
      guidance: 'Candidate: "kwah-BEH-nah".', respell: 'kwah-beh-nah', hint: 'Kwabena is a Ghanaian (Akan) boy’s name; say "kwah-BEH-nah".',
      reviewerNotes: ['Confirm stress and final vowel.'] }),
    entry({ id: 'akosua', written: 'Akosua', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a girl born on Sunday',
      guidance: 'Candidate: "ah-KOH-swah"; a three-syllable "ah-KOH-soo-ah" may be more accurate.',
      respell: 'ah-koh-swah', hint: 'Akosua is a Ghanaian (Akan) girl’s name; say roughly "ah-KOH-swah".',
      reviewerNotes: ['Two or three syllables at the end? Please decide.'] }),
    entry({ id: 'adwoa', written: 'Adwoa', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a girl born on Monday',
      guidance: 'Candidate: "ah-JWAH". The "dw" is the hard part for English engines and is probably not a plain "d" + "w".',
      respell: 'ah-jwah', hint: 'Adwoa is a Ghanaian (Akan) girl’s name; roughly "ah-JWAH" (the "dw" is a soft "j" blended with "w").',
      reviewerNotes: ['HIGH RISK: the "dw" cluster. Native speaker to demonstrate and approve a rendering.'] }),
    entry({ id: 'yaa', written: 'Yaa', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a girl born on Thursday',
      guidance: 'Candidate: a single long "YAAH" (the double a marks a long vowel).',
      respell: 'yaah', hint: 'Yaa is a Ghanaian (Akan) girl’s name; one syllable, a long "YAAH".',
      reviewerNotes: ['Confirm vowel length; engines may shorten it to "ya".'] }),
    entry({ id: 'nhyira', written: 'Nhyira', kind: 'personal-name', language: AKAN, meaning: 'Twi word meaning "blessing", also used as a name',
      guidance: 'Candidate: roughly "NYEE-rah" with a breathy start. The "nhy" onset has no English equivalent.',
      respell: 'nyee-rah', hint: 'Nhyira is a Twi word and name meaning "blessing"; roughly "NYEE-rah" with a soft breathy start.',
      reviewerNotes: ['HIGH RISK: "nhy" onset; the respelling is only an approximation. Needs a native demonstration.'] }),
    entry({ id: 'dede', written: 'Dede', kind: 'personal-name', language: 'Ewe / Ga (to confirm)', meaning: 'A first-name used for a first-born child in some Ghanaian communities (to confirm)',
      guidance: 'Candidate: "DEH-deh".', respell: 'deh-deh', hint: 'Dede is a Ghanaian first name; say "DEH-deh".',
      reviewerNotes: ['Confirm language of origin and meaning before it appears in teacher notes.'] }),
    entry({ id: 'ama', written: 'Ama', kind: 'personal-name', language: AKAN, meaning: 'Akan day name for a girl born on Saturday',
      guidance: 'Candidate: "AH-mah".', respell: 'ah-mah', hint: 'Ama is a Ghanaian (Akan) girl’s name; say "AH-mah".',
      reviewerNotes: ['Confirm vowel quality and whether the final syllable is stressed.'] }),
    entry({ id: 'mensah', written: 'Mensah', kind: 'personal-name', language: AKAN, meaning: 'Akan family name (meaning and day association to be confirmed)',
      guidance: 'Candidate: "MEN-sah".', respell: 'men-sah', hint: 'Mensah is a Ghanaian (Akan) family name; say "MEN-sah".',
      reviewerNotes: ['Confirm pronunciation and spelling variants (Mensah/Mensa).'] }),
    entry({ id: 'nana', written: 'Nana', kind: 'word', language: AKAN, meaning: 'A respectful title for an elder or grandparent',
      guidance: 'Candidate: "NAH-nah".', respell: 'nah-nah', hint: '"Nana" is an Akan title of respect for an elder; say "NAH-nah".',
      reviewerNotes: ['Confirm.'] }),
    entry({ id: 'cedi', written: 'cedi', kind: 'word', language: 'Ghanaian English', meaning: 'The currency of Ghana',
      guidance: 'Candidate: "SEE-dee".', respell: 'see-dee', hint: '"Cedi" is Ghana’s currency; say "SEE-dee".',
      reviewerNotes: ['Confirm everyday Ghanaian English pronunciation.'] }),
    entry({ id: 'cedis', written: 'cedis', kind: 'word', language: 'Ghanaian English', meaning: 'Plural of cedi',
      guidance: 'Candidate: "SEE-deez".', respell: 'see-deez', hint: '"Cedis" is the plural of Ghana’s currency; say "SEE-deez".',
      reviewerNotes: ['Confirm.'] }),
    entry({ id: 'pesewas', written: 'pesewas', kind: 'word', language: 'Ghanaian English', meaning: 'Plural of pesewa, one hundredth of a cedi',
      guidance: 'Candidate: "peh-SEH-wahz".', respell: 'peh-seh-wahz', hint: '"Pesewas" are Ghana’s small coins; say "peh-SEH-wahz".',
      reviewerNotes: ['Confirm.'] }),
    entry({ id: 'nkate', written: 'nkate', kind: 'word', language: 'Akan (Twi)', meaning: 'Groundnut / peanut (Twi "nkatie"); used here in "nkate cake" (to confirm spelling)',
      guidance: 'Candidate: "n-KAH-teh", with a brief syllabic "n".', respell: 'en-kah-teh', hint: '"nkate" is the Twi word for groundnut; say "n-KAH-teh".',
      reviewerNotes: ['Confirm spelling (nkate / nkatie) and pronunciation before this term is used in a published story.'] }),
    entry({ id: 'kenkey', written: 'kenkey', kind: 'word', language: 'Ga', meaning: 'A fermented maize dish', guidance: 'Candidate: "KEN-kee".',
      respell: 'ken-kee', hint: '"Kenkey" is a Ghanaian maize dish; say "KEN-kee".', reviewerNotes: ['Confirm.'] }),
    entry({ id: 'accra', written: 'Accra', kind: 'place', language: 'Ghanaian English', meaning: 'Capital city of Ghana',
      guidance: 'Candidate: Ghanaians often say "uh-KRAH" (stress on the second syllable).', respell: 'ah-krah', hint: 'Accra is the capital of Ghana; say "uh-KRAH".', reviewerNotes: ['Confirm stress.'] }),
    entry({ id: 'kumasi', written: 'Kumasi', kind: 'place', language: AKAN, meaning: 'City in the Ashanti Region',
      guidance: 'Candidate: "koo-MAH-see".', respell: 'koo-mah-see', hint: 'Kumasi is a city in Ghana; say "koo-MAH-see".', reviewerNotes: ['Confirm.'] }),
  ],
};
