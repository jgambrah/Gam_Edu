"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizAnswerVault = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const quiz_answer_split_1 = require("./quiz-answer-split");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
/**
 * Keeps quiz answer keys away from students.
 *
 * Teachers keep creating quizzes exactly as before (questions with `correctAnswer` / `explanation`). As soon
 * as such a quiz is saved, this function moves the answers into `quizKeys/{quizId}` — readable only by that
 * school's teachers and admins (see firestore.rules) — and removes them from the quiz document that
 * students read. Grading happens on the server (submitQuizAttemptAction), which reads the key.
 *
 * Runs again on later edits: if a teacher saves answers again, the key is replaced; if a save carries no
 * answers (e.g. a title change), the existing key is left alone.
 */
exports.quizAnswerVault = (0, firestore_1.onDocumentWritten)('quizzes/{quizId}', async (event) => {
    var _a, _b;
    const after = (_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after) === null || _b === void 0 ? void 0 : _b.data();
    if (!after)
        return; // deleted
    const split = (0, quiz_answer_split_1.splitQuizAnswers)(after);
    if (!split)
        return; // nothing to hide (also stops this function re-triggering itself)
    const quizId = event.params.quizId;
    const batch = db.batch();
    batch.set(db.collection('quizKeys').doc(quizId), {
        quizId,
        schoolId: after.schoolId || '',
        teacherId: after.teacherId || '',
        classId: after.classId || '',
        keys: split.keys,
        updatedAt: firestore_2.FieldValue.serverTimestamp(),
    });
    batch.update(db.collection('quizzes').doc(quizId), {
        questions: split.stripped,
        answersHidden: true,
    });
    await batch.commit();
});
//# sourceMappingURL=quiz-answer-vault.js.map