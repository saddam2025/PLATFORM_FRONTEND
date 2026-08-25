# CourseManagementPage — UI Reference

## Source Page

`src/pages/admin/CourseManagementPage.jsx`

## Backend / Feature Context

The page currently operates on client-side state using an array of mock data (`MOCK_COURSES`)[cite: 8]. It implements client-side search filtering, mock deletion, and mock publishing status toggling[cite: 8]. No actual API services are currently connected in the provided source[cite: 8].

## Reference Image

`design-reference/admin/course-management.jpeg`

## Purpose

The `CourseManagementPage` serves as the primary administrative hub for overseeing the platform's educational courses[cite: 8]. It provides administrators with a tabular overview of all courses, alongside tools to search, filter, adjust publishing status, edit existing courses, or initiate the creation of new ones[cite: 8].

## Current Structure

1.  **Page Header:** Contains the main title, a brief descriptive subtitle, and the primary "دورة جديدة" (New Course) action button[cite: 8].
2.  **Toolbar:** A dedicated card containing "ترتيب" (Sort) and "تصفية" (Filter) buttons, alongside a prominent search input[cite: 8].
3.  **Data Table:** A main card containing the courses list, segmented into columns: Title (with icon), Stage, Category, Price, Enrolled Students, Status, and Actions[cite: 8].
4.  **Pagination Footer:** Positioned at the bottom of the table card, showing item counts and pagination controls[cite: 8].

## Visual Direction

The implementation accurately reflects the `course-management.jpeg` reference design. It emphasizes a clean, spacious data table with a soft, rounded aesthetic[cite: 8]. The visual hierarchy directs attention to the primary creation action and the search bar. The table rows utilize subtle hover effects, and critical actions like deletion trigger localized, inline confirmation UIs rather than disruptive modals[cite: 8]. 
*Note: The codebase currently renders a text `Badge` (منشورة/مسودة) next to the toggle switch, whereas the reference image relies solely on the visual state of the switch itself[cite: 8].*

## Layout

*   **Container:** Implements vertical rhythm using `space-y-8`[cite: 8].
*   **Header & Toolbar:** Utilizes flexbox (`flex items-center justify-between` and `gap-4`) to manage alignment and wrapping (`flex-wrap`) on smaller screens[cite: 8].
*   **Table:** Wrapped in a standard HTML `<table>` structured with `<thead>` and `<tbody>`, housed within a container utilizing `overflow-x-auto` to handle overflow gracefully[cite: 8].

## Typography

*   **Page Title:** `font-display text-3xl font-bold text-ink-900`[cite: 8].
*   **Descriptions/Counts:** `text-sm text-ink-500`[cite: 8].
*   **Table Headers:** `font-medium`[cite: 8].
*   **Table Data (Primary text):** `font-semibold text-ink-900` or `font-bold` for price[cite: 8].

## Components

*   `Button`: `../../components/ui/Button`[cite: 8].
*   `Input`: `../../components/ui/Input`[cite: 8].
*   `Badge`: `../../components/ui/Badge`[cite: 8].

## Cards

*   **Toolbar Card:** `bg-surface-default rounded-2xl shadow-card p-4`[cite: 8].
*   **Table Card:** `bg-surface-default rounded-2xl shadow-card overflow-hidden`[cite: 8].

## Actions

*   **Primary:** "دورة جديدة" (New Course) navigates to `/:instructorId/admin/courses/edit/new`[cite: 8].
*   **Secondary:** "ترتيب" (Sort) and "تصفية" (Filter) buttons in the toolbar[cite: 8].
*   **Search:** Live text input filtering the course list by title[cite: 8].
*   **Row - Toggle Publish:** A custom toggle switch element interacting with the course's `isPublished` boolean[cite: 8].
*   **Row - Edit:** Icon button navigating to `/:instructorId/admin/courses/edit/:courseId`[cite: 8].
*   **Row - Delete:** Icon button initiating the deletion flow[cite: 8].
*   **Row - Confirm Delete:** Inline "نعم" (Yes - Primary) and "إلغاء" (Cancel - Ghost) buttons[cite: 8].

## States

*   **Filtered (Search):** The table dynamically updates based on the `search` input matching course titles[cite: 8].
*   **Empty:** If the search yields no results, a fallback row (`colSpan={7}`) displays "لا توجد دورات مطابقة للبحث"[cite: 8].
*   **Publish Status:** The toggle switch visually reflects on/off via transform translations (`-translate-x-1` vs `-translate-x-6`) and color shifts (`bg-success-DEFAULT` vs `bg-surface-muted`)[cite: 8].
*   **Confirm Deletion:** Clicking delete swaps the action buttons for a highlighted inline confirmation prompt (`bg-danger-DEFAULT/8`)[cite: 8].

## Responsive Behavior

*   **Mobile/Tablet:** The page header and toolbar wrap their internal flex items gracefully (`flex-wrap`)[cite: 8]. The table utilizes `overflow-x-auto` to permit horizontal scrolling on narrow viewports without breaking the page layout[cite: 8].
*   **Desktop:** Displays the full table width naturally[cite: 8].

## RTL

*   The root `<div>` enforces `dir="rtl"`[cite: 8].
*   Table content is right-aligned (`text-right`)[cite: 8].
*   The publish toggle switch animations correctly account for RTL layout by utilizing negative X translations to move the knob[cite: 8].

## Interaction / Motion

*   **Row Hover:** Table rows feature a subtle background shift on hover (`transition-colors hover:bg-surface-muted/40`)[cite: 8].
*   **Toggle Switch:** The circular knob uses `transition-transform` to slide smoothly when clicked[cite: 8].

## Data / Business Logic Constraints

*   Courses are currently defined by their `stage` and `category` alongside price and title[cite: 8]. These data points mirror the structure managed in the `CourseEditorPage`.
*   Deletion is a two-step process requiring explicit localized confirmation before state modification[cite: 8].

## Do Not Change

*   Do not remove the inline deletion confirmation pattern; it is explicitly defined in both code and the reference image[cite: 8].
*   Preserve the responsive table overflow wrapper to prevent layout breakage on mobile[cite: 8].

## AI Implementation Rules

*   When wiring up actual API endpoints, ensure the optimistic UI updates for the publish toggle remain fast and fluid.
*   If extending table columns, ensure they fit within the established padding (`px-5 py-4`) to maintain consistent breathing room[cite: 8].

## Definition of Done

The page is considered complete when it fetches live data, handles true backend search/filtering/pagination, and accurately syncs the publishing status and deletion actions with the API, while perfectly retaining the visual layout depicted in the reference image.