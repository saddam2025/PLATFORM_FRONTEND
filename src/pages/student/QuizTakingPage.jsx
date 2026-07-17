// src/pages/student/QuizTakingPage.jsx
export const route = {
  path: '/:instructorId/courses/:courseId/quizzes/:quizId',
  index: false,
  auth: 'required',
  roles: ['student'],
  title: 'الاختبار',
};

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_QUIZ = {
  id: 'quiz-1',
  title: 'اختبار: معادلات الدرجة الأولى',
  passingScore: 50,
  timeLimitMinutes: 15,
  questions: [
    {
      id: 'q1',
      text: 'ما هو حل المعادلة: 2x + 4 = 10؟',
      options: ['x = 2', 'x = 3', 'x = 4', 'x = 6'],
      correctOptionIndex: 1,
      explanation: 'بطرح 4 من الطرفين ثم القسمة على 2 نحصل على x = 3.',
    },
    {
      id: 'q2',
      text: 'أي مما يلي معادلة من الدرجة الأولى؟',
      options: ['x² + 1 = 0', '3x - 5 = 7', 'x³ = 27', '1/x = 2'],
      correctOptionIndex: 1,
      explanation: 'المعادلة من الدرجة الأولى تحتوي على المتغير بأس واحد فقط.',
    },
    {
      id: 'q3',
      text: 'ما ناتج حل المعادلة: x - 7 = 0؟',
      options: ['x = -7', 'x = 0', 'x = 7', 'x = 1'],
      correctOptionIndex: 2,
      explanation: 'بإضافة 7 للطرفين نحصل على x = 7.',
    },
    {
      id: 'q4',
      text: 'إذا كان 5x = 20، فإن قيمة x تساوي؟',
      options: ['2', '3', '4', '5'],
      correctOptionIndex: 2,
      explanation: 'بقسمة الطرفين على 5 نحصل على x = 4.',
    },
    {
      id: 'q5',
      text: 'ما هو الحل الصحيح للمعادلة: 3(x + 2) = 15؟',
      options: ['x = 1', 'x = 3', 'x = 5', 'x = 7'],
      correctOptionIndex: 1,
      explanation: 'بتوزيع 3 نحصل على 3x + 6 = 15، ثم 3x = 9، ثم x = 3.',
    },
  ],
};

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function QuizTakingPage() {
  const { instructorId, quizId } = useParams();
  const navigate = useNavigate();

  const quiz = { ...MOCK_QUIZ, id: quizId || MOCK_QUIZ.id };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [secondsLeft, setSecondsLeft] = useState(quiz.timeLimitMinutes * 60);
  const finishedRef = useRef(false);

  const finishQuiz = React.useCallback(
    (finalAnswers) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const correctCount = quiz.questions.reduce((acc, q, idx) => {
        return finalAnswers[idx] === q.correctOptionIndex ? acc + 1 : acc;
      }, 0);
      const score = Math.round((correctCount / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;

      navigate(`/${instructorId}/quizzes/${quiz.id}/results/mock-submission-1`, {
        state: { answers: finalAnswers, score, passed, questions: quiz.questions },
      });
    },
    [instructorId, navigate, quiz]
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      finishQuiz(answers);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;

  const selectOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz(answers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div dir="rtl" className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">{quiz.title}</h1>
          <p className="text-sm text-ink-500 mt-1">
            سؤال {currentIndex + 1} من {quiz.questions.length}
          </p>
        </div>
        <Badge variant={secondsLeft <= 60 ? 'danger' : 'info'}>{formatTime(secondsLeft)}</Badge>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {quiz.questions.map((_, idx) => (
          <span
            key={idx}
            className={`w-2.5 h-2.5 rounded-full ${
              idx === currentIndex
                ? 'bg-brand-500'
                : answers[idx] != null
                ? 'bg-brand-200'
                : 'bg-surface-muted'
            }`}
          />
        ))}
      </div>

      <div className="bg-surface-default rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-medium text-ink-900">{question.text}</h2>

        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const selected = answers[currentIndex] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectOption(idx)}
                className={`w-full text-right px-4 py-3 rounded-lg border transition-colors ${
                  selected
                    ? 'bg-brand-50 border-brand-500 text-ink-900'
                    : 'bg-surface-muted border-transparent text-ink-700 hover:border-surface-border'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handlePrev} disabled={currentIndex === 0}>
          السابق
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={answers[currentIndex] == null}
        >
          {isLast ? 'إنهاء الاختبار' : 'التالي'}
        </Button>
      </div>
    </div>
  );
}