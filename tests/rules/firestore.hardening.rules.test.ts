/**
 * Firestore rules — Critical/High hardening (emulator tests).
 * pos_transactions, assignments (+ legacy submissions), top-level submissions, quizAttempts (+ legacy attempts),
 * class_stories (duplicate block), counters, direct_messages, notification_queue, auditLogs.
 *
 * For each: the legitimate workflows the app uses must still work, and cross-school / wrong-role access must fail.
 * Run:  npm run test:rules
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, getDocs, query, where, arrayUnion, increment,
} from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, type ActorName } from './helpers';

let env: RulesTestEnvironment;
let legacyEnv: RulesTestEnvironment;

// Extra people for these tests (kept out of the shared cast so the Storage matrices are unaffected).
const extraProfiles = {
  'users/accountantA': { role: 'Accountant', schoolId: SCHOOL_A }, 'staff/accountantA': { uid: 'accountantA', role: 'Accountant', schoolId: SCHOOL_A },
  'users/accountantB': { role: 'Accountant', schoolId: SCHOOL_B }, 'staff/accountantB': { uid: 'accountantB', role: 'Accountant', schoolId: SCHOOL_B },
};
type Who = ActorName | 'accountantA' | 'accountantB';
const ctx = (e: RulesTestEnvironment, who: Who) =>
  (who === 'accountantA' || who === 'accountantB')
    ? e.authenticatedContext(who, { email: `${who}@test.example` })
    : as(e, who);
const db = (who: Who, e: RulesTestEnvironment = env) => ctx(e, who).firestore();
const seed = (path: string, data: Record<string, any>, e: RulesTestEnvironment = env) =>
  e.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), path), data); });
const ok = (b: boolean) => (b ? assertSucceeds : assertFails);

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-hardening', { firestore: readRules('firestore.rules') });
  legacyEnv = await createEnv('demo-gam-edu-hardening-legacy', { firestore: readRules('tests/rules/fixtures/legacy-firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); await legacyEnv?.cleanup(); });
beforeEach(async () => {
  for (const e of [env, legacyEnv]) { await e.clearFirestore(); await seedProfiles(e, extraProfiles); }
});

// ============================================================ pos_transactions (Critical)
describe('pos_transactions — money and pupil purchases stay inside the school', () => {
  const P = 'pos_transactions/t1';
  beforeEach(async () => { await seed(P, { schoolId: SCHOOL_A, total: 12.5, items: ['pen'], createdBy: 'accountantA' }); });

  it.each([
    ['accountantA', true], ['adminA', true], ['superAdmin', true],
    ['accountantB', false], ['adminB', false], ['teacherB', false], ['pupilA', false], ['pupilB', false], ['parentA', false], ['noDocsUser', false], ['anon', false],
  ] as const)('%s reading a school A sale → %s', async (who, allowed) => {
    await ok(allowed)(getDoc(doc(db(who), P)));
  });

  it('listing: finance staff of the school can list their own school; another school cannot', async () => {
    await assertSucceeds(getDocs(query(collection(db('accountantA'), 'pos_transactions'), where('schoolId', '==', SCHOOL_A))));
    await assertFails(getDocs(query(collection(db('accountantB'), 'pos_transactions'), where('schoolId', '==', SCHOOL_A))));
    await assertFails(getDocs(query(collection(db('pupilB'), 'pos_transactions'), where('schoolId', '==', SCHOOL_A))));
    await assertFails(getDocs(collection(db('accountantA'), 'pos_transactions'))); // unfiltered list can't be proven safe
  });

  it('creating: only finance staff, only into their own school', async () => {
    const sale = (schoolId: any) => ({ schoolId, total: 5 });
    await assertSucceeds(addDoc(collection(db('accountantA'), 'pos_transactions'), sale(SCHOOL_A)));
    await assertFails(addDoc(collection(db('accountantA'), 'pos_transactions'), sale(SCHOOL_B)));
    await assertFails(addDoc(collection(db('accountantA'), 'pos_transactions'), { total: 5 }));
    await assertFails(addDoc(collection(db('accountantB'), 'pos_transactions'), sale(SCHOOL_A)));
    await assertFails(addDoc(collection(db('pupilA'), 'pos_transactions'), sale(SCHOOL_A)));
    await assertFails(addDoc(collection(db('anon'), 'pos_transactions'), sale(SCHOOL_A)));
  });

  it('updating: own school only, and the school cannot be changed', async () => {
    await assertSucceeds(updateDoc(doc(db('accountantA'), P), { total: 13 }));
    await assertFails(updateDoc(doc(db('accountantB'), P), { total: 1 }));
    await assertFails(updateDoc(doc(db('accountantA'), P), { schoolId: SCHOOL_B }));
    await assertFails(updateDoc(doc(db('pupilA'), P), { total: 1 }));
  });

  it('LEGACY: any signed-in user of any school could read and create sales', async () => {
    await seed(P, { schoolId: SCHOOL_A, total: 12.5 }, legacyEnv);
    await assertSucceeds(getDoc(doc(db('pupilB', legacyEnv), P)));
    await assertSucceeds(addDoc(collection(db('pupilB', legacyEnv), 'pos_transactions'), { schoolId: SCHOOL_A, total: 99999 }));
  });
});

// ============================================================ assignments (High)
describe('assignments — only the school’s teachers write them', () => {
  const A = 'assignments/as1';
  const asg = (over: Record<string, any> = {}) => ({ title: 'Fractions', schoolId: SCHOOL_A, teacherId: 'teacherA', classId: 'c1', ...over });
  beforeEach(async () => { await seed(A, asg()); });

  it.each([
    ['teacherA', SCHOOL_A, true], ['adminA', SCHOOL_A, true], ['superAdmin', SCHOOL_A, true],
    ['teacherA', SCHOOL_B, false], ['teacherB', SCHOOL_A, false], ['pupilA', SCHOOL_A, false], ['parentA', SCHOOL_A, false], ['anon', SCHOOL_A, false],
  ] as const)('%s creating an assignment for %s → %s', async (who, sid, allowed) => {
    await ok(allowed)(addDoc(collection(db(who), 'assignments'), asg({ schoolId: sid, teacherId: who })));
  });

  it('a teacher cannot create an assignment without a school', async () => {
    await assertFails(addDoc(collection(db('teacherA'), 'assignments'), (({ schoolId, ...r }) => r)(asg())));
  });

  it.each([['teacherA', true], ['teacherA2', true], ['adminA', true], ['teacherB', false], ['adminB', false], ['pupilA', false], ['parentA', false], ['anon', false]] as const)(
    '%s editing a school A assignment → %s', async (who, allowed) => { await ok(allowed)(updateDoc(doc(db(who), A), { title: 'Edited' })); });

  it('the school of an assignment cannot be changed (not even by its teacher)', async () => {
    await assertFails(updateDoc(doc(db('teacherA'), A), { schoolId: SCHOOL_B }));
  });

  it.each([['teacherA', true], ['adminA', true], ['superAdmin', true], ['teacherA2', false], ['adminB', false], ['teacherB', false], ['pupilA', false]] as const)(
    '%s deleting a school A assignment → %s', async (who, allowed) => { await ok(allowed)(deleteDoc(doc(db(who), A))); });

  it('legacy nested submissions: teachers of the school only; a pupil cannot write there', async () => {
    const S = `${A}/submissions/pupilA`;
    await assertSucceeds(setDoc(doc(db('teacherA'), S), { studentId: 'pupilA' }));
    await assertFails(setDoc(doc(db('pupilA'), S), { studentId: 'pupilA' }));
    await assertFails(setDoc(doc(db('teacherB'), S), { studentId: 'pupilA' }));
  });

  it('LEGACY: a teacher at another school could edit this assignment, and a pupil could create one', async () => {
    await seed(A, asg(), legacyEnv);
    await assertSucceeds(updateDoc(doc(db('teacherB', legacyEnv), A), { title: 'Vandalised' }));
    await assertSucceeds(addDoc(collection(db('pupilB', legacyEnv), 'assignments'), asg({ teacherId: 'pupilB' })));
  });
});

// ============================================================ submissions + grades (High)
describe('submissions and grades', () => {
  const S = `submissions/as1_pupilA`;
  const sub = (over: Record<string, any> = {}) => ({ assignmentId: 'as1', studentId: 'pupilA', schoolId: SCHOOL_A, status: 'Submitted', content: 'my work', ...over });

  it('a pupil submits their own work into their own school; not for someone else, not into another school', async () => {
    await assertSucceeds(setDoc(doc(db('pupilA'), S), sub()));
    await assertFails(setDoc(doc(db('pupilA'), 'submissions/as1_pupilA2'), sub({ studentId: 'pupilA2' })));
    await assertFails(setDoc(doc(db('pupilA'), S), sub({ schoolId: SCHOOL_B })));
    await assertFails(setDoc(doc(db('pupilA'), S), (({ schoolId, ...r }) => r)(sub())));
    await assertFails(setDoc(doc(db('anon'), S), sub()));
  });

  describe('existing submission', () => {
    beforeEach(async () => { await seed(S, sub()); });
    it('a pupil may replace their own ungraded work, but never set a grade', async () => {
      await assertSucceeds(updateDoc(doc(db('pupilA'), S), { content: 'better', status: 'Submitted' }));
      await assertFails(updateDoc(doc(db('pupilA'), S), { grade: 100 }));
      await assertFails(updateDoc(doc(db('pupilA'), S), { status: 'Graded' }));
    });
    it('a graded submission is locked for the pupil', async () => {
      await seed(S, sub({ status: 'Graded', grade: 70 }));
      await assertFails(updateDoc(doc(db('pupilA'), S), { content: 'changed my mind', status: 'Submitted' }));
    });
    it('teachers/admins of the school grade; teachers of another school cannot — fixes cross-school grading', async () => {
      await assertSucceeds(updateDoc(doc(db('teacherA'), S), { grade: 80, status: 'Graded' }));
      await assertSucceeds(updateDoc(doc(db('adminA'), S), { grade: 81, status: 'Graded' }));
      await assertFails(updateDoc(doc(db('teacherB'), S), { grade: 100, status: 'Graded' }));
      await assertFails(updateDoc(doc(db('adminB'), S), { grade: 100, status: 'Graded' }));
      await assertFails(updateDoc(doc(db('teacherA'), S), { schoolId: SCHOOL_B }));
    });
    it('another pupil, another school and a parent cannot read or change it', async () => {
      await assertFails(getDoc(doc(db('pupilB'), S)));
      await assertFails(getDoc(doc(db('teacherB'), S)));
      await assertFails(updateDoc(doc(db('pupilA2'), S), { content: 'x' }));
      await assertSucceeds(getDoc(doc(db('pupilA'), S)));
      await assertSucceeds(getDoc(doc(db('teacherA'), S)));
    });
    it('delete: admin of the school only', async () => {
      await assertFails(deleteDoc(doc(db('adminB'), S)));
      await assertFails(deleteDoc(doc(db('teacherA'), S)));
      await assertSucceeds(deleteDoc(doc(db('adminA'), S)));
    });
    it('LEGACY: a teacher at another school could grade this pupil', async () => {
      await seed(S, sub(), legacyEnv);
      await assertSucceeds(updateDoc(doc(db('teacherB', legacyEnv), S), { grade: 0, status: 'Graded' }));
    });
  });
});

describe('quizAttempts — marks are written by the server or by the school’s own staff', () => {
  const Q = 'quizAttempts/q1_pupilA';
  const att = (over: Record<string, any> = {}) => ({ quizId: 'q1', studentId: 'pupilA', schoolId: SCHOOL_A, score: 3, ...over });
  beforeEach(async () => { await seed(Q, att()); });

  it('a pupil cannot write or change attempts (cannot give themselves marks)', async () => {
    await assertFails(setDoc(doc(db('pupilA'), 'quizAttempts/new'), att()));
    await assertFails(updateDoc(doc(db('pupilA'), Q), { score: 10 }));
  });
  it('staff of the school can; staff of another school cannot', async () => {
    await assertSucceeds(setDoc(doc(db('teacherA'), 'quizAttempts/new'), att()));
    await assertSucceeds(updateDoc(doc(db('teacherA'), Q), { score: 4 }));
    await assertFails(setDoc(doc(db('teacherB'), 'quizAttempts/new2'), att()));
    await assertFails(updateDoc(doc(db('teacherB'), Q), { score: 0 }));
    await assertFails(updateDoc(doc(db('teacherA'), Q), { schoolId: SCHOOL_B }));
  });
  it('the pupil can still read their own attempt; another school cannot', async () => {
    await assertSucceeds(getDoc(doc(db('pupilA'), Q)));
    await assertFails(getDoc(doc(db('pupilB'), Q)));
  });
  it('legacy nested attempts: school staff only', async () => {
    await seed('quizzes/q1', { schoolId: SCHOOL_A, title: 'Q' });
    await assertSucceeds(setDoc(doc(db('teacherA'), 'quizzes/q1/attempts/a1'), { studentId: 'pupilA' }));
    await assertFails(setDoc(doc(db('pupilA'), 'quizzes/q1/attempts/a2'), { studentId: 'pupilA' }));
    await assertFails(setDoc(doc(db('teacherB'), 'quizzes/q1/attempts/a3'), { studentId: 'pupilA' }));
  });
});

// ============================================================ class_stories (High — duplicate block)
describe('class_stories — one block, same school only', () => {
  const C = 'class_stories/s1';
  const story = (over: Record<string, any> = {}) => ({ title: 'Trip', content: 'We went', schoolId: SCHOOL_A, authorId: 'teacherA', likes: [], commentsCount: 0, ...over });
  beforeEach(async () => { await seed(C, story()); });

  it.each([['teacherA', true], ['pupilA', true], ['parentA', true], ['adminA', true], ['teacherB', false], ['pupilB', false], ['parentB', false], ['anon', false]] as const)(
    '%s reading a school A story → %s', async (who, allowed) => { await ok(allowed)(getDoc(doc(db(who), C))); });

  it('listing works for the school (filtered by schoolId) and not across schools', async () => {
    await assertSucceeds(getDocs(query(collection(db('parentA'), 'class_stories'), where('schoolId', '==', SCHOOL_A))));
    await assertFails(getDocs(query(collection(db('parentB'), 'class_stories'), where('schoolId', '==', SCHOOL_A))));
  });

  it('only teachers/admins post, only into their school', async () => {
    await assertSucceeds(addDoc(collection(db('teacherA'), 'class_stories'), story()));
    await assertFails(addDoc(collection(db('teacherA'), 'class_stories'), story({ schoolId: SCHOOL_B })));
    await assertFails(addDoc(collection(db('pupilA'), 'class_stories'), story({ authorId: 'pupilA' })));
    await assertFails(addDoc(collection(db('parentA'), 'class_stories'), story({ authorId: 'parentA' })));
  });

  it('any member of the school can like and bump the comment count — and nothing else', async () => {
    await assertSucceeds(updateDoc(doc(db('parentA'), C), { likes: arrayUnion('parentA') }));
    await assertSucceeds(updateDoc(doc(db('pupilA'), C), { commentsCount: increment(1) }));
    await assertFails(updateDoc(doc(db('parentA'), C), { title: 'Hacked' }));
    await assertFails(updateDoc(doc(db('parentA'), C), { schoolId: SCHOOL_B }));
    await assertFails(updateDoc(doc(db('parentA'), C), { likes: arrayUnion('x'), content: 'both' }));
  });

  it('members of another school cannot like or edit', async () => {
    await assertFails(updateDoc(doc(db('parentB'), C), { likes: arrayUnion('parentB') }));
    await assertFails(updateDoc(doc(db('teacherB'), C), { title: 'x' }));
  });

  it('teachers/admins of the school edit and delete; others cannot', async () => {
    await assertSucceeds(updateDoc(doc(db('teacherA2'), C), { title: 'Edited', mediaUrls: [] }));
    await assertFails(deleteDoc(doc(db('pupilA'), C)));
    await assertFails(deleteDoc(doc(db('teacherB'), C)));
    await assertSucceeds(deleteDoc(doc(db('teacherA'), C)));
  });

  describe('comments', () => {
    const K = `${C}/comments/k1`;
    beforeEach(async () => { await seed(K, { storyId: 's1', schoolId: SCHOOL_A, authorId: 'parentA', content: 'Lovely' }); });
    it('members read and post their own comments', async () => {
      await assertSucceeds(getDoc(doc(db('pupilA'), K)));
      await assertSucceeds(addDoc(collection(db('parentA'), `${C}/comments`), { authorId: 'parentA', schoolId: SCHOOL_A, content: 'Nice' }));
    });
    it('cannot post as someone else or from another school; cannot read from another school', async () => {
      await assertFails(addDoc(collection(db('parentA'), `${C}/comments`), { authorId: 'teacherA', content: 'forged' }));
      await assertFails(addDoc(collection(db('parentB'), `${C}/comments`), { authorId: 'parentB', content: 'x' }));
      await assertFails(getDoc(doc(db('parentB'), K)));
    });
    it('the author or school staff edit/delete; another parent cannot', async () => {
      await assertSucceeds(updateDoc(doc(db('parentA'), K), { content: 'Edited' }));
      await assertSucceeds(deleteDoc(doc(db('teacherA'), K)));
    });
    it('another parent of the same school cannot delete it', async () => {
      await seed(`${C}/comments/k2`, { authorId: 'parentA', schoolId: SCHOOL_A });
      await assertFails(deleteDoc(doc(db('pupilA'), `${C}/comments/k2`)));
    });
  });

  it('LEGACY: the second block let any signed-in user (any school) delete a story', async () => {
    await seed(C, story(), legacyEnv);
    await assertSucceeds(deleteDoc(doc(db('pupilB', legacyEnv), C)));
  });
});

// ============================================================ counters (High — receipts)
describe('counters — receipt and student numbers', () => {
  const R_A = `counters/receipts_${SCHOOL_A}`;
  it('staff create their own school’s counter, starting at 1', async () => {
    await assertSucceeds(setDoc(doc(db('accountantA'), R_A), { currentId: 1 }));
    await assertSucceeds(setDoc(doc(db('teacherA'), `counters/students_${SCHOOL_A}`), { currentId: 1 }));
  });
  it('nobody creates another school’s counter, a counter that does not start at 1, or an unrelated counter', async () => {
    await assertFails(setDoc(doc(db('accountantA'), `counters/receipts_${SCHOOL_B}`), { currentId: 1 }));
    await assertFails(setDoc(doc(db('accountantA'), R_A), { currentId: 500 }));
    await assertFails(setDoc(doc(db('accountantA'), `counters/receipts_${SCHOOL_A}_x`), { currentId: 1 }));
    await assertFails(setDoc(doc(db('accountantA'), 'counters/anything'), { currentId: 1 }));
  });
  it('pupils, parents and anonymous visitors cannot create or read', async () => {
    for (const who of ['pupilA', 'parentA', 'anon', 'noDocsUser'] as const) {
      await assertFails(setDoc(doc(db(who), R_A), { currentId: 1 }));
    }
  });
  describe('existing counter', () => {
    beforeEach(async () => { await seed(R_A, { currentId: 10 }); });
    it('goes up, never down, never reset', async () => {
      await assertSucceeds(updateDoc(doc(db('accountantA'), R_A), { currentId: 11 }));
      await assertFails(updateDoc(doc(db('accountantA'), R_A), { currentId: 9 }));
      await assertFails(updateDoc(doc(db('accountantA'), R_A), { currentId: 1 }));
      await assertFails(updateDoc(doc(db('accountantA'), R_A), { currentId: 10 }));
    });
    it('another school’s staff cannot touch or read it', async () => {
      await assertFails(updateDoc(doc(db('accountantB'), R_A), { currentId: 11 }));
      await assertFails(getDoc(doc(db('accountantB'), R_A)));
      await assertFails(getDoc(doc(db('pupilA'), R_A)));
      await assertSucceeds(getDoc(doc(db('accountantA'), R_A)));
    });
    it('LEGACY: any signed-in user could rewind a receipt counter', async () => {
      await seed(R_A, { currentId: 10 }, legacyEnv);
      await assertSucceeds(setDoc(doc(db('pupilB', legacyEnv), `counters/receipts_${SCHOOL_B}`), { currentId: 99999 }));
    });
  });
});

// ============================================================ direct_messages (High — privacy)
describe('direct_messages — chat access', () => {
  const chat = (over: Record<string, any> = {}) => ({ participants: ['teacherA', 'pupilA'], schoolId: SCHOOL_A, lastMessage: 'hi', ...over });
  beforeEach(async () => { await seed('direct_messages/c1', chat()); });

  it('a person creates only chats they are part of, in their own school', async () => {
    await assertSucceeds(addDoc(collection(db('teacherA'), 'direct_messages'), chat()));
    await assertSucceeds(addDoc(collection(db('accountantA'), 'direct_messages'), chat({ participants: ['accountantA', 'parentA'] })));
    await assertFails(addDoc(collection(db('teacherA'), 'direct_messages'), chat({ participants: ['pupilA', 'parentA'] }))); // not me
    await assertFails(addDoc(collection(db('teacherA'), 'direct_messages'), chat({ schoolId: SCHOOL_B })));
    await assertFails(addDoc(collection(db('teacherA'), 'direct_messages'), (({ schoolId, ...r }) => r)(chat())));
    await assertFails(addDoc(collection(db('anon'), 'direct_messages'), chat()));
  });

  it('the app’s own query (my chats, my school) works', async () => {
    await assertSucceeds(getDocs(query(collection(db('teacherA'), 'direct_messages'),
      where('schoolId', '==', SCHOOL_A), where('participants', 'array-contains', 'teacherA'))));
  });

  it('listing someone else’s chats, or every chat, is denied', async () => {
    await assertFails(getDocs(query(collection(db('teacherB'), 'direct_messages'), where('participants', 'array-contains', 'pupilA'))));
    await assertFails(getDocs(collection(db('teacherA'), 'direct_messages')));
    await assertFails(getDocs(query(collection(db('anon'), 'direct_messages'), where('participants', 'array-contains', 'pupilA'))));
  });

  it('participants read the chat; others cannot', async () => {
    await assertSucceeds(getDoc(doc(db('pupilA'), 'direct_messages/c1')));
    await assertFails(getDoc(doc(db('teacherB'), 'direct_messages/c1')));
    await assertFails(getDoc(doc(db('parentA'), 'direct_messages/c1')));
  });

  it('messages inside a chat: participants only (unchanged)', async () => {
    await assertSucceeds(addDoc(collection(db('pupilA'), 'direct_messages/c1/messages'), { text: 'hi', senderId: 'pupilA' }));
    await assertFails(addDoc(collection(db('teacherB'), 'direct_messages/c1/messages'), { text: 'x', senderId: 'teacherB' }));
    await assertFails(getDocs(collection(db('parentA'), 'direct_messages/c1/messages')));
  });

  it('LEGACY: anyone signed in could list every chat', async () => {
    await seed('direct_messages/c1', chat(), legacyEnv);
    await assertSucceeds(getDocs(collection(db('pupilB', legacyEnv), 'direct_messages')));
  });
});

// ============================================================ notification_queue (Medium-High)
describe('notification_queue — parent alerts', () => {
  const N = 'notification_queue/absent_1';
  const alert = (over: Record<string, any> = {}) => ({ schoolId: SCHOOL_A, studentId: 'pupilA', status: 'Absent', ...over });
  beforeEach(async () => { await seed(N, alert()); });

  it('teachers/admins of the school queue alerts for their school only', async () => {
    await assertSucceeds(setDoc(doc(db('teacherA'), 'notification_queue/absent_2'), alert()));
    await assertFails(setDoc(doc(db('teacherA'), 'notification_queue/absent_3'), alert({ schoolId: SCHOOL_B })));
    await assertFails(setDoc(doc(db('teacherB'), 'notification_queue/absent_4'), alert()));
    await assertFails(setDoc(doc(db('pupilA'), 'notification_queue/absent_5'), alert()));
    await assertFails(setDoc(doc(db('parentA'), 'notification_queue/absent_6'), alert()));
    await assertFails(setDoc(doc(db('anon'), 'notification_queue/absent_7'), alert()));
  });
  it('the register screen’s read-then-upsert works for the school', async () => {
    await assertSucceeds(getDoc(doc(db('teacherA'), N)));
    await assertSucceeds(getDoc(doc(db('teacherA'), 'notification_queue/not_yet_created'))); // existence check before first write
    await assertSucceeds(updateDoc(doc(db('teacherA'), N), { status: 'Late' }));
  });
  it('other schools, pupils and parents cannot read or change entries', async () => {
    for (const who of ['teacherB', 'adminB', 'pupilA', 'parentA', 'anon'] as const) {
      await assertFails(getDoc(doc(db(who), N)));
      await assertFails(updateDoc(doc(db(who), N), { status: 'x' }));
    }
    await assertFails(updateDoc(doc(db('teacherA'), N), { schoolId: SCHOOL_B }));
  });
  it('delete: admins of the school only', async () => {
    await assertFails(deleteDoc(doc(db('teacherA'), N)));
    await assertFails(deleteDoc(doc(db('adminB'), N)));
    await assertSucceeds(deleteDoc(doc(db('adminA'), N)));
  });
  it('nothing below a queue entry is writable from a browser', async () => {
    await assertFails(setDoc(doc(db('teacherA'), `${N}/log/l1`), { x: 1 }));
    await assertFails(getDoc(doc(db('teacherA'), `${N}/log/l1`)));
  });
  it('LEGACY: any signed-in user could read and forge queued alerts', async () => {
    await seed(N, alert(), legacyEnv);
    await assertSucceeds(getDoc(doc(db('pupilB', legacyEnv), N)));
    await assertSucceeds(setDoc(doc(db('pupilB', legacyEnv), 'notification_queue/forged'), alert({ status: 'Absent' })));
  });
});

// ============================================================ auditLogs (integrity)
describe('auditLogs — the trail can’t be forged or read by outsiders', () => {
  const L = 'auditLogs/l1';
  const log = (over: Record<string, any> = {}) => ({ schoolId: SCHOOL_A, userName: 'Ms A', action: 'APPLY_WAIVER', details: 'x', userId: 'teacherA', ...over });
  beforeEach(async () => { await seed(L, log()); });

  it('staff write entries for their own school, under their own id (or none)', async () => {
    await assertSucceeds(addDoc(collection(db('teacherA'), 'auditLogs'), log()));
    await assertSucceeds(addDoc(collection(db('adminA'), 'auditLogs'), log({ userId: 'adminA' })));
    await assertSucceeds(addDoc(collection(db('teacherA'), 'auditLogs'), (({ userId, ...r }) => r)(log()))); // retro attendance sync has none
    await assertSucceeds(addDoc(collection(db('teacherA'), 'auditLogs'), log({ userId: null })));
  });
  it('cannot be written in someone else’s name, for another school, or by pupils/parents/anonymous', async () => {
    await assertFails(addDoc(collection(db('teacherA'), 'auditLogs'), log({ userId: 'adminA' })));
    await assertFails(addDoc(collection(db('teacherA'), 'auditLogs'), log({ schoolId: SCHOOL_B })));
    await assertFails(addDoc(collection(db('teacherA'), 'auditLogs'), (({ schoolId, ...r }) => r)(log())));
    for (const who of ['pupilA', 'parentA', 'noDocsUser', 'anon'] as const)
      await assertFails(addDoc(collection(db(who), 'auditLogs'), log({ userId: who })));
  });
  it('staff of the school read their school’s log (the audit page and the teacher’s own entries)', async () => {
    await assertSucceeds(getDocs(query(collection(db('adminA'), 'auditLogs'), where('schoolId', '==', SCHOOL_A))));
    await assertSucceeds(getDocs(query(collection(db('teacherA'), 'auditLogs'), where('schoolId', '==', SCHOOL_A), where('userId', '==', 'teacherA'))));
    await assertSucceeds(getDoc(doc(db('adminA'), L)));
  });
  it('other schools, pupils and parents cannot read it', async () => {
    for (const who of ['adminB', 'teacherB', 'pupilA', 'parentA', 'anon'] as const) await assertFails(getDoc(doc(db(who), L)));
    await assertFails(getDocs(query(collection(db('adminB'), 'auditLogs'), where('schoolId', '==', SCHOOL_A))));
  });
  it('the trail is permanent: only the platform owner can edit or erase', async () => {
    for (const who of ['teacherA', 'adminA', 'adminB', 'pupilA'] as const) {
      await assertFails(updateDoc(doc(db(who), L), { details: 'rewritten' }));
      await assertFails(deleteDoc(doc(db(who), L)));
    }
    await assertSucceeds(updateDoc(doc(db('superAdmin'), L), { details: 'corrected' }));
  });
  it('LEGACY: anyone could forge entries and read every school’s log', async () => {
    await seed(L, log(), legacyEnv);
    await assertSucceeds(addDoc(collection(db('pupilB', legacyEnv), 'auditLogs'), log({ userId: 'adminA' })));
    await assertSucceeds(getDoc(doc(db('pupilB', legacyEnv), L)));
  });
});
