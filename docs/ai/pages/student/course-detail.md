# Course Detail Page — UI Reference

## 1. Source
`src/pages/student/CourseDetailPage.jsx`[cite: 14]

## 2. Output
`docs/ai/pages/student/course-detail.md`

## 3. Implementation Status
Partially implemented. The core layout, hero section, access rules, syllabus preview, and sticky call-to-action are functional using `MOCK_COURSE` data[cite: 14]. Note: The instructor profile card shown in the reference image is currently missing from the source implementation.

## 4. Purpose
Serves as the primary landing and marketing page for a specific course, accessible to both authenticated students and unauthenticated visitors (`auth: null`)[cite: 14]. It outlines the course curriculum, access terms, and pricing, acting as a funnel to drive users toward the checkout flow[cite: 14].

## 5. Reference Image
`course-detail.jpeg` (Provides visual context for the hero gradient, card layouts, active/locked syllabus items, and the sticky footer CTA).

## 6. Visual Reference Sources
- **`src/components/ui/Badge.jsx`:** Used for displaying access rules information[cite: 14].
- **`src/components/ui/Button.jsx`:** Defines the styling for the primary "شراء الدورة" (Buy Course) action in the sticky footer[cite: 14].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/courses/:courseId`[cite: 14].
- **Auth & Access:** Publicly accessible (`auth: null`)[cite: 14].
- **Data Entity:** The course object requires `id`, `title_en`, `title_ar`, `description_en`, `description_ar`, `price`, `thumbnailUrl`, `syllabus` (array), `assignmentsCount`, `quizzesCount`, `accessPeriodDays`, and `maxViews`[cite: 14].

## 8. Page Anatomy
1. **Back Navigation:** A simple textual link with a chevron icon to return to the course catalog[cite: 14].
2. **Hero Section:** A large banner featuring the course image, a dark readability gradient overlay, a floating price tag, and the course title/description[cite: 14].
3. **Details Grid:**
    - **Access Rules Card:** Displays viewing limitations (days and maximum views)[cite: 14].
    - **About Card:** Contains the full description and pill-shaped counters for assignments and quizzes[cite: 14].
4. **Syllabus Section:** A list of course lessons. The first item visually indicates it is available for preview, while subsequent items display a lock icon[cite: 14].
5. **Sticky Footer (CTA):** A persistent bottom bar showing the total price and the primary purchase button[cite: 14].

## 9. Layout Specification
- **Container:** The main container uses `space-y-6` for vertical spacing and `pb-28` to ensure content isn't obscured by the fixed sticky footer[cite: 14].
- **Grid Architecture:** The details section utilizes `grid-cols-1 lg:grid-cols-3 gap-6`[cite: 14]. The Access Rules card spans 1 column (`lg:col-span-1`), and the About card spans 2 columns (`lg:col-span-2`)[cite: 14].
- **Hero Image:** Set to a fixed height of `h-64` on mobile, expanding to `sm:h-72` on larger screens, with `object-cover` to fill the rounded container[cite: 14].

## 10. Visual Specification
- **Hero Banner:** Uses `rounded-3xl` and `shadow-card` with an overlaid gradient (`bg-gradient-to-t from-ink-900/85 via-ink-900/35 to-transparent`) for text contrast[cite: 14].
- **Cards:** Standard platform design using `bg-surface-default`, `rounded-2xl`, `p-6`, and `shadow-card`[cite: 14].
- **Syllabus Items:** 
    - **Preview (Unlocked):** Uses brand accent colors (`bg-accent/8`, `border-accent/40`) with a play icon[cite: 14].
    - **Locked:** Uses subdued colors (`bg-surface-muted/40`, `border-surface-border`) with a generic `<LockIcon />`[cite: 14].
- **Typography:** Titles use `font-bold text-ink-900`, body text uses `text-sm text-ink-600 leading-relaxed`[cite: 14].

## 11. Component Reuse
- `Badge` (Used for summarizing access rules)[cite: 14].
- `Button` (Used for the main checkout CTA)[cite: 14].

## 12. User Interactions
- **Back Navigation:** Clicking "العودة إلى الدورات" (Return to courses) navigates to `/:instructorId/courses`[cite: 14].
- **Purchase CTA:** Clicking the "شراء الدورة" button in the sticky footer navigates to `/:instructorId/checkout/:courseId`[cite: 14].

## 13. UI States
- **Syllabus Preview State:** The first item in the syllabus array (`idx === 0`) is explicitly styled as unlocked, showing "متاح للمعاينة" (available for preview)[cite: 14].
- **Syllabus Locked State:** All items where `idx > 0` are rendered with a lock icon, visually indicating they require purchase[cite: 14].

## 14. Responsive Behavior
- **Mobile:** The Hero height is `h-64`[cite: 14]. The grid stacks linearly (`grid-cols-1`)[cite: 14]. The sticky CTA spans the full bottom width.
- **Desktop (lg):** The Hero expands to `h-72`[cite: 14]. The grid utilizes a 3-column split for the detail cards (`lg:grid-cols-3`)[cite: 14]. The sticky footer content is constrained securely in the center via `max-w-3xl`[cite: 14].

## 15. RTL Requirements
- The entire container is wrapped in a `dir="rtl"` attribute[cite: 14].
- In the hero section, the title block aligns right (`text-right`), and the price badge anchors top-right (`absolute right-6 top-6`)[cite: 14].

## 16. Motion & Micro-interactions
- **Hover Transitions:** The back link utilizes `transition-colors hover:text-ink-900` for smooth color shifting on interaction[cite: 14]. Syllabus items use `transition-colors`[cite: 14].
- **Backdrop Blur:** The sticky footer and the "دورة متقدمة" hero pill utilize the `backdrop-blur` utility for a frosted glass effect over underlying content[cite: 14].

## 17. Data & Business Rules
- **Access Limits:** The platform enforces strict rules on content access (e.g., `accessPeriodDays` and `maxViews`). These must be clearly surfaced to the user prior to purchase to manage expectations[cite: 14].
- **Freemium Preview:** The business logic dictates that the first lesson of a course is generally available for preview to drive conversion[cite: 14].

## 18. Do Not Change
- Do not alter the `auth: null` configuration. This page must remain indexable and viewable by unauthenticated users[cite: 14].
- Do not remove the `pb-28` padding from the main container, as this prevents the fixed sticky footer from obscuring the final syllabus items[cite: 14].

## 19. Implementation Instructions
- **API Integration:** Remove `MOCK_COURSE` and implement a dynamic fetch utilizing the `courseId` from the URL parameters.
- **Instructor Profile Addition:** The provided source code lacks the instructor profile card depicted in the `course-detail.jpeg` reference image. Expand the layout to include an instructor info card if the backend provides instructor metadata alongside the course details.
- **Design Alignment:** Ensure the `price` badge position in the hero section matches the final approved design (currently `top-right` in code, but typically `bottom-left/right` in mockup).

## 20. Definition of Done
- The page fetches and displays real course data based on the route parameters.
- The hero image loads correctly and overlays text remains readable.
- Syllabus lists render dynamically based on the backend array, correctly displaying lock/unlock states.
- The sticky CTA correctly routes the user to the checkout flow.
- The layout is fully responsive and adheres strictly to RTL orientation.