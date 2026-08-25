# Assistant Dashboard — UI Reference

## Source Page

`src/pages/assistant/AssistantDashboard.jsx`

## Backend / Feature Context

The `AssistantDashboard` is a protected route restricted to users with the 'assistant' authentication role[cite: 12]. Access to the core functionality of this page requires the user to either have the `admin` role or specifically hold the `can_grade_exams` permission[cite: 12]. Currently, the page is populated using a mock data array (`assignmentsMock`) simulating the grading queue, and statistics are calculated locally via `useMemo` based on this mock data[cite: 12].

## Reference Image

`design-reference/assistant-dashboard.jpeg`

## Purpose

This dashboard provides teaching assistants with a centralized view of their grading workflow[cite: 12]. It offers a high-level summary of assignment statuses (pending, graded, requiring resubmission) and lists individual student submissions, allowing the assistant to navigate to the grading interface for pending tasks[cite: 12].

## Current Structure

The page layout is structured as follows:
1.  **Header:** Displays a personalized greeting (e.g., "مرحباً سارة") and the user's avatar[cite: 12].
2.  **Permission Guard:** If the user lacks the `can_grade_exams` permission, the UI hides the dashboard content and displays a warning card instructing them to contact the instructor[cite: 12].
3.  **Summary Cards (Conditional):** A top row of three metric cards showing the counts for "الواجبات المعلقة" (Pending), "تم تصحيحها" (Graded), and "تحتاج إعادة تسليم" (Needs Resubmission)[cite: 12].
4.  **Assignments List (Conditional):** A vertical list titled "قائمة الواجبات" displaying assignment cards[cite: 12]. Each card contains student and course information, a status badge, a grade (if applicable), and an action button[cite: 12].

## Visual Direction

There are several visual distinctions between the current code implementation and the `assistant-dashboard.jpeg` reference image:
*   **Summary Cards Styling:** The reference image includes specific icons (clipboard/clock, checkmark, back-arrow) placed in the top-left corner of each summary card, with the metric numbers prominently displayed in a much larger font size at the bottom. The code currently renders a simpler stacked layout without icons[cite: 12].
*   **Assignment Card Layout:** The design features a circular placeholder avatar for the student on the far right of each assignment row. The code implementation omits this student avatar[cite: 12].
*   **Grade Formatting:** In the reference image, grades are displayed prominently in a fractional format (e.g., `88/100` or `--/100`), with colors indicating completion. The code renders a simpler string: "الدرجة: 88"[cite: 12].
*   **Status Badges:** The design utilizes custom pill-shaped badges with contextual icons (e.g., a green checkmark for graded, a grey dot for pending). The code uses the generic `<Badge>` component[cite: 12].
*   **Action Buttons:** The reference image only displays a "تصحيح" (Grade) button for pending assignments; graded assignments have no button. The code implementation includes a "عرض" (View) button for non-pending assignments[cite: 12].

## Layout

*   **Page Container:** Uses `container mx-auto px-4 py-6` to constrain width and provide padding, set against a `bg-surface-canvas` background[cite: 12].
*   **Summary Grid:** Metrics are arranged using a responsive grid: `grid-cols-1 sm:grid-cols-3`[cite: 12].
*   **List Items:** Individual assignment rows utilize flexbox (`flex items-center justify-between gap-4`) to distribute information across the horizontal plane[cite: 12].

## Typography

*   **Headings:** The main greeting is `text-2xl font-semibold`, while the list header is `text-lg font-semibold`[cite: 12].
*   **Metrics:** The summary card numbers are styled with `text-2xl font-semibold`[cite: 12].
*   **Metadata:** Course titles, timestamps, and subtitles use smaller, muted text (`text-xs text-ink-500` and `text-sm text-ink-500`)[cite: 12].

## Components

*   `Badge`: `../../components/ui/Badge`[cite: 12]
*   `Button`: `../../components/ui/Button`[cite: 12]
*   `Avatar`: `../../components/ui/Avatar`[cite: 12]

## Actions

*   **Grade Assignment:** Clicking "تصحيح" on a pending assignment wraps a `Button` in a `Link` component, routing the user to `/:instructorId/assistant/grade/:assignmentId`[cite: 12].
*   **View Assignment:** Clicking "عرض" on a completed assignment currently executes an empty onClick handler (`() => { /* view details */ }`)[cite: 12].

## States

*   **Authorization Guard:** Renders an empty-state card with an SVG icon if the user fails the `canGrade` check[cite: 12].
*   **Assignment Statuses:** 
    *   `pending`: Shows a neutral badge and the "تصحيح" action button[cite: 12].
    *   `graded`: Shows a `success` variant badge, the numerical grade, and a "عرض" button[cite: 12].
    *   `resubmit`: Shows a `danger` variant badge and a "عرض" button[cite: 12].

## Responsive Behavior

*   The summary cards collapse from a three-column grid (`sm:grid-cols-3`) to a single-column stack on smaller screens[cite: 12].
*   Flex layouts on assignment cards may require wrap handling on very small viewports, though the current implementation relies on horizontal spacing[cite: 12].

## RTL

*   The root `div` explicitly enforces right-to-left layout via the `dir="rtl"` attribute, aligning text to the right and adjusting flexbox item flow[cite: 12].

## Data / Business Logic Constraints

*   Permission to view the dashboard content is strictly tied to `role === 'admin'` OR the `permissions` array containing `'can_grade_exams'`[cite: 12].

## Do Not Change

*   Do not modify the `canGrade` permission evaluation logic[cite: 12].
*   Do not remove the structural routing parameter `/:instructorId/` in the `Link` component for the grading action[cite: 12].

## AI Implementation Rules

*   Update the summary metric cards to include the distinct icons (clipboard, check, back-arrow) and match the spatial arrangement of the numbers as shown in the reference image.
*   Add a student avatar placeholder to the far right (start position in RTL) of each assignment list item.
*   Refactor the grade display to use the `XX/100` visual format, styling the number prominently, and implement the `--/100` state for un-graded assignments as depicted in the design.
*   Update the visual style of the status badges to reflect the pill-shaped, icon-embedded design from the reference image.
*   Remove the "عرض" (View) button for graded and resubmit statuses to accurately reflect the provided design mockup, or verify if the functionality should be retained despite the mockup.