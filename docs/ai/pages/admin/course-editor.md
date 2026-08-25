# CourseEditorPage — UI Reference

## Source Page

`src/pages/admin/CourseEditorPage.jsx`[cite: 7]

## Backend / Feature Context

The page acts as a dual-purpose form for both creating ("new") and editing courses based on the `courseId` URL parameter[cite: 7]. Currently, there is no real backend API integration; data submission and fetching are mocked[cite: 7]. The component references feature requirements such as "Course schema's videoUrl_encrypted field", exam answer explanations (feature #16), and access rules (feature #3)[cite: 7]. 

## Reference Image

`design-reference/admin/course-editor.jpeg`

## Purpose

The `CourseEditorPage` allows administrators and permitted assistants to create new courses or modify existing ones[cite: 7]. It provides a comprehensive interface to configure course metadata, upload media and homework attachments, define access rules, build an integrated exam/quiz, and control the publishing status[cite: 7].

## Current Structure

The page is structured as a vertical stack of form sections[cite: 7]:
1.  **Header:** Dynamic title (Create/Edit) and a back button[cite: 7].
2.  **Basic Info Section:** Fields for Arabic/English titles and descriptions, plus price[cite: 7].
3.  **Stage & Category Section:** Dropdowns for stage selection and dynamic category management (adding new categories)[cite: 7].
4.  **Media Uploads Section:** File inputs for the course thumbnail and video[cite: 7].
5.  **Homework Attachment Section:** File input for document uploads[cite: 7].
6.  **Exam Builder Section:** A dynamic list where users can add questions, define multiple-choice options, set the correct answer, and provide an explanation[cite: 7].
7.  **Access Rules Section:** Inputs for access duration (days) and maximum views[cite: 7].
8.  **Publish Section:** A toggle checkbox to publish the course[cite: 7].
9.  **Actions:** Submit and Cancel buttons[cite: 7].

## Visual Direction

The reference image shows a clean, spacious, card-based form. A key visual difference between the current implementation and the reference image lies in the **Media Uploads** section: the reference image depicts large, dashed-border dropzones with icons, whereas the current code utilizes standard HTML `<input type="file">` elements[cite: 7]. Form fields in the reference image also have a distinct soft filled background compared to the outlined borders in the current `fieldClasses` styling[cite: 7].

## Layout

*   **Container:** Uses `container mx-auto px-4 py-6` for constraints[cite: 7].
*   **Grid (Form Sections):** Most form sections utilize a responsive grid (`grid-cols-1 md:grid-cols-2 gap-4` or `gap-6`) to place inputs side-by-side on larger screens[cite: 7].
*   **Spacing:** Sections are separated by the `space-y-4` utility on the main form[cite: 7].

## Typography

*   **Page Title:** `text-2xl font-semibold`[cite: 7].
*   **Section Titles:** `text-lg font-semibold text-ink-900`[cite: 7].
*   **Input Labels:** `text-sm font-medium text-ink-700`[cite: 7].
*   **Helper Text:** `text-sm text-ink-500` or `text-xs text-ink-500`[cite: 7].

## Components

*   `Input`: `../../components/ui/Input`[cite: 7]
*   `Button`: `../../components/ui/Button`[cite: 7]
*   `Badge`: `../../components/ui/Badge`[cite: 7]

## Cards

All form sections are wrapped in standard platform cards using the classes `rounded-2xl bg-surface-default shadow-card p-6`[cite: 7].

## Actions

*   **Primary:** "حفظ الدورة" (Save Course) - Triggered by the form submit[cite: 7].
*   **Secondary/Subtle:** "إنشاء تصنيف جديد" (Create New Category), "إضافة سؤال جديد" (Add New Question)[cite: 7].
*   **Ghost/Cancel:** "العودة للقائمة" (Return to List), "إلغاء" (Cancel), "حذف" (Delete Question)[cite: 7].

## States

*   **Mode:** Dynamically renders "دورة جديدة" (New Course) or "تعديل الدورة" (Edit Course) based on the URL parameter[cite: 7].
*   **Permissions (Disabled):** The video upload input is disabled if the user lacks the `can_upload_video` permission (unless they are an admin)[cite: 7]. A danger badge is shown to indicate this restriction[cite: 7].
*   **Uploading:** The video upload simulates a progress state, displaying a percentage and a progress bar ("جاري الرفع... X%")[cite: 7].
*   **Saving/Loading:** The submit button disables and updates its text to "جارِ الحفظ..." during submission[cite: 7].
*   **Success:** A green success message ("تم حفظ الدورة بنجاح") appears briefly before navigation[cite: 7].

## Responsive Behavior

*   **Mobile:** Grid columns collapse to a single column (`grid-cols-1`)[cite: 7].
*   **Tablet/Desktop:** Inputs and media upload sections split into two columns (`md:grid-cols-2`)[cite: 7].

## RTL

The page forces right-to-left layout via the `dir="rtl"` attribute on the outermost container[cite: 7]. This correctly aligns text, grids, and form labels to the right.

## Interaction / Motion

*   **Video Progress:** The video upload progress bar utilizes a CSS transition (`transition-all duration-150`) to smoothly animate the width based on the mock upload progress[cite: 7].
*   **Dynamic UI:** Adding/removing categories and exam questions instantly updates the DOM without page reloads[cite: 7].

## Data / Business Logic Constraints

*   **Permissions:** Assistants can edit all course details, but can *only* upload videos if they explicitly possess the `can_upload_video` permission string[cite: 7].
*   **Exam Integrity:** The exam builder structure requires one correct option to be selected per question (stored as `correctOptionIndex`), establishing the answer key[cite: 7].

## Do Not Change

*   Do not alter the permission logic defining `canUploadVideo`[cite: 7].
*   Do not change the route definition or the logic that determines if a course is new (`isNew = !courseId || courseId === 'new'`)[cite: 7].
*   Do not modify the `STAGES` array as it is intentionally synced with other pages[cite: 7].

## AI Implementation Rules

*   When updating the UI to match the reference image's file upload dropzones, prefer extending existing components or utilizing standardized Tailwind classes over writing raw CSS.
*   Ensure that any modifications to `<select>` or `<textarea>` tags continue to use the shared `fieldClasses` variable to maintain visual parity with the custom `Input` component[cite: 7].

## Definition of Done

The page is considered complete when the form accurately captures all required course fields, respects user permissions regarding video uploads, and visual enhancements (like dashed upload dropzones) align with the `course-editor.jpeg` design reference while strictly utilizing the existing Tailwind utility ecosystem.