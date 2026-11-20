/**
 * Deterministic child-safeguarding pre-check for Ask Teacher.
 * Runs BEFORE any LLM call so a safety-blocked prompt NEVER falls through to a science FAQ.
 * Privacy rule: callers must NEVER log the student's question text — log trigger counts only.
 */

export const SAFEGUARDING_PATTERNS: readonly RegExp[] = [
  // Self-harm / suicide (standard & Ghanaian English / Pidgin)
  /\b(kill|hurt|harm|cut|hang|end)\s+(myself|my\s*self|my\s+life)\b/i,
  /\b(suicide|suicidal|self[- ]?harm)\b/i,
  /\b(want\s+to\s+die|wanna\s+die|wan\s+die|wish\s+i\s+(was|were)\s+dead|(?:don'?t|do\s+not)\s+want\s+to\s+live|no\s+want\s+live|tired\s+of\s+living)\b/i,
  // Physical / sexual / emotional abuse & domestic fear (standard & Ghanaian English / Pidgin)
  /\b(scared|afraid|frightened|terrified|unsafe)\s+(at\s+home|to\s+go\s+home|of\s+my\s+(dad|father|mum|mom|mother|uncle|aunt|aunty|stepfather|stepmother|teacher))\b/i,
  /\b(hits?|hitting|beats?|beating|slaps?|slapping|hurts?|hurting|harms?|harming|abuses?|abusing|touches?|touching|touched|molests?|molesting)\s+me\b/i,
  /\b(dey\s+(beat|hit|hurt|slap|touch|abuse)\s+me)\b/i,
  /\b(being\s+(abused|bullied|beaten|hit|hurt|touched|molested))\b/i,
  /\b(am|i'?m)\s+(being\s+)?(beaten|hit|abused|bullied|molested)\b/i,
  /\b(touched|touches|touching)\s+my\s+(private|body)\b/i,
  /\b(nobody\s+loves\s+me|no\s+one\s+cares\s+if\s+i\s+die)\b/i,
];

export const SAFEGUARDING_RESPONSE =
  'I am really sorry you are going through something hard, and I am glad you spoke up. You deserve to be safe. Please tell a trusted adult right away — such as your classroom teacher, head teacher, school counsellor, or a parent or relative you trust — so they can help you today.';

export const SAFETY_BLOCK_FALLBACK_RESPONSE =
  'I could not answer that question directly. If you are worried or need help with something personal, please speak to a trusted adult or your classroom teacher. If your question is about this lesson, try asking it in another way or tap one of the suggested questions above.';

export function isSafeguardingConcern(text: string): boolean {
  if (!text) return false;
  return SAFEGUARDING_PATTERNS.some((re) => re.test(text));
}
