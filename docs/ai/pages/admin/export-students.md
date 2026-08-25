# docs/ai/pages/admin/export-students.md

## Page Overview
**Path:** `src/pages/admin/ExportStudentsPage.jsx`
**Route:** `/:instructorId/students/export`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
A utility page for the admin to configure and execute bulk exports of student data (e.g., CSV/Excel). 

## Backend Context
- `GET /instructors/:instructorId/students/export`

## Visual References
1. `src/pages/admin/TenantSettingsPage.jsx` (for form control layouts and settings-style UI)
2. `src/components/ui/Button.jsx` (for primary action and export triggers)
3. `src/components/ui/ActionPanel.jsx` or similar existing panel components.

## Design Intent & Patterns
- **Layout:** Centered or narrow-column configuration focusing on the export parameters.
- **Forms:** Reuse existing select dropdowns, date pickers, and checkbox styles for selecting which data points to export (e.g., Grades, Subscriptions, Contact Info).
- **Feedback:** Utilize existing toast notifications or inline success/error badges to indicate export status.
- **Buttons:** Use the platform's primary yellow button style for the main "Export" action, ensuring consistent micro-interactions (hover states, disabled loading states).