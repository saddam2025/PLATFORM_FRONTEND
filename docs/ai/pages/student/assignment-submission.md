# Assignment Submission Page — UI Reference

## 1. Source
`src/pages/student/AssignmentSubmissionPage.jsx`

## 2. Output
`docs/ai/pages/student/assignment-submission.md`

## 3. Implementation Status
Partially implemented. The component structure, interactions, and state management are present, but it currently relies on `MOCK_ASSIGNMENT` data and a simulated `setTimeout` for the submission action.

## 4. Purpose
This page provides a focused interface for students to read assignment instructions, download required materials, and submit their solutions via file upload (drag-and-drop or file picker) alongside an optional text note. It also displays instructor feedback, grades, and progression lock notices.

## 5. Reference Image
`course-catalog.jpeg` (Used exclusively for extracting global design tokens: card styling, primary button colors, background hues, and RTL alignment context).

## 6. Visual Reference Sources
- **`course-catalog.jpeg`:** The general off-white background, the clean white cards with subtle shadows (`shadow-card`, `rounded-2xl`), and the primary brand yellow buttons form the visual baseline for this page.
- **`src/components/ui/Button.jsx`:** Dictates the sizing, typography, and states (hover, disabled) of the "تسليم الواجب" (Submit) and "تحميل المرفقات" (Download) actions.
- **`src/components/ui/Badge.jsx`:** Dictates the pill-shaped status indicators for grades and lock notices.

## 7. Feature / Backend Context
- **Route:** `/:instructorId/courses/:courseId/assignments/:assignmentId`
- **Role:** Restricted to authenticated `student` users.
- **Data Model:** The assignment object includes `id`, `title`, `instructions`, `downloadUrl`, `status` (`'pending' | 'graded' | 'resubmit'`), `grade`, and `feedback`.
- **Submission:** Expects a multipart form or payload containing a `file` object and a `submissionNote` string.

## 8. Page Anatomy
1. **Header:** Simple typography displaying the assignment title.
2. **Instructions Section (Card):** Contains the text prompt and a ghost button for downloading attachments.
3. **Feedback Section (Conditional Card):** Renders only if the status is `graded` or `resubmit`. Displays a header, a score badge, and instructor text feedback.
4. **Submission Form (Card):** 
    - Success banner (conditional).
    - Drag-and-drop file upload zone.
    - Textarea for submission notes.
    - Primary submit button.
5. **Lock Notice (Conditional Badge):** Displays an informational warning at the bottom if the assignment is pending and serves as a prerequisite for future lectures.

## 9. Layout Specification
- **Container:** Centered single-column layout restricted to `max-w-3xl` with `mx-auto`.
- **Spacing:** `space-y-6` (24px) between main page sections (cards); `space-y-4` (16px) internal spacing within cards.
- **Alignment:** Right-to-left block flow. The feedback header uses `flex items-center justify-between` to push the title to the right and the grade badge to the left.
- **Padding:** All cards utilize `p-6` (24px padding).

## 10. Visual Specification
- **Backgrounds:** 
  - Cards: `bg-surface-default` (White/off-white matching the catalog cards).
  - Dropzone Idle: `bg-surface-muted`.
  - Dropzone Active: `bg-brand-50` (Light yellow/brand tint).
  - Success Alert: `bg-success-soft`.
- **Typography:** Elegant Arabic font (e.g., Cairo/Tajawal). 
  - Title: `text-xl font-semibold text-ink-900`.
  - Section Headers: `text-lg font-semibold text-ink-900`.
  - Body/Instructions: `text-sm text-ink-600 leading-relaxed`.
- **Borders & Radius:**
  - Cards: `rounded-2xl` with `shadow-card`.
  - Dropzone: `rounded-xl border-2 border-dashed border-surface-border`. When active: `border-brand-500`.
- **Buttons:** Primary button utilizes the platform's brand yellow (as seen in the catalog's sidebar "بدء درس جديد" button).

## 11. Component Reuse
- `../../components/ui/Badge`
- `../../components/ui/Button`

## 12. User Interactions
- **Drag and Drop:** Dragging a file over the upload zone sets `dragActive`, changing the border and background color. Dropping a file captures it in state.
- **File Picker:** Clicking "اختر ملفاً" opens the OS native file dialog via a hidden `<input type="file">`.
- **Text Entry:** Standard textarea input for `submissionNote`.
- **Submit Action:** Clicking the primary button sets `submitting` to true, disables the button, updates its text, and simulates an API call.

## 13. UI States
- **Pending/Empty:** Form is fully enabled. Dropzone displays "اسحب الملف هنا أو اختر ملفاً".
- **File Selected:** Dropzone displays the selected file's name (`file.name`).
- **Drag Active:** Dropzone border turns brand color (`border-brand-500 bg-brand-50`).
- **Submitting (Loading):** Submit button is disabled, text changes to "جارٍ التسليم...".
- **Submitted (Success):** A green success banner appears (`bg-success-soft`), dropzone and textarea are grayed out (`opacity-50 pointer-events-none`), and the submit button locks to "تم التسليم".
- **Graded (Success/Danger):** Feedback card appears; grade badge uses `success` variant if graded, or `danger` if a resubmit is required.

## 14. Responsive Behavior
- **Desktop:** The layout remains cleanly centered and constrained to `max-w-3xl`, preventing text lines from becoming unreadably long.
- **Tablet/Mobile:** The `max-w-3xl` naturally fluidly scales down. Form elements like the textarea use `w-full` to adapt to screen width constraints.

## 15. RTL Requirements
- Explicitly enforced by the `<div dir="rtl">` wrapper.
- All text aligns to the right by default.
- In flex layouts (like the feedback header), `justify-between` correctly places the title on the right (start) and the badge on the left (end).

## 16. Motion & Micro-interactions
- **Dropzone Hover:** Utilizes `transition-colors` for a smooth fade when dragging files over the dropzone.
- Button components handle their own standard hover/active scale or color transitions.

## 17. Data & Business Rules
- **Prerequisites:** The application locks subsequent content until an assignment is `'graded'`. The lock notice badge must accurately reflect this rule.
- **File Limits:** The current logic captures only the first file (`files[0]`). Multiple file uploads are not supported by the UI.

## 18. Do Not Change
- Do not alter the `dir="rtl"` attribute or the `max-w-3xl` container width.
- Do not change the defined route parameters (`instructorId`, `courseId`, `assignmentId`).
- Maintain the exact card structure tokens (`bg-surface-default rounded-2xl shadow-card`) to ensure consistency with the `course-catalog.jpeg` aesthetic.

## 19. Implementation Instructions
1. **API Integration:** Remove `MOCK_ASSIGNMENT`. Fetch assignment data using standard hooks/services matching the URL parameters.
2. **Form Submission:** Replace the `setTimeout` in `handleSubmit` with an actual POST/PUT request. Construct a `FormData` object to handle the `file` upload alongside the `submissionNote`.
3. **Error Handling:** Add a `catch` block to the submission logic to handle server errors. Introduce an error state (e.g., toast notification or inline red text) if the upload fails.
4. **Validation:** Add `accept` attributes to the file `<input>` based on backend-allowed MIME types (e.g., `accept=".pdf,.jpg,.png"`).

## 20. Definition of Done
- The page renders identically to the structural layout defined in the source, visually matching the clean card aesthetic of the catalog image.
- Assignment data is fetched from the live API.
- Files can be selected via both drag-and-drop and the file browser.
- Submitting the form sends a valid multipart request to the backend.
- The UI properly locks and displays a success state upon a 200/201 response.