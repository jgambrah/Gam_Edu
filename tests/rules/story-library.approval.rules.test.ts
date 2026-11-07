/**
 * Independent-approval workflow (Stage 3, fixes security findings F1 and F2). Emulator tests.
 *
 * Policy under test:
 *  - every story records creator, last editor, submitter (who moved the current version into review), approver, and
 *    server-stamped timestamps; actor fields must equal the signed-in uid, timestamps must be server time;
 *  - the approver must differ from the creator, the last editor AND the submitter;
 *  - approval changes nothing but the approval trail (no edit-and-approve);
 *  - approval also needs a server-computed readiness record (premiumReady for the exact content hash) and an approver who is
 *    not a reviewer of it; clients can change nothing but the workflow trail and `notes` (content is server-written);
 *  - approved content is frozen; there is NO client path to published/archived (the publication service does that);
 *    re-opening clears the approval, so a material edit needs a fresh review;
 *  - the same rules bind central publishers and super admins; machine-seeded drafts are covered.
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, deleteDoc, serverTimestamp, deleteField, Timestamp } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles } from './helpers';

let env: RulesTestEnvironment;
const SUPER = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';
const PUBS = ['pubA', 'pubB', 'pubC', 'pubD'] as const;
type Who = (typeof PUBS)[number] | 'superAdmin' | 'seeder-bot' | 'teacherA';

const uidOf = (w: Who) => (w === 'superAdmin' ? SUPER : w);
const db = (w: Who) => {
  if (w === 'superAdmin') return as(env, 'superAdmin').firestore();
  if (w === 'teacherA') return as(env, 'teacherA').firestore();
  return env.authenticatedContext(w, { email: `${w}@test.example`, story_publisher: true }).firestore();
};
const ref = (w: Who, id: string) => doc(db(w), `story_library_admin/${id}`);
const seed = (id: string, data: Record<string, unknown>) =>
  env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), `story_library_admin/${id}`), data); });
/** The server-written readiness record the approval rule reads (premium-ready for content hash `h1`, reviewed by someone else). */
const seedReady = (id: string, over: Record<string, unknown> = {}) =>
  env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), `story_library_admin/${id}/readiness/current`), { premiumReady: true, contentHash: 'h1', reviewerIds: ['reviewerX'], ...over });
  });
/** What the publication service does (Admin SDK): moves a story to published/archived. Clients cannot. */
const serverPatch = (id: string, patch: Record<string, unknown>) =>
  env.withSecurityRulesDisabled(async (c) => { await updateDoc(doc(c.firestore(), `story_library_admin/${id}`), patch); });

const base = (over: Record<string, unknown> = {}) => ({
  storyKey: 'key', title: 'Original title', createdBy: 'pubA', lastEditedBy: 'pubA', createdAt: new Date(), updatedAt: new Date(), ...over,
});
/** A story as it sits in a given state, for seeding the emulator directly. */
const seedState = async (id: string, status: string, over: Record<string, unknown> = {}) => {
  await seed(id, base({
    status,
    ...(status !== 'draft' ? { submittedBy: 'pubA', submittedAt: new Date(), contentHash: 'h1' } : {}),
    ...(['approved', 'published', 'archived'].includes(status) ? { approvedBy: 'pubB', approvedAt: new Date() } : {}),
    ...over,
  }));
  if (status !== 'draft') await seedReady(id);
};
/** A machine-seeded draft exactly as the seeder writes it. */
const seedMachineDraft = async (id: string, over: Record<string, unknown> = {}) => {
  await seed(id, base({ status: 'draft', createdBy: 'seeder-bot', lastEditedBy: 'seeder-bot', seededBy: 'seeder-bot', synthetic: true, contentHash: 'h1', ...over }));
  await seedReady(id);
};

// ---- what the app writes ----
const submit = (w: Who, id: string) => updateDoc(ref(w, id), { status: 'review', lastEditedBy: uidOf(w), submittedBy: uidOf(w), submittedAt: serverTimestamp(), updatedAt: serverTimestamp() });
const editContent = (w: Who, id: string, fields: Record<string, unknown> = { notes: 'Edited note' }) => updateDoc(ref(w, id), { lastEditedBy: uidOf(w), updatedAt: serverTimestamp(), ...fields });
const approve = (w: Who, id: string, extra: Record<string, unknown> = {}) =>
  updateDoc(ref(w, id), { status: 'approved', approvedBy: uidOf(w), approvedAt: serverTimestamp(), updatedAt: serverTimestamp(), ...extra });
const publish = (w: Who, id: string) => updateDoc(ref(w, id), { status: 'published', publishedBy: uidOf(w), publishedAt: serverTimestamp(), updatedAt: serverTimestamp() });
const archive = (w: Who, id: string) => updateDoc(ref(w, id), { status: 'archived', archivedBy: uidOf(w), archivedAt: serverTimestamp(), updatedAt: serverTimestamp() });
const reopen = (w: Who, id: string, extra: Record<string, unknown> = {}) =>
  updateDoc(ref(w, id), { status: 'review', lastEditedBy: uidOf(w), submittedBy: uidOf(w), submittedAt: serverTimestamp(), approvedBy: deleteField(), approvedAt: deleteField(), updatedAt: serverTimestamp(), ...extra });

beforeAll(async () => { env = await createEnv('demo-gam-edu-approval', { firestore: readRules('firestore.rules') }); });
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env, { 'schools/schoolA': { name: 'School A' } });
});

describe('F1 fixed: one person cannot both submit and approve', () => {
  it('machine-seeded draft: the person who submits it for review cannot approve it; a different publisher can', async () => {
    await seedMachineDraft('story_m1');
    await assertSucceeds(submit('pubA', 'story_m1'));
    await assertFails(approve('pubA', 'story_m1'));
    await assertSucceeds(approve('pubB', 'story_m1'));
  });

  it('the seeder identity cannot approve its own machine-seeded story', async () => {
    await seedMachineDraft('story_m2');
    await assertSucceeds(submit('pubA', 'story_m2'));
    await assertFails(approve('seeder-bot', 'story_m2'));
  });

  it('a human-created story: creator, then submitter, cannot approve; an independent publisher can', async () => {
    await assertSucceeds(setDoc(ref('pubA', 'story_h1'), { storyKey: 'k', title: 'T', status: 'draft', createdBy: 'pubA', lastEditedBy: 'pubA', updatedAt: serverTimestamp() }));
    await serverPatch('story_h1', { contentHash: 'h1' }); // the import/edit service sets the hash; clients cannot
    await seedReady('story_h1');
    await assertSucceeds(submit('pubA', 'story_h1'));
    await assertFails(approve('pubA', 'story_h1'));
    await assertSucceeds(approve('pubB', 'story_h1'));
  });

  it('creator, last editor and submitter are three different people: none of the three can approve; a fourth can', async () => {
    await seedState('story_h2', 'review', { createdBy: 'pubA', lastEditedBy: 'pubB', submittedBy: 'pubC' });
    for (const w of ['pubA', 'pubB', 'pubC'] as Who[]) await assertFails(approve(w, 'story_h2'));
    await assertSucceeds(approve('pubD', 'story_h2'));
  });

  it('a super admin is bound too: cannot approve a story they created, edited or submitted', async () => {
    await seedState('story_s1', 'review', { createdBy: SUPER, lastEditedBy: 'pubB', submittedBy: 'pubC' });
    await seedState('story_s2', 'review', { createdBy: 'pubA', lastEditedBy: SUPER, submittedBy: 'pubC' });
    await seedState('story_s3', 'review', { createdBy: 'pubA', lastEditedBy: 'pubB', submittedBy: SUPER });
    for (const id of ['story_s1', 'story_s2', 'story_s3']) await assertFails(approve('superAdmin', id));
    await seedState('story_s4', 'review', { createdBy: 'pubA', lastEditedBy: 'pubB', submittedBy: 'pubC' });
    await assertSucceeds(approve('superAdmin', 'story_s4')); // an independent super admin is simply another publisher
  });
});

describe('F2 fixed: editing in review changes who may approve, and approval cannot carry an edit', () => {
  it('someone who edits a story in review cannot then approve it', async () => {
    await seedMachineDraft('story_e1');
    await assertSucceeds(submit('pubA', 'story_e1'));
    await assertSucceeds(editContent('pubB', 'story_e1', { notes: 'Edited in review' }));
    await assertFails(approve('pubB', 'story_e1')); // last editor
    await assertFails(approve('pubA', 'story_e1')); // submitter
    await assertSucceeds(approve('pubC', 'story_e1'));
  });

  it('edit-and-approve in one write is refused (approval may change nothing but the approval trail)', async () => {
    await seedState('story_e2', 'review');
    await assertFails(approve('pubC', 'story_e2', { title: 'Sneaky change' }));
    await assertFails(approve('pubC', 'story_e2', { pages: 99 }));
    await assertFails(approve('pubC', 'story_e2', { lastEditedBy: 'pubC' })); // cannot launder the last-editor trail
    await assertSucceeds(approve('pubC', 'story_e2'));
  });

  it('the editor field must be honest: cannot write someone else as last editor, or skip it', async () => {
    await seedState('story_e3', 'review');
    await assertFails(updateDoc(ref('pubB', 'story_e3'), { notes: 'x', lastEditedBy: 'pubA', updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(ref('pubB', 'story_e3'), { notes: 'x', updatedAt: serverTimestamp() })); // lastEditedBy still pubA from before
    await assertSucceeds(editContent('pubB', 'story_e3'));
  });

  it('the submitter field must be honest when submitting', async () => {
    await seedMachineDraft('story_e4');
    await assertFails(updateDoc(ref('pubA', 'story_e4'), { status: 'review', lastEditedBy: 'pubA', submittedBy: 'pubB', submittedAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await assertFails(updateDoc(ref('pubA', 'story_e4'), { status: 'review', lastEditedBy: 'pubA', updatedAt: serverTimestamp() })); // no submitter recorded
    await assertSucceeds(submit('pubA', 'story_e4'));
  });
});

describe('timestamps and approval fields cannot be forged', () => {
  it('a back-dated or client-supplied approvedAt is refused; approvedBy must be the caller', async () => {
    await seedState('story_t1', 'review');
    await assertFails(approve('pubC', 'story_t1', { approvedAt: Timestamp.fromDate(new Date('2020-01-01')) }));
    await assertFails(approve('pubC', 'story_t1', { approvedAt: new Date() }));
    await assertFails(approve('pubC', 'story_t1', { approvedBy: 'pubD' }));
    await assertFails(updateDoc(ref('pubC', 'story_t1'), { status: 'approved', approvedBy: 'pubC', updatedAt: serverTimestamp() })); // no approvedAt
    await assertSucceeds(approve('pubC', 'story_t1'));
  });

  it('approval fields cannot be planted on a draft or on a story in review', async () => {
    await seedMachineDraft('story_t2');
    await assertFails(editContent('pubA', 'story_t2', { approvedBy: 'pubB', approvedAt: serverTimestamp() }));
    await seedState('story_t3', 'review');
    await assertFails(editContent('pubB', 'story_t3', { approvedBy: 'pubC' }));
  });

  it('cannot create a story already carrying approval or a submission', async () => {
    const mk = (over: Record<string, unknown>) => ({ storyKey: 'k', title: 'T', status: 'draft', createdBy: 'pubA', lastEditedBy: 'pubA', updatedAt: serverTimestamp(), ...over });
    await assertFails(setDoc(ref('pubA', 'story_t4'), mk({ approvedBy: 'pubB', approvedAt: serverTimestamp() })));
    await assertFails(setDoc(ref('pubA', 'story_t5'), mk({ submittedBy: 'pubA' })));
    await assertFails(setDoc(ref('pubA', 'story_t6'), mk({ updatedAt: new Date() }))); // client clock
  });

  it('createdBy cannot be changed to dodge the independence check', async () => {
    await seedState('story_t7', 'review');
    await assertFails(editContent('pubA', 'story_t7', { createdBy: 'pubB' }));
  });
});

describe('a material edit after approval invalidates the approval', () => {
  it('approved content is frozen: no edit, no publish-with-edit, no re-open that keeps the approval or changes content', async () => {
    await seedState('story_a1', 'approved');
    await assertFails(editContent('pubC', 'story_a1'));
    await assertFails(publish('pubC', 'story_a1')); // no client publish, ever
    // re-open that leaves the old approval in place
    await assertFails(updateDoc(ref('pubC', 'story_a1'), { status: 'review', lastEditedBy: 'pubC', submittedBy: 'pubC', submittedAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    // re-open that also edits content
    await assertFails(reopen('pubC', 'story_a1', { title: 'Changed while re-opening' }));
    await assertSucceeds(reopen('pubC', 'story_a1'));
  });

  it('after re-opening, the old approval is gone and the re-opener cannot re-approve; an independent publisher must', async () => {
    await seedState('story_a2', 'approved');
    await assertSucceeds(reopen('pubC', 'story_a2'));
    await assertSucceeds(editContent('pubC', 'story_a2', { notes: 'Corrected note' }));
    await assertFails(approve('pubC', 'story_a2'));
    await assertFails(approve('pubA', 'story_a2')); // creator
    await assertSucceeds(approve('pubD', 'story_a2'));
  });

  it('published and archived content is frozen too; a client cannot archive, and a withdrawn story re-opens only with approval cleared', async () => {
    await seedState('story_a3', 'published');
    await assertFails(editContent('pubC', 'story_a3'));
    await assertFails(archive('pubC', 'story_a3')); // withdrawal is the publication service's job
    await assertFails(reopen('pubC', 'story_a3')); // a published story must be withdrawn first
    await serverPatch('story_a3', { status: 'archived' });
    await assertFails(publish('pubC', 'story_a3')); // archived cannot jump back to published
    await assertFails(updateDoc(ref('pubC', 'story_a3'), { status: 'review', lastEditedBy: 'pubC', submittedBy: 'pubC', submittedAt: serverTimestamp(), updatedAt: serverTimestamp() })); // approval retained
    await assertSucceeds(reopen('pubC', 'story_a3'));
  });

  it('a draft cannot jump to approved or published; review cannot jump to published', async () => {
    await seedMachineDraft('story_a4');
    await assertFails(approve('pubB', 'story_a4'));
    await assertFails(publish('pubB', 'story_a4'));
    await seedState('story_a5', 'review');
    await assertFails(publish('pubB', 'story_a5'));
  });

  it('the full path with machine-seeded content: submit → independent approve → (service) publish → (service) withdraw → re-open → new approval', async () => {
    await seedMachineDraft('story_f1');
    await assertSucceeds(submit('pubA', 'story_f1'));
    await assertSucceeds(approve('pubB', 'story_f1'));
    await assertFails(publish('pubA', 'story_f1')); // clients cannot publish
    await serverPatch('story_f1', { status: 'published' });
    await assertFails(archive('pubC', 'story_f1')); // nor withdraw
    await serverPatch('story_f1', { status: 'archived' });
    await assertSucceeds(reopen('pubC', 'story_f1'));
    await assertSucceeds(editContent('pubC', 'story_f1', { notes: 'Corrected after withdrawal' }));
    await assertFails(approve('pubC', 'story_f1'));
    await assertSucceeds(approve('pubB', 'story_f1')); // a previous approver who did not edit this version is independent of it
  });
});

describe('approval is gated on server-computed readiness and independent review', () => {
  it('no readiness record, a not-ready record, or one for another content hash blocks approval', async () => {
    await seedState('story_g1', 'review');
    await env.withSecurityRulesDisabled(async (c) => { await deleteDoc(doc(c.firestore(), 'story_library_admin/story_g1/readiness/current')); });
    await assertFails(approve('pubC', 'story_g1'));
    await seedReady('story_g1', { premiumReady: false });
    await assertFails(approve('pubC', 'story_g1'));
    await seedReady('story_g1', { contentHash: 'older-hash' });
    await assertFails(approve('pubC', 'story_g1'));
    await seedReady('story_g1');
    await assertSucceeds(approve('pubC', 'story_g1'));
  });
  it('a story with no content hash cannot be approved at all', async () => {
    await seedState('story_g2', 'review', { contentHash: '' });
    await assertFails(approve('pubC', 'story_g2'));
  });
  it('a reviewer of the content cannot approve it, even if they never edited or submitted it', async () => {
    await seedState('story_g3', 'review');
    await seedReady('story_g3', { reviewerIds: ['pubC'] });
    await assertFails(approve('pubC', 'story_g3'));
    await assertSucceeds(approve('pubD', 'story_g3'));
  });
  it('content fields (title, hash, package path) cannot be changed by any client, so readiness cannot be gamed', async () => {
    await seedState('story_g4', 'review');
    for (const fields of [{ title: 'New' }, { contentHash: 'h2' }, { packagePath: 'story_library/x/v1/package.json' }]) {
      await assertFails(editContent('pubC', 'story_g4', fields));
    }
    await seedMachineDraft('story_g5');
    await assertFails(editContent('pubA', 'story_g5', { title: 'New' }));
  });
  it('readiness and review records are server-only', async () => {
    await seedState('story_g6', 'review');
    await assertFails(setDoc(doc(db('pubC'), 'story_library_admin/story_g6/readiness/current'), { premiumReady: true, contentHash: 'h1', reviewerIds: [] }));
    await assertFails(setDoc(doc(db('superAdmin'), 'story_library_admin/story_g6/reviews/r1'), { verdict: 'pass' }));
  });
});

describe('nobody outside the workflow can touch stories', () => {
  it('a school teacher cannot read or write', async () => {
    await seedState('story_x1', 'review');
    await assertFails(approve('teacherA', 'story_x1'));
    await assertFails(editContent('teacherA', 'story_x1'));
  });

  it('super admin cannot delete anything past draft, nor edit approved content, nor skip approval', async () => {
    await seedState('story_x2', 'approved');
    await assertFails(deleteDoc(ref('superAdmin', 'story_x2')));
    await assertFails(editContent('superAdmin', 'story_x2'));
    await seedState('story_x3', 'review', { createdBy: 'pubA', lastEditedBy: 'pubA', submittedBy: 'pubA' });
    await assertFails(publish('superAdmin', 'story_x3'));
    await assertFails(archive('superAdmin', 'story_x3'));
  });

  it('only a draft can be deleted', async () => {
    await seedMachineDraft('story_x4');
    await seedState('story_x5', 'review');
    await assertSucceeds(deleteDoc(ref('pubA', 'story_x4')));
    await assertFails(deleteDoc(ref('pubA', 'story_x5')));
  });
});
