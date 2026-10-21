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
