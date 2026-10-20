"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitQuizAnswers = splitQuizAnswers;
/** Pure helper shared by the quizAnswerVault function and the one-time hide-quiz-answers.js script. */
function splitQuizAnswers(quiz) {
    const questions = Array.isArray(quiz === null || quiz === void 0 ? void 0 : quiz.questions) ? quiz.questions : [];
    const hasAnswers = questions.some(q => { var _a, _b; return q && (((_a = q.correctAnswer) !== null && _a !== void 0 ? _a : '') !== '' || ((_b = q.explanation) !== null && _b !== void 0 ? _b : '') !== ''); });
    if (!hasAnswers)
        return null;
    const keys = questions.map(q => { var _a, _b; return ({ correctAnswer: String((_a = q === null || q === void 0 ? void 0 : q.correctAnswer) !== null && _a !== void 0 ? _a : ''), explanation: String((_b = q === null || q === void 0 ? void 0 : q.explanation) !== null && _b !== void 0 ? _b : '') }); });
    const stripped = questions.map(q => {
        if (!q || typeof q !== 'object')
            return q;
        const { correctAnswer, explanation } = q, rest = __rest(q, ["correctAnswer", "explanation"]);
        return rest;
    });
    return { stripped, keys };
}
//# sourceMappingURL=quiz-answer-split.js.map