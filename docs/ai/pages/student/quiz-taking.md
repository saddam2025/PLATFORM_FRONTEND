# Quiz Taking Page — UI Reference

## 1. Source
`src/pages/student/QuizTakingPage.jsx`[cite: 12]

## 2. Output
`docs/ai/pages/student/quiz-taking.md`

## 3. Implementation Status
Implemented[cite: 12]. Features interactive question step-by-step navigation, choice selection, live countdown timer with urgency state changes, progress dot tracking, auto-submission on time expiration, and submission calculation routing[cite: 12]. Currently uses a client-side mock quiz model (`MOCK_QUIZ`) and navigates to a mock results route (`/quizzes/:quizId/results/mock-submission-1`)[cite: 12].

## 4. Purpose
Serves as the primary active testing environment for students enrolled in a course (`auth: 'required'`, `roles: ['student']`)[cite: 12]. It provides a focused, single-question paginated testing workflow with time constraints, auto-grading calculation upon completion, and seamless transition to score results[cite: 12].

## 5. Reference Image
`quiz-taking.jpeg` (Demonstrates the centered single-question card architecture, dynamic time counter badge, progress dot indicator, radio-style answer selection state, and action navigation bar).

## 6. Visual Reference Sources
- **`src/components/ui/Button.jsx`:** Renders navigation controls ("السابق" and "التالي" / "إنهاء الاختبار")[cite: 12].
- **`src/components/ui/Badge.jsx`:** Renders the real-time countdown timer pill (`info` variant changing to `danger` when $\le 60\text{ seconds}$)[cite: 12].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/courses/:courseId/quizzes/:quizId`[cite: 12].
- **Auth & Access:** Requires student authentication (`auth: 'required'`, `roles: ['student']`)[cite: 12].
- **Data Entity:** Requires `quiz` payload containing `id`, `title`, `passingScore` (default 50%), `timeLimitMinutes` (default 15 mins), and a list of `questions`[cite: 12]. Each question contains `id`, `text`, `options` array, `correctOptionIndex`, and `explanation`[cite: 12].

## 8. Page Anatomy
1. **Quiz Header & Timer:** Header row displaying the quiz title, current question counter ("سؤال X من Y"), and the dynamic countdown badge[cite: 12].
2. **Progress Dots Bar:** A horizontal sequence of circular indicator dots representing total questions, showing current active step and answered status[cite: 12].
3. **Question Card (`<section>`):** A elevated card container (`bg-surface-default shadow-card rounded-2xl`) hosting the question text[cite: 12].
4. **Answer Options Stack:** Vertical list of option selection cards with interactive hover and selected states[cite: 12].
5. **Navigation Action Bar:** Footer row hosting the "السابق" (Previous) button on the start side and "التالي" / "إنهاء الاختبار" (Next / Finish) primary button on the end side[cite: 12].

## 9. Layout Specification
- **Container:** Centered max-width column layout: `max-w-2xl mx-auto space-y-6`[cite: 12].
- **Header Flex:** `flex items-center justify-between` separating text metadata from the timer badge[cite: 12].
- **Progress Container:** `flex items-center gap-2`[cite: 12].
- **Main Card:** `bg-surface-default rounded-2xl shadow-card p-6 space-y-4`[cite: 12].
- **Option Stack:** Stacked vertical buttons using `space-y-2`[cite: 12].
- **Footer Flex:** `flex items-center justify-between` spacing out "السابق" and "التالي" action buttons[cite: 12].

## 10. Visual Specification
- **Selected Option:** `bg-brand-50 border-brand-500 text-ink-900` (highlighted tint with active border)[cite: 12].
- **Unselected Option:** `bg-surface-muted border-transparent text-ink-700 hover:border-surface-border`[cite: 12].
- **Current Progress Dot:** `w-2.5 h-2.5 rounded-full bg-brand-500`[cite: 12].
- **Answered Progress Dot:** `w-2.5 h-2.5 rounded-full bg-brand-200`[cite: 12].
- **Unanswered Progress Dot:** `w-2.5 h-2.5 rounded-full bg-surface-muted`[cite: 12].
- **Timer Badge (> 60s):** `<Badge variant="info">` rendering `MM:SS`[cite: 12].
- **Timer Badge Warning ($\le$ 60s):** `<Badge variant="danger">` rendering `MM:SS`[cite: 12].

## 11. Reusable Quiz UI Patterns & Reference for Retry Page

`QuizTakingPage` serves as the **PRIMARY visual reference** for `RetryIncorrectQuestionsPage` and all interactive test-taking views across the platform[cite: 12]. The following core visual and functional patterns must be re-used identically in retry workflows:

- **Single-Question Card Pattern:** A centered, distraction-free elevated white container (`bg-surface-default shadow-card rounded-2xl p-6`) focusing student attention on one question at a time[cite: 12].
- **Interactive Option Button Cards:** Stacked full-width button blocks (`w-full text-right px-4 py-3 rounded-lg border transition-colors`) that visually replace native radio buttons, using brand color fills (`bg-brand-50 border-brand-500`) for selection feedback[cite: 12].
- **Progress Dot Navigation Track:** A horizontal dot strip representing total items, dynamically applying step states (`bg-brand-500` for active, `bg-brand-200` for answered, `bg-surface-muted` for pending)[cite: 12].
- **Gated Step Validation:** The primary action button ("التالي") remains strictly disabled (`disabled={answers[currentIndex] == null}`) until an option is selected for the current question[cite: 12].
- **Final Action Transformation:** The primary action button automatically morphs its label from "التالي" to "إنهاء الاختبار" on the final question of the sequence[cite: 12].

## 12. User Interactions & Logic Workflow
- **Selecting an Answer:** Clicking an option button triggers `selectOption(idx)`, updating the `answers` array at `currentIndex`[cite: 12].
- **Forward Navigation (`handleNext`):** If not on the last question, increments `currentIndex` by 1[cite: 12].
- **Backward Navigation (`handlePrev`):** Decrements `currentIndex` by 1 down to 0 (`Math.max(0, i - 1)`)[cite: 12].
- **Submitting Quiz:** On the final question, clicking "إنهاء الاختبار" executes `finishQuiz(answers)`[cite: 12].
- **Automatic Time Expiry:** A `setInterval` timer decrements `secondsLeft` every second[cite: 12]. When `secondsLeft <= 0`, `useEffect` automatically triggers `finishQuiz(answers)`, submitting whatever answers were selected up to that point[cite: 12].
- **Double Submission Lock:** `finishedRef.current` ensures `finishQuiz` executes exactly once, preventing double-navigation or duplicate score calculation requests[cite: 12].

## 13. UI States
- **Unselected Question State:** Options are in `bg-surface-muted` state; "التالي" button is `disabled`[cite: 12].
- **Option Selected State:** Clicked option highlights with `bg-brand-50 border-brand-500`; "التالي" button becomes enabled[cite: 12].
- **First Question State:** "السابق" button is disabled (`currentIndex === 0`)[cite: 12].
- **Last Question State:** "التالي" button text changes to "إنهاء الاختبار"[cite: 12].
- **Timer Normal State:** Timer badge variant is `info`[cite: 12].
- **Timer Warning State ($\le$ 60 seconds):** Timer badge variant switches to `danger` to signal urgency[cite: 12].

## 14. Responsive & Mobile Behavior
- Container uses `max-w-2xl mx-auto px-4` to ensure appropriate padding and reading line lengths on both mobile viewports and desktop monitors[cite: 12].
- Option buttons remain full width (`w-full`), stacking vertically to comfortably fit complex mathematical formulas or multi-line questions on mobile screens[cite: 12].
- Action footer uses flex alignment (`justify-between`) to maintain thumb-friendly button placement on handheld devices[cite: 12].

## 15. RTL Behavior
- Page root specifies `dir="rtl"`[cite: 12].
- Title and option text align to the right (`text-right`)[cite: 12].
- Action button positions respect RTL flow: "السابق" rests on the right end and "التالي" / "إنهاء الاختبار" rests on the left end[cite: 12].

## 16. Motion & Micro-interactions
- Option buttons utilize `transition-colors` for smooth background tinting and border color shifts on hover/selection[cite: 12].
- Progress dot indicators update fill colors seamlessly as the student moves across questions[cite: 12].

## 17. Data & Business Rules
- **Score Calculation:** Score is calculated as `Math.round((correctCount / totalQuestions) * 100)`[cite: 12].
- **Passing Threshold:** Student passes if `score >= quiz.passingScore` (default passing score is 50%)[cite: 12].
- **Results Payload Transfer:** Navigates to the submission results view, passing `{ answers, score, passed, questions }` in `location.state`[cite: 12].

## 18. Do Not Change
- Do not remove the single-question paginated step model[cite: 12].
- Do not remove `finishedRef` guard preventing double-submissions on auto-expiry[cite: 12].
- Do not modify the `location.state` contract (`answers`, `score`, `passed`, `questions`) passed to `QuizResultsPage`[cite: 12].

## 19. Implementation Instructions
1. **API Integration:** Wire `quiz` state to fetch real quiz data using `quizId` via backend hook (e.g., `useQuiz(quizId)`).
2. **Submission Persist:** Replace mock navigation with an API submission call (e.g., `submitQuizAnswers`) before navigating to the submission results route.
3. **Unsaved Progress Guard:** Add a browser unload/leave warning hook to alert students if they attempt to navigate away while a timed quiz is in progress.

## 20. Definition of Done
- Single question card displays option choices with active selection highlighting[cite: 12].
- Progress dots accurately reflect active, answered, and unanswered steps[cite: 12].
- Countdown timer decreases continuously and automatically submits the quiz when time expires[cite: 12].
- Next button remains disabled until an answer is chosen for the current question[cite: 12].
- Submitting navigates cleanly to the results page with full submission payload[cite: 12].