# docs/ai/pages/student/retry-incorrect-questions.md

## Page Overview
**Path:** `src/pages/student/RetryIncorrectQuestionsPage.jsx`
**Route:** `/:instructorId/quizzes/submissions/:submissionId/retry`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
Allows a student to review and retry specifically the questions they answered incorrectly in a previous quiz submission.

## Backend Context
- `GET /quizzes/submissions/:submissionId/retry`
- `POST /retry/submit`

## Visual References
1. `src/pages/student/QuizTakingPage.jsx` (for question card layouts and radio/checkbox inputs)
2. `src/pages/student/QuizResultsPage.jsx` (for contextualizing what was previously wrong)

## Design Intent & Patterns
- **Layout:** Reuses the distraction-free quiz taking interface.
- **Cards:** Question containers must match the existing quiz question cards exactly (clean borders, standard padding).
- **Feedback States:** Clearly display the previously incorrect answer state (using the existing red/error visual token) while allowing a new selection.
- **Progress:** Reuse the existing quiz progress bar/indicator, but scaled to the number of incorrect questions being retried.