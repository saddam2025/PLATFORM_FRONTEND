# docs/ai/pages/admin/student-profile-detail.md

## Page Overview
**Path:** `src/pages/admin/StudentProfileDetailPage.jsx`
**Route:** `/:instructorId/students/:studentId/profile`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
Allows the instructor/admin to view comprehensive information about a specific high school student. Since students control their own accounts and self-register, this page aggregates their independent progress, exam scores, and activity, while noting any linked parent monitors.

## Backend Context
- `GET /instructors/:instructorId/students/:studentId/profile`

## Visual References
1. `src/pages/admin/CourseManagementPage.jsx` (for the overarching page layout and off-white background)
2. `src/components/ui/Card.jsx` (for data grouping)
3. `src/components/ui/Badge.jsx` (for status indicators)

## Design Intent & Patterns
- **Layout:** Standard admin dashboard shell with a top header detailing the student's name and enrollment status.
- **Color & Typography:** Strict adherence to the off-white background theme and elegant Arabic typography for all headings.
- **Cards:** Use existing flat, lightly shadowed cards with clean structural proportions to display distinct data categories (e.g., "Personal Info", "Course Progress", "Exam History").
- **Tables:** Reuse the standard data table pattern for listing historical exam attempts and subscription payments.
- **Empty States:** If the student has not taken any exams, reuse the global "No Data" minimal empty state component.# docs/ai/pages/admin/student-profile-detail.md

## Page Overview
**Path:** `src/pages/admin/StudentProfileDetailPage.jsx`
**Route:** `/:instructorId/students/:studentId/profile`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
Allows the instructor/admin to view comprehensive information about a specific high school student. Since students control their own accounts and self-register, this page aggregates their independent progress, exam scores, and activity, while noting any linked parent monitors.

## Backend Context
- `GET /instructors/:instructorId/students/:studentId/profile`

## Visual References
1. `src/pages/admin/CourseManagementPage.jsx` (for the overarching page layout and off-white background)
2. `src/components/ui/Card.jsx` (for data grouping)
3. `src/components/ui/Badge.jsx` (for status indicators)

## Design Intent & Patterns
- **Layout:** Standard admin dashboard shell with a top header detailing the student's name and enrollment status.
- **Color & Typography:** Strict adherence to the off-white background theme and elegant Arabic typography for all headings.
- **Cards:** Use existing flat, lightly shadowed cards with clean structural proportions to display distinct data categories (e.g., "Personal Info", "Course Progress", "Exam History").
- **Tables:** Reuse the standard data table pattern for listing historical exam attempts and subscription payments.
- **Empty States:** If the student has not taken any exams, reuse the global "No Data" minimal empty state component.