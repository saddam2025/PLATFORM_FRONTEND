// src/pages/student/QuizResultsPage.jsx
export const route = {
  path: '/:instructorId/quizzes/:quizId/results/:submissionId',
  index: false,
  auth: 'student',
  title: 'نتيجة الاختبار'
};

import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// Fallback mock used only if the page is opened directly (refresh / shared
// link) without navigation state from QuizTakingPage. Uses the same
// "questions carry studentAnswerIndex inline" shape that the merge logic
// below normalizes real navigation state into.
const MOCK_RESULT = {
  score: 65,
  passingScore: 50,
  passed: true,
  isMonthlyExam: false,
  stageId: 'grade-9',
  questions: [
    {
      id: 'q1',
      text: 'ما ناتج 7 × 8؟',
      options: ['54', '56', '58', '64'],
      correctOptionIndex: 1,
      studentAnswerIndex: 1,
      explanation: 'حاصل ضرب 7 في 8 يساوي 56.'
    },
    {
      id: 'q2',
      text: 'ما هو الجذر التربيعي للعدد 81؟',
      options: ['7', '8', '9', '11'],
      correctOptionIndex: 2,
      studentAnswerIndex: 0,
      explanation: 'الجذر التربيعي لـ 81 هو 9 لأن 9×9=81.'
    },
    {
      id: 'q3',
      text: 'أي مما يلي عدد أولي؟',
      options: ['9', '15', '17', '21'],
      correctOptionIndex: 2,
      studentAnswerIndex: 3,
      explanation: '17 عدد أولي لأنه لا يقبل القسمة إلا على نفسه والواحد.'
    }
  ]
};

export default function QuizResultsPage() {
  const { instructorId, quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const resultData = useMemo(() => {
    const state = location.state;

    if (state && Array.isArray(state.questions)) {
      // QuizTakingPage sends { answers: finalAnswers, score, passed, questions }.
      // `answers` is a flat array positioned by question index (matches
      // quiz.questions order), holding the selected optionIndex or null —
      // it is NOT keyed by question id and questions don't carry
      // studentAnswerIndex inline. Zip them together here so the rest of
      // this page can keep working off a single merged question shape.
      const mergedQuestions = state.questions.map((q, idx) => {
        if (typeof q.studentAnswerIndex === 'number' || q.studentAnswerIndex === null) {
          // Already merged (e.g. a future caller sends the inline shape) —
          // keep backward compatibility, don't overwrite.
          return q;
        }
        const fromAnswersArray = Array.isArray(state.answers) ? state.answers[idx] : null;
        return {
          ...q,
          studentAnswerIndex: typeof fromAnswersArray === 'number' ? fromAnswersArray : null
        };
      });

      return {
        score: typeof state.score === 'number' ? state.score : MOCK_RESULT.score,
        // NOTE: QuizTakingPage doesn't pass passingScore in state today.
        // Defaulting to 50 here per feature #5 (monthly exam pass = 50%),
        // but this should ideally come from the quiz/subscription config
        // once that data is wired up from the backend.
        passingScore: typeof state.passingScore === 'number' ? state.passingScore : 50,
        passed: typeof state.passed === 'boolean' ? state.passed : state.score >= (state.passingScore ?? 50),
        // NOTE: not sent by QuizTakingPage yet — no source of truth for
        // "is this the monthly exam" or the stage id on that page currently.
        // Falls back to false/undefined so the monthly-exam banner simply
        // doesn't render rather than showing incorrect info.
        isMonthlyExam: !!state.isMonthlyExam,
        stageId: state.stageId || null,
        questions: mergedQuestions
      };
    }

    return MOCK_RESULT;
  }, [location.state]);

  const { score, passingScore, passed, isMonthlyExam, stageId, questions } = resultData;

  const incorrectQuestions = useMemo(
    () => questions.filter((q) => q.studentAnswerIndex !== q.correctOptionIndex),
    [questions]
  );

  const goToRetry = () => {
    navigate(`/${instructorId}/quizzes/${quizId}/retry`, {
      state: { questions: incorrectQuestions }
    });
  };

  const goToPlans = () => {
    navigate(`/${instructorId}/stages/${stageId}/plans`);
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-ink-900" dir="rtl">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* 1. Big result card */}
        <section className="rounded-2xl bg-surface-default shadow-card p-8 text-center mb-6">
          <div
            className={`text-5xl font-bold ${passed ? 'text-brand-700' : 'text-danger-DEFAULT'}`}
          >
            {score}%
          </div>

          <div className="mt-4 flex items-center justify-center">
            <Badge variant={passed ? 'success' : 'danger'} className="text-sm">
              {passed ? 'ناجح' : 'لم يحقق النسبة المطلوبة'}
            </Badge>
          </div>

          <p className="text-sm text-ink-500 mt-3">
            الحد الأدنى للنجاح: {passingScore}%
          </p>
        </section>

        {/* 3. Retry-incorrect-questions callout */}
        {incorrectQuestions.length > 0 && (
          <section className="rounded-2xl bg-danger-soft p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-right">
              <div className="text-danger-DEFAULT font-semibold">
                لديك {incorrectQuestions.length} أسئلة تحتاج إعادة محاولة
              </div>
              <p className="text-sm text-ink-700 mt-1">
                راجع إجاباتك الخاطئة أدناه ثم أعد المحاولة لتثبيت المعلومة.
              </p>
            </div>
            <Button variant="primary" onClick={goToRetry}>
              إعادة المحاولة
            </Button>
          </section>
        )}

        {/* 4. Monthly exam pass banner — only renders when the caller
            actually tells us this was the monthly exam and gives a
            stageId; QuizTakingPage doesn't send either yet. */}
        {passed && isMonthlyExam && stageId && (
          <section className="rounded-2xl bg-success-soft p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-right">
              <div className="text-success-DEFAULT font-semibold">
                لقد اجتزت اختبار الشهر بنجاح
              </div>
              <p className="text-sm text-ink-700 mt-1">
                يمكنك الآن الاشتراك في الشهر القادم
              </p>
            </div>
            <Button variant="primary" onClick={goToPlans}>
              الاشتراك في الشهر القادم
            </Button>
          </section>
        )}

        {/* 2. Per-question review */}
        <section className="rounded-2xl bg-surface-default shadow-card p-6">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">مراجعة الأسئلة</h2>

          <div className="space-y-6">
            {questions.map((q, qIndex) => {
              const isCorrect = q.studentAnswerIndex === q.correctOptionIndex;
              return (
                <div key={q.id} className="border-t border-surface-border pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-sm font-medium text-ink-900">
                      {qIndex + 1}. {q.text}
                    </div>
                    <Badge variant={isCorrect ? 'success' : 'danger'} className="text-xs shrink-0">
                      {isCorrect ? 'صحيحة' : 'خاطئة'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => {
                      const isStudentPick = optIndex === q.studentAnswerIndex;
                      const isRightAnswer = optIndex === q.correctOptionIndex;

                      let optionClasses = 'border-surface-border text-ink-700';
                      if (isRightAnswer) {
                        optionClasses = 'border-success-DEFAULT bg-success-soft text-success-DEFAULT';
                      } else if (isStudentPick && !isRightAnswer) {
                        optionClasses = 'border-danger-DEFAULT bg-danger-soft text-danger-DEFAULT';
                      }

                      return (
                        <div
                          key={optIndex}
                          className={`rounded-md border px-3 py-2 text-sm flex items-center justify-between ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {isStudentPick && (
                            <span className="text-xs opacity-75">إجابتك</span>
                          )}
                          {isRightAnswer && !isStudentPick && (
                            <span className="text-xs opacity-75">الإجابة الصحيحة</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!isCorrect && q.explanation && (
                    <div className="mt-3 rounded-md bg-surface-muted p-3 text-sm text-ink-700">
                      <span className="font-medium text-ink-900">الشرح: </span>
                      {q.explanation}
                    </div>
                  )}

                  {q.studentAnswerIndex == null && (
                    <div className="mt-2 text-xs text-ink-500">لم تتم الإجابة على هذا السؤال</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
