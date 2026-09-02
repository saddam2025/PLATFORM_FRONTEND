export const route = { path: ['/:instructorId/courses/:courseId/quizzes/:quizId', '/:instructorId/quiz/take/:quizId'], index: false, auth: 'required', roles: ['student'], title: 'الاختبار' };

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import QuizQuestionNavigator from '../../components/quiz/QuizQuestionNavigator';
import quizService from '../../services/quizService';
import subscriptionService from '../../services/subscriptionService';

const errorMessage = (error, fallback) => error?.message || fallback;

export default function QuizTakingPage() {
  const { instructorId, quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answersByQuestionId, setAnswersByQuestionId] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const subscriptionId = location.state?.monthlyExam?.subscriptionId;

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await quizService.getQuiz(quizId);
      const received = response?.data?.data;
      if (!received || !Array.isArray(received.questions)) throw new Error('استجابة الاختبار غير صالحة.');
      setQuiz(received); setAnswersByQuestionId({}); setCurrentIndex(0);
    } catch (requestError) { setError(errorMessage(requestError, 'تعذر تحميل الاختبار. حاول مرة أخرى.')); }
    finally { setLoading(false); }
  }, [quizId]);

  useEffect(() => { load(); }, [load]);
  const answers = useMemo(() => quiz?.questions.map((question) => answersByQuestionId[question._id] ?? null) || [], [quiz, answersByQuestionId]);
  const selectOption = (optionIndex) => setAnswersByQuestionId((current) => ({ ...current, [quiz.questions[currentIndex]._id]: optionIndex }));
  const submit = async () => {
    if (!quiz || answers.some((answer) => answer == null)) return;
    setSubmitting(true); setSubmitError('');
    try {
      const response = quiz.type === 'monthly_exam'
        ? await subscriptionService.submitMonthlyExam(subscriptionId, answers)
        : await quizService.submitQuiz(quizId, answers);
      const result = response?.data?.data;
      if (!result?.submissionId) throw new Error('استجابة الإرسال لا تحتوي على معرف المحاولة.');
      navigate(`/${instructorId}/quizzes/${quizId}/results/${result.submissionId}`);
    } catch (requestError) { setSubmitError(errorMessage(requestError, 'تعذر إرسال إجابات الاختبار. حاول مرة أخرى.')); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div dir="rtl" className="rounded-2xl bg-surface-default p-8 text-center text-ink-500 shadow-card">جارٍ تحميل الاختبار...</div>;
  if (error) return <div dir="rtl" role="alert" className="rounded-2xl bg-danger-soft p-6 text-center text-danger-DEFAULT"><p>{error}</p><Button variant="subtle" className="mt-4" onClick={load}>إعادة المحاولة</Button></div>;
  if (!quiz || quiz.questions.length === 0) return <div dir="rtl" className="rounded-2xl bg-surface-default p-8 text-center text-ink-500 shadow-card">لا توجد أسئلة متاحة لهذا الاختبار.</div>;
  if (quiz.type === 'monthly_exam' && !subscriptionId) return <div dir="rtl" role="alert" className="rounded-2xl bg-danger-soft p-6 text-center text-danger-DEFAULT">يجب بدء اختبار الشهر من صفحة اختبار الشهر للتحقق من الاشتراك.</div>;
  return <div dir="rtl" className="mx-auto max-w-2xl space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-xl font-semibold text-ink-900">{quiz.type === 'monthly_exam' ? `اختبار الشهر ${quiz.month}` : 'اختبار الدرس'}</h1><p className="mt-1 text-sm text-ink-500">سؤال {currentIndex + 1} من {quiz.questions.length}</p></div>{quiz.timeLimitMinutes && <Badge variant="info">{quiz.timeLimitMinutes} دقيقة</Badge>}</div>{submitError && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-danger-DEFAULT">{submitError}</p>}<QuizQuestionNavigator questions={quiz.questions} currentIndex={currentIndex} answers={answers} onSelect={selectOption} onPrevious={() => setCurrentIndex((index) => Math.max(0, index - 1))} onNext={() => currentIndex === quiz.questions.length - 1 ? submit() : setCurrentIndex((index) => index + 1)} submitting={submitting} submitLabel={submitting ? 'جارٍ الإرسال...' : 'إرسال الاختبار'} /></div>;
}
