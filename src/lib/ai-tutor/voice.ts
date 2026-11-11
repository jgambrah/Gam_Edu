/**
 * Dr. Gam voice helpers.
 *
 * Voice is OPTIONAL: it stays off until the student asks for it — with the header toggle,
 * the speaker button on a reply, or by typing a request such as "read it aloud".
 * Everything here is pure (no React), so it can be unit tested.
 */

export const AUTO_VOICE_STORAGE_KEY = 'drgam.autoVoice';

export type VoiceCommand =
  /** Read every new reply aloud from now on. */
  | 'enable'
  /** Stop talking and stop reading new replies aloud. */
  | 'disable'
  /** Read the latest tutor reply aloud once, without changing the setting. */
  | 'read-last';

/** Returns the student's saved auto-voice choice. Defaults to OFF. */
export function loadAutoVoicePreference(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(AUTO_VOICE_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

/** Remembers the student's auto-voice choice on this device. */
export function saveAutoVoicePreference(enabled: boolean): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(AUTO_VOICE_STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Private mode or blocked storage: the choice simply lasts for this visit only.
  }
}

const POLITE_WORDS = /\b(please|pls|plz|kindly|dr\.? gam|doctor gam|hey|hi|hello|thanks|thank you|now|again)\b/g;
const LEAD_INS = /^(can|could|would|will) you\s+|^i (want|would like|need) you to\s+|^i (want|would like|need)\s+/;

const SOUND = '(voice|audio|sound|speech|speaker|auto ?voice|auto ?speak|talking|speaking|reading)';

const DISABLE_PATTERNS: RegExp[] = [
  new RegExp(`^(stop|mute|turn off|switch off|disable|no|no more|cancel|remove) (the |your |that )?${SOUND}$`),
  new RegExp(`^(turn|switch) (the |your |that )?${SOUND} off$`),
  new RegExp(`^${SOUND} off$`),
  /^(stop|quit) (talking|speaking|reading)( to me| aloud| out loud)?$/,
  /^(dont|do not|stop) (talk|speak|read)( to me)?( aloud| out loud)?$/,
  /^(mute|be quiet|quiet|silence|shh+|text only|no talking)$/,
];

const ENABLE_PATTERNS: RegExp[] = [
  new RegExp(`^(turn on|switch on|enable|use|start|activate) (the |your |that )?${SOUND}$`),
  new RegExp(`^(turn|switch) (the |your |that )?${SOUND} on$`),
  new RegExp(`^${SOUND} on$`),
  /^(unmute|talk to me|speak to me)$/,
  /^(always )?(read|say|speak) (all |every )?(your |the )?(answers?|replies|reply|responses?|messages?|everything) (aloud|out loud|to me)$/,
  /^always read (aloud|out loud)$/,
];

const READ_LAST_PATTERNS: RegExp[] = [
  /^(read|say|speak|play) (it|that|this)( to me)?( aloud| out loud| out)?$/,
  /^(read|say|speak) (it |that |this )?(aloud|out loud|out)( to me)?$/,
  /^(read|say|speak) (that|it|this) (to me )?(aloud|out loud)$/,
  /^(let me|i want to) (hear|listen to) (it|that|this)$/,
  /^(listen|play audio|play it|play that)$/,
];

/**
 * Detects a short voice request typed (or dictated) into the chat, e.g. "turn on voice",
 * "stop talking", "read it aloud".
 *
 * It is deliberately strict: the WHOLE message has to be the request. A real study question
 * that merely mentions voice ("What is the active voice in English?") returns null and is
 * sent to the tutor as normal.
 */
export function detectVoiceCommand(message: string): VoiceCommand | null {
  if (!message) return null;

  const normalised = message
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(POLITE_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(LEAD_INS, '')
    .trim();

  if (!normalised || normalised.split(' ').length > 8) return null;

  if (DISABLE_PATTERNS.some((p) => p.test(normalised))) return 'disable';
  if (ENABLE_PATTERNS.some((p) => p.test(normalised))) return 'enable';
  if (READ_LAST_PATTERNS.some((p) => p.test(normalised))) return 'read-last';
  return null;
}

/** Turns a LaTeX-ish maths snippet into words a speech engine reads naturally. */
function speakMaths(tex: string): string {
  return tex
    .replace(/\\(?:d|t)?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, ' $1 over $2 ')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, ' the square root of $1 ')
    .replace(/\^\s*\{?\s*2\s*\}?/g, ' squared ')
    .replace(/\^\s*\{?\s*3\s*\}?/g, ' cubed ')
    .replace(/\^\s*\{([^{}]*)\}/g, ' to the power of $1 ')
    .replace(/\^\s*(\w+)/g, ' to the power of $1 ')
    .replace(/_\s*\{([^{}]*)\}/g, ' $1 ')
    .replace(/_\s*(\w)/g, ' $1 ')
    .replace(/\\times|\\cdot|×|\*/g, ' times ')
    .replace(/\\div|÷/g, ' divided by ')
    .replace(/\\pm|±/g, ' plus or minus ')
    .replace(/\\neq|\\ne\b|≠/g, ' is not equal to ')
    .replace(/\\leq|\\le\b|≤/g, ' is less than or equal to ')
    .replace(/\\geq|\\ge\b|≥/g, ' is greater than or equal to ')
    .replace(/\\approx|≈/g, ' is approximately ')
    .replace(/\\pi\b|π/g, ' pi ')
    .replace(/\\%/g, ' percent ')
    .replace(/\\(?:text|mathrm|mathbf|mathit)\s*\{([^{}]*)\}/g, ' $1 ')
    .replace(/\\(?:left|right|,|;|!|quad|qquad| )/g, ' ')
    // A dash at the start or straight after an operator is a negative number, not subtraction.
    .replace(/(^|[=+(,<>])\s*[-−]\s*(\w)/g, '$1 negative $2')
    .replace(/</g, ' is less than ')
    .replace(/>/g, ' is greater than ')
    .replace(/=/g, ' equals ')
    .replace(/\+/g, ' plus ')
    .replace(/(\d|\w|\))\s*\/\s*(\d|\w|\()/g, '$1 divided by $2')
    // A dash between two terms is subtraction.
    .replace(/(\w|\))\s*[-−]\s*(\w|\()/g, '$1 minus $2')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}\\]/g, ' ');
}

/**
 * Prepares a tutor reply for text-to-speech: drops emojis and Markdown symbols and reads
 * maths as words ("$x + 5 = 12$" → "x plus 5 equals 12"), so students hear the lesson and
 * not the punctuation.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';

  return (
    text
      .replace(/SHOW BOARD:\s*\w+/gi, ' ')
      // Maths: display ($$…$$) first, then inline ($…$).
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex: string) => ` ${speakMaths(tex)} `)
      .replace(/\$([^$\n]+?)\$/g, (_, tex: string) => ` ${speakMaths(tex)} `)
      // Markdown links and images keep only their label.
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      // List bullets and heading / quote markers at the start of a line.
      .replace(/^\s*(?:[-*•]|#{1,6}|>)\s+/gm, '')
      // Remaining Markdown emphasis and code marks.
      .replace(/[*#`_~]/g, '')
      // Emojis, their modifiers and joiners.
      .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}‍️⃣]/gu, ' ')
      .replace(/\s+([.,!?;:])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
}
