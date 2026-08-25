// src/pages/admin/QuizBuilderPage.jsx
export const route = {
  path: ['/:instructorId/admin/quiz-builder', '/:instructorId/admin/courses/:courseId/quizzes/manage'],
  index: false,
  auth: 'required',
  roles: ['admin', 'teacher'],
  title: 'منشئ الاختبارات'
};

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function makeEmptyQuestion() {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    points: 1,
    explanation: ''
  };
}

export default function QuizBuilderPage() {
  const { instructorId, courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(50);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [questions, setQuestions] = useState([makeEmptyQuestion()]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const updateQuestion = (qIndex, patch) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === qIndex ? { ...q, ...patch } : q))
    );
  };

  const updateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qIndex) return q;
        const nextOptions = [...q.options];
        nextOptions[optIndex] = value;
        return { ...q, options: nextOptions };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, makeEmptyQuestion()]);
  };

  const removeQuestion = (qIndex) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex));
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'عنوان الاختبار مطلوب';
    if (!passingScore || passingScore < 1 || passingScore > 100) {
      nextErrors.passingScore = 'يجب أن تكون النسبة بين 1 و 100';
    }
    if (!timeLimitMinutes || timeLimitMinutes < 1) {
      nextErrors.timeLimitMinutes = 'مدة الاختبار غير صالحة';
    }
    if (questions.length === 0) nextErrors.questions = 'أضف سؤالاً واحداً على الأقل';

    questions.forEach((q, idx) => {
      if (!q.text.trim()) nextErrors[`q-${idx}-text`] = 'نص السؤال مطلوب';
      q.options.forEach((opt, optIdx) => {
        if (!opt.trim()) nextErrors[`q-${idx}-opt-${optIdx}`] = 'مطلوب';
      });
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setShowSuccess(false);
      return;
    }

    const payload = {
      courseId,
      title,
      passingScore: Number(passingScore),
      timeLimitMinutes: Number(timeLimitMinutes),
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        points: Number(q.points) || 1,
        explanation: q.explanation
      }))
    };

    // Mock save — no quizService/backend endpoint exists yet.
    // eslint-disable-next-line no-console
    console.log('Quiz payload (mock save):', payload);

    setShowSuccess(true);
    setTimeout(() => {
      navigate(`/${instructorId}/admin/courses`);
    }, 1200);
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">منشئ الاختبارات</h1>
        <p className="text-sm text-ink-500 mt-1">إنشاء اختبار جديد للدورة</p>
      </div>

      {showSuccess && (
        <div className="rounded-2xl bg-success-soft p-4 text-success-DEFAULT text-sm font-medium">
          تم حفظ الاختبار بنجاح، جارٍ التحويل...
        </div>
      )}

      {/* Basic settings */}
      <div className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-medium text-ink-900">إعدادات الاختبار</h2>

        <div>
          <label className="block text-sm text-ink-700 mb-1">عنوان الاختبار</label>
          <Input
            placeholder="مثال: اختبار الشهر الأول"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink-700 mb-1">نسبة النجاح (%)</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
              error={errors.passingScore}
            />
          </div>
          <div>
            <label className="block text-sm text-ink-700 mb-1">مدة الاختبار (بالدقائق)</label>
            <Input
              type="number"
              min={1}
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(e.target.value)}
              error={errors.timeLimitMinutes}
            />
          </div>
        </div>
      </div>

      {/* Questions builder */}
      <div className="bg-surface-default rounded-2xl shadow-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink-900">الأسئلة</h2>
          {errors.questions && (
            <span className="text-xs text-danger-DEFAULT">{errors.questions}</span>
          )}
        </div>

        {questions.map((q, qIndex) => (
          <div key={q.id} className="border border-surface-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">السؤال {qIndex + 1}</h3>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger-DEFAULT"
                  onClick={() => removeQuestion(qIndex)}
                >
                  حذف
                </Button>
              )}
            </div>

            <div>
              <label className="block text-sm text-ink-700 mb-1">نص السؤال</label>
              <Input
                placeholder="اكتب نص السؤال هنا"
                value={q.text}
                onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                error={errors[`q-${qIndex}-text`]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctOptionIndex === optIndex}
                    onChange={() => updateQuestion(qIndex, { correctOptionIndex: optIndex })}
                    className="shrink-0"
                    aria-label={`تحديد الخيار ${optIndex + 1} كإجابة صحيحة`}
                  />
                  <Input
                    placeholder={`الخيار ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    error={errors[`q-${qIndex}-opt-${optIndex}`]}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-ink-700 mb-1">الدرجة</label>
                <Input
                  type="number"
                  min={1}
                  value={q.points}
                  onChange={(e) => updateQuestion(qIndex, { points: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-ink-700 mb-1">الشرح (يظهر عند الإجابة الخاطئة بعد إعادة المحاولة)</label>
                <Input
                  placeholder="اشرح سبب الإجابة الصحيحة"
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="ghost" onClick={addQuestion}>
          إضافة سؤال
        </Button>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          حفظ الاختبار
        </Button>
      </div>
    </div>
  );
}
