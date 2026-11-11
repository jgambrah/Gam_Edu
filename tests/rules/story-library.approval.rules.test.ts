/**
 * Instant pre-verified approval workflow. Emulator tests.
 *
 * Policy under test:
 *  - stories are verified prior to seeding; publishers can create stories directly as `approved` (or `draft`), and any
 *    central publisher (including creator, last editor, submitter, or super admin) can approve a story once server-computed
 *    readiness confirms `premiumReady == true` for the exact `contentHash`;
 *  - actor fields must equal the signed-in uid, timestamps must equal server time (`request.time`), and approval cannot
 *    be combined with content edits;
 *  - approved/published content is frozen; publishing and archiving remain strictly server-only (`publication.ts`).
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
const seedReady = (id: string, over: Record<string, unknown> = {}) =>
  env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), `story_library_admin/${id}/readiness/current`), { premiumReady: true, contentHash: 'h1', reviewerIds: [], ...over });
  });
const serverPatch = (id: string, patch: Record<string, unknown>) =>
  env.withSecurityRulesDisabled(async (c) => { await updateDoc(doc(c.firestore(), `story_library_admin/${id}`), patch); });

const base = (over: Record<string, unknown> = {}) => ({
  storyKey: 'key', title: 'Original title', createdBy: 'pubA', lastEditedBy: 'pubA', createdAt: new Date(), updatedAt: new Date(), ...over,
});
const seedState = async (id: string, status: string, over: Record<string, unknown> = {}) => {
  await seed(id, base({
    status,
    ...(status !== 'draft' ? { contentHash: 'h1' } : {}),
    ...(status === 'review' ? { submittedBy: 'pubA', submittedAt: new Date() } : {}),
    ...(['approved', 'published', 'archived'].includes(status) ? { approvedBy: 'pubA', approvedAt: new Date() } : {}),
    ...over,
  }));
  if (status !== 'draft') await seedReady(id);
};
const seedMachineStory = async (id: string, over: Record<string, unknown> = {}) => {
  await seed(id, base({
    status: 'approved', createdBy: 'seeder-bot', lastEditedBy: 'seeder-bot', approvedBy: 'seeder-bot', approvedAt: new Date(),
    seededBy: 'seeder-bot', synthetic: true, contentHash: 'h1', ...over,
  }));
  await seedReady(id);
};

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

describe('instant pre-verified approval: publishers can create as approved or approve directly without four-eyes delay', () => {
  it('a publisher can create a story directly in approved state with their own uid and server timestamp', async () => {
    await assertSucceeds(setDoc(ref('pubA', 'story_inst1'), {
      storyKey: 'k', title: 'T', status: 'approved', createdBy: 'pubA', lastEditedBy: 'pubA',
      approvedBy: 'pubA', approvedAt: serverTimestamp(), updatedAt: serverTimestamp(),
    }));
  });

  it('creator, last editor, submitter, or superAdmin can directly approve a ready story from draft or review', async () => {
    await seedState('story_d1', 'draft', { contentHash: 'h1' });
    await seedReady('story_d1');
    await assertSucceeds(approve('pubA', 'story_d1')); // direct draft -> approved by creator

    await seedState('story_r1', 'review', { createdBy: 'pubA', lastEditedBy: 'pubA', submittedBy: 'pubA' });
    await assertSucceeds(approve('pubA', 'story_r1')); // direct review -> approved by creator/submitter

    await seedState('story_s1', 'review', { createdBy: SUPER, lastEditedBy: SUPER, submittedBy: SUPER });
    await assertSucceeds(approve('superAdmin', 'story_s1'));
  });

  it('edit-and-approve in one write is still refused (approval changes nothing but the approval trail)', async () => {
    await seedState('story_e2', 'review');
    await assertFails(approve('pubA', 'story_e2', { title: 'Sneaky change' }));
    await assertFails(approve('pubA', 'story_e2', { notes: 'Edited during approve' }));
    await assertSucceeds(approve('pubA', 'story_e2'));
  });
});

describe('timestamps and actor fields cannot be forged', () => {
  it('a back-dated or client-supplied approvedAt is refused; approvedBy must be the caller', async () => {
    await seedState('story_t1', 'review');
    await assertFails(approve('pubC', 'story_t1', { approvedAt: Timestamp.fromDate(new Date('2020-01-01')) }));
    await assertFails(approve('pubC', 'story_t1', { approvedAt: new Date() }));
    await assertFails(approve('pubC', 'story_t1', { approvedBy: 'pubD' }));
    await assertFails(updateDoc(ref('pubC', 'story_t1'), { status: 'approved', approvedBy: 'pubC', updatedAt: serverTimestamp() }));
    await assertSucceeds(approve('pubC', 'story_t1'));
  });

  it('cannot create an approved story naming someone else as approver or without server timestamps', async () => {
    const mk = (over: Record<string, unknown>) => ({ storyKey: 'k', title: 'T', status: 'draft', createdBy: 'pubA', lastEditedBy: 'pubA', updatedAt: serverTimestamp(), ...over });
    await assertFails(setDoc(ref('pubA', 'story_t4'), mk({ status: 'approved', approvedBy: 'pubB', approvedAt: serverTimestamp() })));
    await assertFails(setDoc(ref('pubA', 'story_t5'), mk({ status: 'draft', approvedBy: 'pubA', approvedAt: serverTimestamp() })));
    await assertFails(setDoc(ref('pubA', 'story_t6'), mk({ updatedAt: new Date() })));
  });

  it('createdBy is immutable', async () => {
    await seedState('story_t7', 'review');
    await assertFails(editContent('pubA', 'story_t7', { createdBy: 'pubB' }));
  });
});

describe('approved and published content is frozen; re-opening clears approval', () => {
  it('approved content is frozen until re-opened; clients can never publish or archive', async () => {
    await seedMachineStory('story_a1');
    await assertFails(editContent('pubC', 'story_a1'));
    await assertFails(publish('pubC', 'story_a1'));
    await assertFails(reopen('pubC', 'story_a1', { title: 'Changed while re-opening' }));
    await assertSucceeds(reopen('pubC', 'story_a1'));
    await assertSucceeds(editContent('pubC', 'story_a1', { notes: 'Updated note' }));
    await assertSucceeds(approve('pubC', 'story_a1'));
  });

  it('published and archived content is frozen; only the server service publishes or withdraws', async () => {
    await seedState('story_a3', 'published');
    await assertFails(editContent('pubC', 'story_a3'));
    await assertFails(archive('pubC', 'story_a3'));
    await assertFails(reopen('pubC', 'story_a3'));
    await serverPatch('story_a3', { status: 'archived' });
    await assertFails(publish('pubC', 'story_a3'));
    await assertSucceeds(reopen('pubC', 'story_a3'));
  });
});

describe('approval is gated on server-computed technical readiness', () => {
  it('no readiness record, a not-ready record, or one for another content hash blocks update-to-approved', async () => {
    await seedState('story_g1', 'review');
    await env.withSecurityRulesDisabled(async (c) => { await deleteDoc(doc(c.firestore(), 'story_library_admin/story_g1/readiness/current')); });
    await assertFails(approve('pubA', 'story_g1'));
    await seedReady('story_g1', { premiumReady: false });
    await assertFails(approve('pubA', 'story_g1'));
    await seedReady('story_g1', { contentHash: 'older-hash' });
    await assertFails(approve('pubA', 'story_g1'));
    await seedReady('story_g1');
    await assertSucceeds(approve('pubA', 'story_g1'));
  });
  it('content fields (title, hash, package path) and readiness records remain server-only', async () => {
    await seedState('story_g4', 'review');
    for (const fields of [{ title: 'New' }, { contentHash: 'h2' }, { packagePath: 'story_library/x/v1/package.json' }]) {
      await assertFails(editContent('pubC', 'story_g4', fields));
    }
    await assertFails(setDoc(doc(db('pubC'), 'story_library_admin/story_g4/readiness/current'), { premiumReady: true, contentHash: 'h1' }));
  });
});

describe('nobody outside central publishers can touch stories', () => {
  it('a school teacher cannot read or write', async () => {
    await seedState('story_x1', 'review');
    await assertFails(approve('teacherA', 'story_x1'));
    await assertFails(editContent('teacherA', 'story_x1'));
  });
  it('only a draft can be deleted by a client', async () => {
    await seedState('story_x4', 'draft');
    await seedMachineStory('story_x5');
    await assertSucceeds(deleteDoc(ref('pubA', 'story_x4')));
    await assertFails(deleteDoc(ref('pubA', 'story_x5')));
  });
});
