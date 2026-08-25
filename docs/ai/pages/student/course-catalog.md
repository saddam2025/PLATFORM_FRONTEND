# Course Catalog Page — UI Reference

## 1. Source
`src/pages/student/CourseCatalogPage.jsx`[cite: 13]

## 2. Output
`docs/ai/pages/student/course-catalog.md`

## 3. Implementation Status
Partially implemented. The layout, filtering logic, and component integrations are established, but the page currently relies on a `MOCK_COURSES` array and lacks a dedicated loading state for asynchronous API fetching[cite: 13].

## 4. Purpose
Serves as the primary discovery hub for students (and unauthenticated visitors, given `auth: null`) to browse, search, and filter available courses within a specific academic stage[cite: 13]. It acts as a funnel to both course detail pages and direct checkout/enrollment[cite: 13].

## 5. Reference Image
`course-catalog.jpeg` (Provides visual context for category pill styling, search bar placement, and the grid rendering of the `CourseCard` components).

## 6. Visual Reference Sources
- **`src/components/common/CourseCard`:** The foundational visual building block for the course grid[cite: 13].
- **`src/components/ui/Badge`:** Dictates the pill-shaped design of the category filter buttons[cite: 13].
- **`src/components/ui/Input`:** Provides the styling for the text-based search field[cite: 13].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/stages/:stageId/courses`[cite: 13].
- **Auth & Access:** Publicly accessible (`auth: null`), allowing unauthenticated users to browse before signing up[cite: 13].
- **Data Entity:** Requires a list of course objects scoped to the URL's `stageId`[cite: 13]. Each object must include an `id`, `title`, `description` (subtitle), `price`, `thumbnailUrl`, and a `category` (e.g., "الشهر الأول")[cite: 13].

## 8. Page Anatomy
1. **Header Section:** Contains the page title ("الدورات المتاحة") and a brief descriptive subtitle[cite: 13].
2. **Search Bar:** A full-width text input for keyword-based course discovery[cite: 13].
3. **Category Filters:** A horizontal, wrapping flex row of toggleable badges representing unique course categories (plus an "الكل" / "All" default option)[cite: 13].
4. **Course Grid:** The main content area displaying a responsive grid of `CourseCard` components[cite: 13].
5. **Empty State:** A fallback UI displayed when no courses match the selected stage, category, or search query[cite: 13].

## 9. Layout Specification
- **Container:** Uses `space-y-6` (24px) for vertical rhythm between the header, search, filters, and grid[cite: 13].
- **Grid Architecture:** Responsive grid using `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with a gap of 16px (`gap-4`)[cite: 13].
- **Filters Layout:** Uses `flex items-center gap-2 flex-wrap` to ensure category badges wrap cleanly on smaller viewports without overflowing[cite: 13].

## 10. Visual Specification
- **Typography:**
  - Title: `text-xl font-semibold text-ink-900`[cite: 13].
  - Subtitle: `text-sm text-ink-500 mt-1`[cite: 13].
- **Empty State:** Styled as a large, muted block using `bg-surface-muted rounded-2xl p-10 text-center text-ink-500`[cite: 13].
- **Category Badges:** 
  - Active State: Uses `Badge` with `variant="brand"`[cite: 13].
  - Inactive State: Uses `Badge` with `variant="neutral"`[cite: 13].

## 11. Component Reuse
- `CourseCard`: Maps course data to visual card layout[cite: 13].
- `Input`: Standard platform search input[cite: 13].
- `Badge`: Reused interactively as filter toggles[cite: 13].

## 12. User Interactions
- **Text Search:** Typing in the `Input` updates the `search` state, dynamically filtering the `filteredCourses` list based on course titles[cite: 13].
- **Category Filtering:** Clicking a category badge updates the `activeCategory` state. Clicking "الكل" (All) resets this state to `null`. The course grid updates instantly[cite: 13].
- **Course Actions:** 
  - Clicking "عرض التفاصيل" (View Details) inside the `CourseCard` triggers the `onOpen` callback, navigating to `/:instructorId/courses/:course.id`[cite: 13].
  - Clicking the enrollment action triggers `onEnroll`, navigating to `/:instructorId/checkout/:course.id`[cite: 13].

## 13. UI States
- **Default/Idle:** All courses for the `stageId` are displayed. The "الكل" badge is active (`variant="brand"`), and the search input is empty[cite: 13].
- **Filtered:** Grid updates to show a subset of courses. The selected category badge becomes `brand` while others become `neutral`[cite: 13].
- **Empty:** When `filteredCourses.length === 0`, the grid is replaced by the `bg-surface-muted` empty state container displaying "لا توجد دورات مطابقة"[cite: 13].
- **Loading:** (Not currently present in source, but required for API integration) Should display skeleton cards matching the grid layout while fetching.

## 14. Responsive Behavior
- **Mobile (`< md`):** Courses display in a single column (`grid-cols-1`)[cite: 13]. Category filters wrap cleanly onto multiple lines if numerous[cite: 13].
- **Tablet (`md` to `lg`):** Grid expands to two columns (`md:grid-cols-2`)[cite: 13].
- **Desktop (`lg` and above):** Grid expands to three columns (`lg:grid-cols-3`) for optimal use of horizontal space[cite: 13].

## 15. RTL Requirements
- The root container is wrapped in `dir="rtl"`[cite: 13].
- Badges flow from right to left in the flex container[cite: 13].
- Text aligns right by default, matching Arabic typography standards.

## 16. Motion & Micro-interactions
- Badges utilize the `cursor-pointer` class to indicate interactivity[cite: 13]. Hover transitions are inherited from the underlying `Badge` component CSS.
- Card hover effects (elevation, image scale) are handled internally by the `CourseCard` component.

## 17. Data & Business Rules
- **Memoization:** Filtering logic relies on `useMemo` to prevent unnecessary recalculations of `stageCourses`, `categories`, and `filteredCourses` on re-renders[cite: 13].
- **Category Extraction:** Categories are dynamically extracted from the course payload (`[...new Set(...)]`) rather than being hardcoded, ensuring the UI adapts to the fetched content[cite: 13].

## 18. Do Not Change
- Do not modify the existing `CourseCard` prop contract (`title`, `subtitle`, `image`, `price`, `lessonsCount`, `tasksCount`, `instructor`, `openLabel`, `onOpen`, `onEnroll`)[cite: 13].
- Do not remove the `useMemo` hooks governing the search and category filtering[cite: 13].
- Keep the route parameter structure (`/:instructorId/stages/:stageId/courses`) intact[cite: 13].

## 19. Implementation Instructions
1. **API Integration:** Replace `MOCK_COURSES` with an API call (e.g., `useQuery` or `useEffect`) fetching courses from the backend based on `instructorId` and `stageId`.
2. **Loading State:** Implement a skeleton loader grid that mirrors the `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` layout while the API request is pending.
3. **Data Mapping:** Ensure backend data correctly maps to the `CourseCard` props. Populate `lessonsCount`, `tasksCount`, and `instructor` details with real API metadata instead of the currently hardcoded `0` and `null` values[cite: 13].
4. **Sorting:** (Optional enhancement) Consider adding a dropdown to sort the `filteredCourses` array by price or recency, if supported by the backend.

## 20. Definition of Done
- The page dynamically fetches courses based on the URL's `stageId`.
- Search and category filters instantly narrow down the displayed courses.
- The `CourseCard` grid renders flawlessly across mobile, tablet, and desktop breakpoints.
- Clicking a course card successfully routes the user to the detail page or checkout view[cite: 13].
- A clean empty state is shown when filters yield no results[cite: 13].
- The layout perfectly adheres to RTL requirements.