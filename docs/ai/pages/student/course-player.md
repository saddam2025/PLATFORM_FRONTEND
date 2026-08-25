# Course Player Page — UI Reference

## 1. Source
`src/pages/student/CoursePlayerPage.jsx`[cite: 10]

## 2. Output
`docs/ai/pages/student/course-player.md`

## 3. Implementation Status
Partially implemented[cite: 10]. The core layout, dynamic watermark movement, content gating/locking logic, remaining access limit badges, expired/limit-reached fallback UI, and sidebar item list are functional[cite: 10]. However, it relies on client-side mock items and access definitions rather than real API integrations[cite: 10].

## 4. Purpose
Serves as the central learning playback environment for enrolled students (`auth: 'student'`)[cite: 10]. It facilitates video streaming, dynamic copyright protection via floating watermarks, progress gating across sequential content (lessons, quizzes, assignments), and access enforcement (view count limits and expiration dates)[cite: 10].

## 5. Reference Image
`course-player.jpeg` (Provides visual context for the two-column player layout, sidebar item list, video controls, watermark overlay, floating header badges, and action buttons for quizzes/assignments).

## 6. Visual Reference Sources
- **`src/components/ui/Avatar.jsx`:** Displays current student user avatar and name in the player header[cite: 10].
- **`src/components/ui/Badge.jsx`:** Renders access counters (remaining views and days left) and item availability indicators[cite: 10].
- **`src/components/ui/Button.jsx`:** Renders primary and secondary actions (Contact Support, Go to Assignment, Go to Quiz)[cite: 10].

## 7. Feature / Backend Context
- **Route:** `/:instructorId/courses/:courseId/learn`[cite: 10].
- **Auth & Access:** Requires student authentication (`auth: 'student'`)[cite: 10].
- **Data Requirements:**
  - `access`: Includes `expiresAt` (ISO date string), `maxViews` (number), and `viewsUsed` (number)[cite: 10].
  - `items`: An ordered list of course items containing `id`, `type` (`'lesson' | 'quiz' | 'assignment'`), `title`, `homeworkDone` (boolean), and `quizPassed` (boolean)[cite: 10].
  - `user`: Currently logged-in student payload containing `name` and `id`[cite: 10].

## 8. Page Anatomy
1. **Sidebar / Playlist (`<aside>`):** Displays total course item count and a list of lessons, quizzes, and assignments[cite: 10]. Handles visual lock indicators and item selection[cite: 10].
2. **Player Header:** Displays the student's avatar/name and remaining access badges (views and expiration days)[cite: 10].
3. **Video Container / Expired Guard:**
   - **Active State:** HTML5 `<video>` element featuring a dynamic anti-piracy watermark overlay[cite: 10].
   - **Blocked State:** An access-denied graphic card displayed if views are exhausted or access has expired[cite: 10].
4. **Lesson Metadata & Quick Actions:** Below the video container; displays the lesson title, description, and direct links to the relevant assignment and quiz[cite: 10].

## 9. Layout Specification
- **Grid Architecture:** Structured as a responsive 4-column layout on desktop:
  - Sidebar: `lg:col-span-1` (Order 1 on desktop, Order 2 on mobile)[cite: 10].
  - Player & Details: `lg:col-span-3` (Order 2 on desktop, Order 1 on mobile)[cite: 10].
- **Container:** `container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6`[cite: 10].
- **Video Aspect:** Standard HTML5 `<video>` constrained to `max-h-[60vh] w-full bg-black`[cite: 10].

## 10. Visual Specification
- **Sidebar Container:** `rounded-3xl bg-surface-default shadow-card p-5`[cite: 10].
- **Selected Item:** `border-accent/40 bg-accent/8`[cite: 10].
- **Locked Item:** `border-transparent bg-surface-muted/50 text-ink-400`[cite: 10].
- **Default Active Item:** `border-surface-border bg-surface-default hover:bg-surface-muted/50`[cite: 10].
- **Watermark:** Translucent (`opacity-30`), absolute positioned text (`text-white text-sm whitespace-nowrap`), pointer events disabled (`pointer-events-none`), smooth translation (`transform -translate-x-1/2 -translate-y-1/2`)[cite: 10].
- **Expired Card:** Muted background (`bg-surface-muted/40`), padded container (`py-16`), centered danger icon container (`bg-danger-DEFAULT/10 text-danger-DEFAULT`)[cite: 10].

## 11. Component Reuse & Reusable Patterns

### Reusable UI Components
- `Avatar`[cite: 10]
- `Badge`[cite: 10]
- `Button`[cite: 10]

### Reusable Student Media Patterns
- **Dynamic Floating Watermark:** A hook or sub-component pattern that periodically relocates user identity text (`user.name - user.id`) across video viewports to prevent screen recording/piracy[cite: 10].
- **Sequential Prerequisite Gating:** Progression logic where item $N$ is locked unless item $N-1$ has both `homeworkDone: true` and `quizPassed: true`[cite: 10].
- **Access Enforcement Wrapper:** Conditional rendering strategy that blocks video playback and swaps in a support CTA when `isExpired` or `isLimitReached` is true[cite: 10].

## 12. User Interactions
- **Playlist Item Selection:** Clicking an unlocked item scrolls the viewport smoothly to top (`window.scrollTo({ top: 0, behavior: 'smooth' })`) to focus on the player[cite: 10]. Locked items ignore click events[cite: 10].
- **Quick Action Links:**
  - Clicking "الواجب" (Assignment) navigates to `/:instructorId/courses/:courseId/assignments`[cite: 10].
  - Clicking "الاختبار" (Quiz) navigates to `/:instructorId/courses/:courseId/quizzes`[cite: 10].
  - Clicking "تواصل مع الدعم" (Contact Support) on access block navigates to `/support`[cite: 10].

## 13. UI States
- **Default Active Playback State:** Access is valid. Video player is active with floating watermark[cite: 10]. Lesson title and action buttons are visible[cite: 10].
- **Expired State (`isExpired = true`):** Access date is in the past[cite: 10]. Video player is replaced with "انتهت صلاحية الوصول لهذه المحاضرة" and a support button[cite: 10].
- **Limit Reached State (`isLimitReached = true`):** View count limit reached (`viewsUsed >= maxViews`)[cite: 10]. Video player is replaced with "لقد استنفدت عدد مرات المشاهدة المسموحة" and a support button[cite: 10].
- **Item Gating States:**
  - `unlocked`: Clicking loads/scrolls to the item[cite: 10]. Shows type icon, title, and "متاح" badge[cite: 10].
  - `locked`: Clicking is disabled[cite: 10]. Displays lock icon and "مقفل" label[cite: 10].

## 14. Responsive & Mobile Behavior
- **Mobile (`< lg`):**
  - Grid converts to a single column (`grid-cols-1`)[cite: 10].
  - Order is flipped: Player & video details section (`order-1`) displays above the playlist sidebar (`order-2`) so video content is immediately available without scrolling[cite: 10].
  - Quick action buttons (Assignment/Quiz) stack vertically on small screens (`flex-col sm:flex-row`)[cite: 10].
- **Desktop (`≥ lg`):**
  - Playlist sidebar rendered on the right (`order-1` in RTL layout, spanning 1 column)[cite: 10].
  - Main player rendered on the left (spanning 3 columns)[cite: 10].

## 15. RTL Requirements
- Root container explicitly specifies `dir="rtl"`[cite: 10].
- Text aligns to the right (`text-right`) for headings and descriptions[cite: 10].
- Flex gaps and icons lead text naturally from right to left[cite: 10].
- Chevron and back icons orient correctly according to RTL direction[cite: 10].

## 16. Motion & Micro-interactions
- **Watermark Repositioning:** A randomized `setTimeout` timer shifts the watermark coordinates within bounds (`top: 8%-80%`, `left: 8%-90%`) every 4000ms to 6000ms after an initial 800ms mount delay[cite: 10].
- **Item Hover Effects:** Unlocked playlist cards feature `transition-colors` with a subtle background shift (`hover:bg-surface-muted/50`)[cite: 10].

## 17. Data & Business Rules
- **Sequential Unlocking Rule:** Item $0$ is always unlocked[cite: 10]. Item $i$ ($i > 0$) is locked unless `item[i-1].homeworkDone === true` AND `item[i-1].quizPassed === true`[cite: 10].
- **Access Expiration Rule:** Calculated via `new Date() > new Date(access.expiresAt)`[cite: 10].
- **View Limit Rule:** Calculated via `access.viewsUsed >= access.maxViews`[cite: 10].
- **Days Remaining Calculation:** Ceil difference between `access.expiresAt` and `now` converted to days[cite: 10]. Returns `0` if negative or on date parsing failure[cite: 10].

## 18. Do Not Change
- Do not remove the watermark anti-piracy logic; it is a key technical requirement for student media pages[cite: 10].
- Do not remove the prerequisite gating logic (`homeworkDone` && `quizPassed`)[cite: 10].
- Do not modify the mobile grid order (`order-1` for player, `order-2` for playlist)[cite: 10].

## 19. Implementation Instructions
1. **Hook Correction:** Ensure `useAuth` continues to be imported from `../../hooks/useAuth`[cite: 10].
2. **API Data Binding:** Replace mock values (`access`, `items`, static `videoSrc`) with an API query hook (e.g., `useCoursePlayer(courseId)`).
3. **Player Event Tracking:** Connect HTML5 `<video>` events (`onPlay`, `onEnded`, `onTimeUpdate`) to track view count increments and update completion progress in the backend.
4. **Button Variant Compliance:** Ensure button variants adhere strictly to available UI library definitions (`primary`, `ghost`)[cite: 10].

## 20. Definition of Done
- Player correctly streams lesson video when access rules are satisfied[cite: 10].
- Floating user watermark dynamically moves across the screen at randomized intervals[cite: 10].
- Expiration or view limit depletion properly blocks video playback and renders the support CTA[cite: 10].
- Subsequent course items unlock automatically only after previous assignments and quizzes are completed[cite: 10].
- Layout adapts seamlessly between mobile (player top) and desktop (player left, playlist right) in RTL mode[cite: 10].