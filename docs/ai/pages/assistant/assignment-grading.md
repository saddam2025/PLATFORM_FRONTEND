# AssignmentGradingPage — UI Reference

## Source Page

`src/pages/assistant/AssignmentGradingPage.jsx`

## Backend / Feature Context

The `AssignmentGradingPage` is a protected route (`/:instructorId/assistant/grade/:assignmentId`) accessible only by users with the `assistant` role[cite: 13]. Access is strictly gated; if an assistant lacks the `can_grade_exams` permission, they are immediately redirected back to their dashboard[cite: 13]. Currently, the page relies on fallback mock data representing an assignment submission and simulates the save action by logging a grading payload to the console before redirecting the user[cite: 13].

## Reference Image

`design-reference/assistant-assignment-gradin.jpeg` 
*(Note: Referencing the provided file `assignment-gradin.jpeg`)*

## Purpose

This page provides the grading interface for teaching assistants[cite: 13]. It displays the student's submitted file and notes side-by-side with a grading form, allowing the assistant to review the work, assign a numerical grade, provide written feedback, and update the submission's status (e.g., Graded, Needs Resubmission)[cite: 13].

## Current Structure

The interface is structured in a two-column layout on large screens:
1.  **Header:** Displays the student's name, course title, submission timestamp, and a dynamically updating status badge[cite: 13].
2.  **Left Column (Student Content):** 
    *   **File Viewer:** Uses a native `iframe` to display PDFs or provides a fallback download link for other file types[cite: 13].
    *   **Student Note:** Conditionally displays any text the student submitted alongside the file[cite: 13].
3.  **Right Column (Grading Form):** Contains inputs for the numerical grade, a textarea for assistant feedback, a status dropdown, and submission/cancellation actions[cite: 13].

## Visual Direction

There are substantial stylistic differences between the current implementation and the `assignment-gradin.jpeg` reference image:
*   **Header Elements:** The reference design features a student avatar next to the name, and a 3-dot action menu on the far left. The code implementation lacks both of these elements[cite: 13].
*   **File Viewer:** The code relies on a basic HTML `iframe` for rendering PDFs[cite: 13]. The design displays a highly customized PDF viewer wrapper with a toolbar (expand, download, zoom controls), document title, and file size metadata.
*   **Student Note:** In the code, the student's note is simply appended to the bottom of the "ملف الطالب" (Student File) section[cite: 13]. In the design, it is contained in its own distinct, visually styled card with a chat-bubble icon.
*   **Form Aesthetics:** The design utilizes borderless form inputs with soft colored backgrounds (e.g., light purple) and includes specific icons for the form title ("نموذج التقييم") and primary buttons. The current code uses standard UI tokens with borders and white backgrounds[cite: 13].
*   **Grade Input Prefix/Suffix:** The design features a visual denominator (`100 /`) baked into the input field UI. The code uses a standard numeric input field[cite: 13].

## Layout

*   **Page Container:** Uses `container mx-auto px-4 py-6` to manage width and margins[cite: 13].
*   **Main Grid:** Arranges the file viewer and grading form side-by-side using `grid-cols-1 lg:grid-cols-2 gap-6`[cite: 13].

## Typography

*   **Student Name (Page Title):** `text-2xl font-semibold`[cite: 13].
*   **Section Titles:** `text-lg font-medium text-ink-900`[cite: 13].
*   **Input Labels:** `text-sm text-ink-500`[cite: 13].

## Components

*   `Input`: `../../components/ui/Input`[cite: 13]
*   `Button`: `../../components/ui/Button`[cite: 13]
*   `Badge`: `../../components/ui/Badge`[cite: 13]

## Actions

*   **Save Grading:** Submits the form. Validates that the grade does not exceed the `maxGrade` (if the status is set to 'graded'), simulates an API patch, displays a temporary success message, and navigates back to the dashboard[cite: 13].
*   **Cancel:** Triggers a React Router navigation event returning the user to `/:instructorId/assistant/dashboard`[cite: 13].
*   **Download File:** Provides an anchor link (`<a download>`) if the attached file is not a PDF[cite: 13].

## States

*   **Permission Loading:** Briefly shows "جارِ التحقق من الصلاحيات..." (Checking permissions...) if the role check evaluates to a lack of permissions before redirecting[cite: 13].
*   **Validation Error:** Displays a `danger` banner if the user attempts to submit an empty or invalid grade when the status is marked as 'graded'[cite: 13].
*   **Save Success:** Renders a `success` banner for 3 seconds upon a successful mock submission[cite: 13].
*   **Dynamic Badge:** The header's status badge maps its color variant (`success`, `danger`, `neutral`) dynamically to the current value selected in the form's status dropdown[cite: 13].

## Responsive Behavior

*   The layout collapses from a side-by-side view (`lg:grid-cols-2`) to a single stacked column (`grid-cols-1`) on screens smaller than the `lg` breakpoint[cite: 13].

## RTL

*   The root `div` explicitly enforces a right-to-left document flow via the `dir="rtl"` attribute[cite: 13].

## Data / Business Logic Constraints

*   **Grade Validation:** The system strictly checks that a valid numerical grade is provided if the assignment status is moved to "graded" (`status === 'graded'`). It also prevents submission if the input grade exceeds `assignment.maxGrade`[cite: 13].

## Do Not Change

*   Do not alter the specific logic checking `!permissions.includes('can_grade_exams')` triggering the redirect hook, as it is critical for platform security[cite: 13].
*   Ensure the `assignmentId` and `instructorId` parameter parsing via `useParams` remains intact for future backend hook integration[cite: 13].

## AI Implementation Rules

*   Implement the custom PDF viewer UI wrapper (toolbar with zoom/download/expand icons, title, and file size) as depicted in the reference design, wrapping the existing PDF viewer logic.
*   Separate the "Student Note" into its own independent visual card below the file viewer, incorporating the icon style from the mockup.
*   Refactor the grading form inputs to match the borderless, soft-filled aesthetic, and implement the fixed `/ 100` visual denominator inside the grade input field.
*   Add the missing student avatar and the 3-dot context menu to the header.