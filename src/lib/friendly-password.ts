/**
 * Easy-to-type temporary passwords for pupils, parents and staff, e.g. "mango4827".
 * A simple word + 4 digits: easy for a child or a busy parent to type, but no longer the same for everyone
 * (with "password123" and predictable sign-in IDs, anyone could open a new account before its owner).
 * The person is asked to choose their own password at first sign-in; until then the school can look the
 * temporary password up again at any time (see app/actions/credentials.ts).
 */
const WORDS = [
    'mango', 'lion', 'river', 'star', 'apple', 'tiger', 'cloud', 'sun', 'book', 'lamp', 'green', 'happy',
    'smile', 'kente', 'cocoa', 'eagle', 'ocean', 'paper', 'pencil', 'table', 'zebra', 'honey', 'piano',
    'robot', 'tulip', 'drum', 'kite', 'ball', 'frog', 'panda', 'rose', 'moon', 'rain', 'bread', 'candy',
    'grape', 'lemon', 'melon', 'orange', 'peach', 'rocket', 'train', 'bus', 'palm', 'pearl', 'shell',
    'bird', 'cake', 'duck', 'fish', 'gold', 'hill', 'leaf', 'nest', 'park', 'ruby', 'sand', 'tree',
];

export function makeFriendlyPassword(): string {
    const buf = new Uint32Array(2);
    globalThis.crypto.getRandomValues(buf);
    const word = WORDS[buf[0] % WORDS.length];
    const digits = String(1000 + (buf[1] % 9000));
    return `${word}${digits}`;
}

/** Shared or guessable defaults that must not be given to NEW accounts (existing accounts are unaffected). */
const WEAK_DEFAULTS = new Set(['password123', 'password', 'password1', '12345678', '123456', '1234567', '123456789', 'pass123', 'school123', 'gamedu123', 'admin123', 'student123', 'parent123', 'staff123']);
export function isWeakDefaultPassword(pw: string | undefined | null): boolean {
    const p = String(pw || '').trim().toLowerCase();
    return p.length < 6 || WEAK_DEFAULTS.has(p);
}
