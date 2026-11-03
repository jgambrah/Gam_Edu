import { parseTutorialDescription, splitInline } from '../tutorial-description';

/** Run with: npx tsx src/lib/__tests__/test-tutorial-description.ts */
let failures = 0;
const check = (label: string, ok: boolean, detail = '') => { if (ok) console.log(`  ok   ${label}`); else { failures++; console.error(`  FAIL ${label} ${detail}`); } };

// The description from the "Getting Started" video, pasted as a single run of text.
const real = "### 🚀 Quick Setup Checklist: Executive Director Cockpit 1. **Add Staff Accounts (`People Management` → `Staff Management`)** Click the yellow **Add Staff Account** button (top right) to register staff. 2. **Enroll Students (`People Management` → `Students`)** Click the yellow **Enroll Student** button. 3. **Create & Link Parents** Click **Add Parent**. 4. **Create Classes** Open **Class Roster**. 5. **Configure School Settings** Click **School Profile** to upload your crest.";
const p = parseTutorialDescription(real);
check('splits 5 steps', p.steps.length === 5, JSON.stringify(p.steps.map(s => s.slice(0, 20))));
check('heading has no ### and keeps title', p.heading.startsWith('🚀 Quick Setup Checklist') && !p.heading.includes('#'), p.heading);
check('step 1 starts with its bold title', p.steps[0].startsWith('**Add Staff Accounts'));
check('last step is complete', p.steps[4].endsWith('upload your crest.'));

check('multi-line numbered list', parseTutorialDescription('Intro\n1. A\n2. B\n3. C').steps.length === 3);
check('does not treat prices as steps', parseTutorialDescription('Fee is GH₵1.5 per day. See 2. below').steps.length === 1);
check('out-of-order numbers are not steps', parseTutorialDescription('Note 3. thing 5. other').steps.length === 1);
check('plain text → one paragraph, no heading', (() => { const r = parseTutorialDescription('Just a short description.'); return r.steps.length === 1 && r.heading === ''; })());
check('empty / null / undefined safe', parseTutorialDescription('').steps.length === 0 && parseTutorialDescription(null).steps.length === 0 && parseTutorialDescription(undefined).heading === '');
check('inline: bold + code', (() => { const r = splitInline('Click **Add** in `Menu` now'); return r.map(x => x.kind).join() === 'text,bold,text,code,text'; })());
check('inline: lone asterisks left alone', splitInline('a ** b').map(x => x.kind).join() === 'text');
check('no HTML interpreted', splitInline('<b>x</b>')[0].value === '<b>x</b>');

if (failures) { console.error(`\n${failures} FAILED`); process.exit(1); }
console.log('\nAll checks passed.');
