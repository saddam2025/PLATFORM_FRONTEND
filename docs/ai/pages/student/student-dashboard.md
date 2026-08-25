# Student Dashboard — UI Reference

## 1. Source
`src/pages/student/StudentDashboard.jsx`[cite: 13]

## 2. Output
`docs/ai/pages/student/student-dashboard.md`

## 3. Implementation Status
Implemented[cite: 13]. Features a student greeting header with wallet balance badge and theme toggle, an enrolled courses grid with progress bars and access metrics, a parent connection code box with clipboard copy functionality, and quick action navigation triggers[cite: 13]. Uses client-side mock course and parent code data[cite: 13].

## 4. Purpose
Serves as the main home dashboard and central navigation hub for authenticated students (`auth: 'required'`, `roles: ['student']`)[cite: 13]. It gives students an immediate overview of their current course enrollments, completion progress, remaining access quotas, wallet balance, parent pairing credentials, and fast paths to supplemental features like the Leaderboard and Reels[cite: 13].

## 5. Reference Image
`student-dashboard.jpeg` (Provides visual context for the student welcome hero, top header badges, parent link code box, horizontal course progression cards, and feature shortcuts).

## 6. Visual Reference Sources
- **`src/components/ui/Avatar.jsx`:** Renders the student's personal profile picture or fallback initials in the header[cite: 13].
- **`src/components/ui/Badge.jsx`:** Renders wallet balance pill, course view count remainders, and access duration warnings[cite: 13].
- **`src/components/ui/Button.jsx`:** Renders action triggers for theme toggling, clipboard code copying, course playback entry, and feature navigation[cite: 13].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/dashboard`[cite: 13].
- **Auth & Access:** Requires authenticated student user (`auth: 'required'`, `roles: ['student']`)[cite: 13].
- **Data Entity:** Requires `user` object (`name`, `avatar`, `walletBalance`), `MOCK_ENROLLED_COURSES` array (`id`, `title`, `thumbnailUrl`, `progressPercent`, `accessExpiresAt`, `viewsRemaining`), and `MOCK_PARENT_ACCESS_CODE` string[cite: 13].

## 8. Page Anatomy
1. **Header & Profile Bar:** Displays the student's avatar, welcome text, wallet balance badge, and dark/light theme switch[cite: 13].
2. **Enrolled Courses Section ("دوراتي"):** Responsive card grid presenting active courses, completion progress bars, view quotas, and remaining access days[cite: 13].
3. **Parent Link Code Box ("كود ربط ولي الأمر"):** Card section displaying a monospace access key with a quick one-click clipboard copy button[cite: 13].
4. **Quick Navigation Links:** Feature entry triggers linking directly to "لوحة الشرف" (Leaderboard) and "الفيديوهات القصيرة" (Reels)[cite: 13].

## 9. Layout Specification
- **Root Layout:** Vertical stacked flow using `space-y-8` with explicit RTL direction (`dir="rtl"`)[cite: 13].
- **Header Row:** Flexbox alignment `flex flex-wrap items-center justify-between gap-4` separating student identity from wallet/theme controls[cite: 13].
- **Courses Grid:** Responsive grid using `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`[cite: 13].
- **Parent Code Row:** Flexbox container `flex items-center gap-3` pairing the monospace text display box with a side action button[cite: 13].
- **Quick Links Row:** Wrapping flexbox container `flex items-center gap-3 flex-wrap`[cite: 13].

## 10. Visual Specification
- **Card Container:** Standard elevated container using `bg-surface-default rounded-2xl shadow-card p-4` (p-6 for standard cards)[cite: 13].
- **Course Thumbnail Frame:** Aspect container `w-full h-32 rounded-lg overflow-hidden bg-surface-muted`[cite: 13].
- **Progress Track:** Full-width track `w-full h-2 rounded-full bg-surface-muted overflow-hidden`[cite: 13].
- **Progress Fill Bar:** Accent fill `h-full bg-brand-500 rounded-full` with dynamic percentage width inline styling[cite: 13].
- **Parent Code Display:** Monospace badge input look `flex-1 px-4 py-2 rounded-lg bg-surface-muted font-mono text-ink-900 text-sm`[cite: 13].
- **Badge Variants:**
  - Wallet: `<Badge variant="brand">`[cite: 13].
  - Views Remaining: `<Badge variant="info">`[cite: 13].
  - Normal Expiration (> 2 days): `<Badge variant="neutral">`[cite: 13].
  - Urgent Expiration ($\le 2$ days): `<Badge variant="danger">`[cite: 13].

## 11. Reusable Visual Patterns for Future Student Pages

`StudentDashboard` serves as one of the **PRIMARY visual references** for all student-facing views across the platform[cite: 13]. Future student pages should inherit the following established visual patterns:

- **Identity Greeting Header:** Top row pairing `Avatar` with heading text (`text-lg font-semibold text-ink-900`) and subtle metadata subtitle (`text-sm text-ink-500`), balanced by header badges and utility actions[cite: 13].
- **Standard Card Hierarchy:** Primary Content Cards use `bg-surface-default rounded-2xl shadow-card`, while Secondary/Internal Containers use `bg-surface-muted rounded-lg`[cite: 13].
- **Course Card Layout Pattern:** A vertical stack containing thumbnail media at the top, bold title, visual progress bar, quota/expiration badges, and a full-width bottom CTA button (`variant="primary" size="sm"`)[cite: 13].
- **Monospace Code Copy Block:** A copyable credential block featuring a full-width `bg-surface-muted font-mono` container alongside a `variant="ghost"` action button with temporary state feedback ("تم النسخ")[cite: 13].
- **Subtle Quick Action Navigation:** Horizontal flex wrapping row of `Button` elements with `variant="subtle"` for secondary feature paths[cite: 13].

## 12. User Interactions & Micro-interactions
- **Theme Switcher:** Toggling the theme button executes `toggleTheme()` via `ThemeContext`, updating application-wide color tokens[cite: 13].
- **Copy Parent Code:** Clicking the "نسخ" button writes `MOCK_PARENT_ACCESS_CODE` to the system clipboard via `navigator.clipboard.writeText`, updates local state `copied = true`, and changes button text to "تم النسخ" for 2000ms[cite: 13].
- **Course Playback Action:** Clicking "استمرار" navigates to `/:instructorId/player/:courseId`[cite: 13].
- **Quick Link Actions:**
  - Clicking "لوحة الشرف" navigates to `/:instructorId/leaderboard`[cite: 13].
  - Clicking "الفيديوهات القصيرة" navigates to `/:instructorId/reels`[cite: 13].

## 13. UI States
- **Default Dashboard View:** Shows logged-in user details, active course cards, parent code section, and quick links[cite: 13].
- **Copied State (`copied = true`):** Changes copy button label from "نسخ" to "تم النسخ" temporarily[cite: 13].
- **Urgent Access State (`remainingDays <= 2`):** Expiration badge automatically converts to `variant="danger"` to highlight impending access cutoff[cite: 13].
- **Dark/Light Mode:** Seamlessly updates surface tokens (`bg-surface-default`, `bg-surface-muted`, `text-ink-900`) according to global theme context[cite: 13].

## 14. Responsive Behavior
- **Mobile (`< md`):** Courses render in a single-column layout (`grid-cols-1`)[cite: 13]. Header elements wrap vertically if space is constrained (`flex-wrap`)[cite: 13].
- **Tablet (`≥ md`):** Courses grid transitions to 2 columns (`md:grid-cols-2`)[cite: 13].
- **Desktop (`≥ lg`):** Courses grid expands to 3 columns (`lg:grid-cols-3`)[cite: 13].

## 15. RTL Behavior
- Page root specifies explicit `dir="rtl"`[cite: 13].
- Header greetings, section titles, and course labels align right[cite: 13].
- Flex containers flow naturally from right to left, placing action buttons and status badges on the opposite side of primary labels[cite: 13].

## 16. Spacing & Grid System
- Section spacing: `space-y-8` (32px vertical separation between main sections)[cite: 13].
- Heading bottom margins: `mb-4` (16px) for major sections, `mb-2` (8px) for card titles[cite: 13].
- Grid gap: `gap-4` (16px spacing between grid cards)[cite: 13].
- Card internal padding: `p-4` (16px) for course cards, `p-6` (24px) for full-width section cards[cite: 13].

## 17. Data & Business Rules
- **Access Expiration Calculation:** `daysLeft()` converts ISO date string difference into days via `Math.ceil((expiresAt - now) / 86400000)`, returning `0` if past[cite: 13].
- **Wallet Fallback:** Wallet balance defaults to `0` if `user.walletBalance` is undefined[cite: 13].
- **Name Fallback:** Header greeting defaults to `'الطالب'` if `user.name` is missing[cite: 13].

## 18. Do Not Change
- Do not remove the `dir="rtl"` root configuration[cite: 13].
- Do not alter the route parameter structure (`/:instructorId/dashboard`)[cite: 13].
- Do not change the 2-day threshold for dangerous course access badge styling[cite: 13].

## 19. Implementation Instructions
1. **API Integration:** Replace `MOCK_ENROLLED_COURSES` and `MOCK_PARENT_ACCESS_CODE` with real query hooks (e.g., `useEnrolledCourses()` and `useStudentProfile()`).
2. **Dynamic Navigation:** Ensure navigation parameters match actual instructor tenant IDs dynamically passed via `useParams()`.
3. **Empty Enrolled Courses State:** Add an empty state component with a CTA encouraging course exploration if the student has zero enrolled courses.

## 20. Definition of Done
- Student avatar, greeting, and wallet balance display accurately from user context[cite: 13].
- Enrolled course cards render progress bars, remaining view counts, and calculated days remaining[cite: 13].
- Expiration badge turns red when remaining days are 2 or fewer[cite: 13].
- Parent code box copies code to clipboard with visual confirmation feedback[cite: 13].
- Layout is fully responsive and strictly aligns to RTL guidelines across all break points[cite: 13].