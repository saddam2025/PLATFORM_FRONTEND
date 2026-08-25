# Quiz Results Page — UI Reference

## 1. Source
`src/pages/student/QuizResultsPage.jsx`[cite: 11]

## 2. Output
`docs/ai/pages/student/quiz-results.md`

## 3. Implementation Status
Implemented[cite: 11]. The page features score calculation, status badge presentation, incorrect answer callouts with retry triggers, monthly exam pass banners, and an itemized per-question review[cite: 11]. It supports both direct navigation state passed from `QuizTakingPage` and a fallback `MOCK_RESULT` for direct link accesses or page reloads[cite: 11].

## 4. Purpose
Presents the evaluation summary and breakdown of a student's completed quiz or exam submission[cite: 11]. It gives students immediate feedback on their score, indicates pass/fail status, highlights incorrect questions, provides detailed explanations, and offers actionable next steps (such as retrying missed questions or proceeding to stage plan subscriptions)[cite: 11].

## 5. Reference Image
`quiz-results.jpeg` (Provides visual context for the top hero header, main score percentage display, status pill, and detailed answer review items).

## 6. Visual Reference Sources
- **`src/components/ui/Badge.jsx`:** Displays "ناجح" (Passed) or "لم يحقق النسبة المطلوبة" (Did not achieve required score) status tags, as well as per-question correctness badges ("صحيحة" / "خاطئة")[cite: 11].
- **`src/components/ui/Button.jsx`:** Renders call-to-action triggers for re-attempting incorrect questions or advancing to subscription plans[cite: 11].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/quizzes/:quizId/results/:submissionId`[cite: 11].
- **Auth & Access:** Requires student authorization (`auth: 'student'`)[cite: 11].
- **Data Entity:** Requires submission evaluation details including `score`, `passingScore`, `passed`, `isMonthlyExam`, `stageId`, and a `questions` array[cite: 11]. Each question item contains `id`, `text`, `options`, `correctOptionIndex`, `studentAnswerIndex`, and `explanation`[cite: 11].

## 8. Page Anatomy
1. **Result Hero Summary Card:** Prominently presents the percentage score in extra-large typography, a success/danger status badge, and the passing threshold footnote[cite: 11].
2. **Retry Callout Banner:** Conditional callout appearing when incorrect questions exist, offering a direct action button to retry missed items[cite: 11].
3. **Monthly Exam Progression Banner:** Conditional banner appearing when a student passes a monthly exam, prompting them to subscribe to the upcoming month's plans[cite: 11].
4. **Question Review List Card:** Comprehensive section itemizing each question, question-level pass/fail badges, multi-column option cards (highlighting student picks vs. correct answers), explanatory notes, and unanswered warnings[cite: 11].

## 9. Layout Specification
- **Container:** Wrapped in `min-h-screen bg-surface-canvas text-ink-900` with an inner container `container mx-auto px-4 py-6 max-w-3xl`[cite: 11].
- **Vertical Rhythm:** Main blocks utilize bottom margins (`mb-6`) for consistent spacing[cite: 11].
- **Option Grid:** Individual question options map into a 2-column responsive layout via `grid grid-cols-1 md:grid-cols-2 gap-2`[cite: 11].

## 10. Visual Specification
- **Score Presentation:**
  - Passed: `text-5xl font-bold text-brand-700`[cite: 11].
  - Failed: `text-5xl font-bold text-danger-DEFAULT`[cite: 11].
- **Retry Banner:** Uses soft danger background (`bg-danger-soft p-5 rounded-2xl flex items-center justify-between gap-4 flex-wrap`)[cite: 11].
- **Monthly Exam Pass Banner:** Uses soft success background (`bg-success-soft p-5 rounded-2xl flex items-center justify-between gap-4 flex-wrap`)[cite: 11].
- **Option State Styling:**
  - Correct Answer: `border-success-DEFAULT bg-success-soft text-success-DEFAULT`[cite: 11].
  - Incorrect Student Choice: `border-danger-DEFAULT bg-danger-soft text-danger-DEFAULT`[cite: 11].
  - Default Unselected Option: `border-surface-border text-ink-700`[cite: 11].
- **Explanations:** Container styled as `mt-3 rounded-md bg-surface-muted p-3 text-sm text-ink-700`[cite: 11].

## 11. Visual Connection to Quiz Taking Experience
To maintain a seamless visual continuity between `QuizTakingPage` and `QuizResultsPage`:
- **Matching Question Architecture:** Options reuse the same option border padding, font weight, and container structures as the interactive options on `QuizTakingPage`[cite: 11].
- **Color Identity:** The brand colors for selection and active states during testing transition directly to green (`bg-success-soft`) and red (`bg-danger-soft`) feedback states upon completion[cite: 11].
- **Badge Language:** Question status badges ("صحيحة" / "خاطئة") maintain the same design tokens (`Badge` component) used for system status indicators across the student experience[cite: 11].
- **Canvas Continuity:** Both pages sit on `bg-surface-canvas` within a centered `max-w-3xl` layout column, keeping the student's reading focus constrained to an identical container width[cite: 11].

## 12. Component Reuse
- `Badge`: Used for pass/fail score status and individual question status tags[cite: 11].
- `Button`: Used for primary actions ("إعادة المحاولة", "الاشتراك في الشهر القادم")[cite: 11].

## 13. User Interactions
- **Retry Action (`goToRetry`):** Filters for incorrect questions (`q.studentAnswerIndex !== q.correctOptionIndex`) and navigates to `/:instructorId/quizzes/:quizId/retry`, passing the subset of failed questions via `location.state`[cite: 11].
- **Subscription Action (`goToPlans`):** Navigates to `/:instructorId/stages/:stageId/plans` when the monthly exam is passed[cite: 11].

## 14. UI States
- **Passing State (`passed = true`):** Score is displayed in brand primary text, badge shows "ناجح" in `success` variant[cite: 11].
- **Failing State (`passed = false`):** Score is displayed in danger text, badge shows "لم يحقق النسبة المطلوبة" in `danger` variant[cite: 11].
- **Incorrect Question Presence:** Triggers the display of the retry callout box[cite: 11].
- **Unanswered Question State:** Displays an explicit text note `"لم تتم الإجابة على هذا السؤال"` below options when `studentAnswerIndex == null`[cite: 11].
- **Fallback Data State:** Normalizes state from `QuizTakingPage` if available, or seamlessly renders `MOCK_RESULT` if accessed directly[cite: 11].

## 15. Responsive Behavior
- **Mobile (`< md`):** Callout banners stack content and buttons vertically via `flex-wrap`[cite: 11]. Answer choices render as a single vertical column (`grid-cols-1`)[cite: 11].
- **Tablet/Desktop (`≥ md`):** Answer choices render in a side-by-side 2-column grid (`md:grid-cols-2`)[cite: 11].

## 16. RTL Behavior
- Page root specifies `dir="rtl"`[cite: 11].
- Text aligns right by default (`text-right`) in banner and review titles[cite: 11].
- Option labels and "إجابتك" / "الإجابة الصحيحة" status indicators align seamlessly to opposing ends of the option row using `justify-between`[cite: 11].

## 17. Motion & Micro-interactions
- Buttons inherit standard focus and active state scale transitions.
- Interactive retry callouts utilize standard flex wrapper alignment for natural layout shifts when banners appear.

## 18. Data & Business Rules
- **Score Normalization:** Normalizes flat answer arrays received from `QuizTakingPage` with question objects to derive `studentAnswerIndex`[cite: 11].
- **Passing Grade Threshold:** Default passing score requirement is set to 50% (`passingScore: 50`), adhering to standard stage progression logic[cite: 11].
- **Retry Isolation:** Retrying a quiz passes *only* the subset of incorrectly answered questions to the retry view[cite: 11].
- **Monthly Progression Enforcement:** The monthly exam success banner displays *only* when `passed = true`, `isMonthlyExam = true`, and a valid `stageId` is present[cite: 11].

## 19. Do Not Change
- Do not modify the normalization logic merging `state.answers` into question items in `useMemo`[cite: 11].
- Do not alter the route parameter contract (`/:instructorId/quizzes/:quizId/results/:submissionId`)[cite: 11].
- Do not change the fallback behavior supplying `MOCK_RESULT` on missing location state[cite: 11].

## 20. Implementation Instructions
1. **API Data Wireup:** Replace `MOCK_RESULT` fallback with a dedicated backend query hook (e.g., `useQuizSubmission(submissionId)`) to handle page refreshes cleanly via server state.
2. **Navigation State Payload:** Ensure `QuizTakingPage` passes `isMonthlyExam` and `stageId` in `location.state` so monthly pass banners render properly without relying on fallback defaults[cite: 11].
3. **Analytics Integration:** Dispatch completion telemetry events on mount including score, pass/fail status, and count of incorrect questions.

## 21. Definition of Done
- Score percentage and pass/fail badges correctly reflect performance according to `passingScore`[cite: 11].
- Option choices accurately display green highlights for correct answers and red highlights for incorrect student picks[cite: 11].
- Retrying incorrect questions passes the exact failed subset to the retry handler[cite: 11].
- Page operates gracefully whether arriving directly via URL parameter or via state transition from `QuizTakingPage`[cite: 11].
- The layout complies with all RTL alignment standards and responsive design guidelines[cite: 11].