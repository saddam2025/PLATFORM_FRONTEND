# QuizBuilderPage — UI Reference

## Source Page

`src/pages/admin/QuizBuilderPage.jsx`

## Backend / Feature Context

The `QuizBuilderPage` currently functions as a client-side mock implementation[cite: 9]. Data is validated and aggregated into a JSON payload upon submission, which is then logged to the console rather than sent to a backend API[cite: 9]. Form validation ensures that titles, parameters, and question fields are populated before allowing submission[cite: 9].

## Reference Image

`design-reference/admin/quiz-builder.jpeg`

## Purpose

This page allows instructors and administrators to create and configure quizzes for specific courses[cite: 9]. It provides tools to set quiz metadata (title, passing score, time limit) and an interactive builder to add, remove, and configure multiple-choice questions along with their answers and explanations[cite: 9].

## Current Structure

The form is vertically structured into the following key areas:
1.  **Header:** Displays the page title ("منشئ الاختبارات") and a brief subtitle[cite: 9].
2.  **Success Banner:** A conditional message ("تم حفظ الاختبار بنجاح، جارٍ التحويل...") that appears after a successful mock submission[cite: 9].
3.  **Basic Settings:** A section containing inputs for the quiz title, passing score percentage, and time limit in minutes[cite: 9].
4.  **Questions Builder:** A dynamic list where users can define questions, options, specify the correct answer via radio buttons, assign points, and provide an explanation for incorrect answers[cite: 9].
5.  **Actions:** An "إضافة سؤال" (Add Question) button and a primary "حفظ الاختبار" (Save Quiz) submission button[cite: 9].

## Visual Direction

There is a structural and stylistic variance between the current implementation and the `quiz-builder.jpeg` reference image. 
*   **Card Structure:** The codebase groups all questions inside a single large card wrapper (`bg-surface-default rounded-2xl shadow-card p-6`)[cite: 9]. The reference image isolates each individual question into its own separate card.
*   **Input Styling:** The reference image depicts form fields as soft, borderless, filled rectangles, whereas the current codebase delegates styling to the standard `<Input />` component which traditionally includes borders[cite: 9].
*   **Action Placement:** The "Add Question" button in the reference image floats near the top left, while the code places it at the bottom of the question list[cite: 9]. The save button is centered at the bottom of the reference image, but right-aligned in the code (`flex justify-end`)[cite: 9].

## Layout

*   **Container:** Uses a constrained, centered layout via `max-w-3xl mx-auto space-y-6`[cite: 9].
*   **Settings Grid:** The score and time limit inputs sit side-by-side on larger screens using `grid grid-cols-1 sm:grid-cols-2 gap-4`[cite: 9].
*   **Questions Layout:** Individual questions employ an internal grid (`grid-cols-1 sm:grid-cols-2` for options, `sm:grid-cols-3` for points and explanations) to manage spatial distribution[cite: 9].

## Typography

*   **Page Title:** `text-xl font-semibold text-ink-900`[cite: 9].
*   **Section Headings:** `text-lg font-medium text-ink-900`[cite: 9].
*   **Question Labels:** `text-sm font-semibold text-ink-900`[cite: 9].
*   **Input Labels & Helper Text:** `text-sm text-ink-700` and `text-sm text-ink-500`[cite: 9].

## Components

*   `Input`: `../../components/ui/Input`[cite: 9].
*   `Button`: `../../components/ui/Button`[cite: 9].

## Actions

*   **Add Question:** Appends a new, empty question object to the `questions` array[cite: 9].
*   **Remove Question:** Deletes a specific question from the array by its index[cite: 9].
*   **Select Correct Option:** Standard HTML radio buttons (`type="radio"`) that update the `correctOptionIndex` for a given question[cite: 9].
*   **Save Quiz:** Triggers validation, logs the mock payload, displays the success banner, and initiates a simulated redirect[cite: 9].

## States

*   **Validation Errors:** If submission fails, localized error messages populate beneath the specific empty inputs or invalid fields (e.g., passing score > 100)[cite: 9].
*   **Success State:** Upon valid submission, the `showSuccess` state renders a green `bg-success-soft` notification banner[cite: 9].
*   **Dynamic UI:** The "حذف" (Delete) button for questions is conditionally hidden if only one question remains in the builder (`questions.length > 1`)[cite: 9].

## Responsive Behavior

*   The layout utilizes CSS grid breakpoints (`sm:grid-cols-2`, `sm:grid-cols-3`) to collapse side-by-side inputs into a single column on mobile devices[cite: 9].

## RTL

*   The root container explicitly enforces right-to-left rendering via the `dir="rtl"` attribute[cite: 9].

## Data / Business Logic Constraints

*   **Validation:** A quiz cannot be saved unless it possesses a title, a passing score (1-100), a time limit (>1), at least one question, and all question/option texts are filled[cite: 9].
*   **Data Structure:** A single question defaults to 4 empty options, an initial correct option index of `0`, and a point value of `1`[cite: 9].

## Do Not Change

*   Do not alter the payload structure (`correctOptionIndex`, `points`, `options` array) generated in `handleSave`, as it represents the expected contract for future API integrations[cite: 9].
*   Do not remove the simulated 1.2-second redirect (`setTimeout`) in the save handler until true backend routing is established[cite: 9].

## AI Implementation Rules

*   When updating the UI to align with `quiz-builder.jpeg`, refactor the question mapping to render distinct, standalone cards per question rather than wrapping the entire `.map` loop in a single card.
*   Adjust button placements (Add Question, Save Quiz) to match the spatial orientation of the reference design.

## Definition of Done

The component is finished when the visual structure perfectly reflects the isolated question cards and input aesthetics of the reference image, form validation is intact, and the mocked saving mechanism accurately processes the complete quiz configuration into a structured payload.