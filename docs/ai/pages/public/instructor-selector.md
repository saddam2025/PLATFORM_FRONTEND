# Instructor Selector Page — UI Reference

## 1. Source
`src/pages/public/InstructorSelectorPage.jsx`[cite: 13]

## 2. Output
`docs/ai/pages/public/instructor-selector.md`

## 3. Implementation Status
Implemented[cite: 13]. Serves as the primary public root landing page (`path: '/'`, `index: true`, `auth: null`)[cite: 13]. Features a hero header banner, dynamic state handling (skeleton loading, grid presentation, empty/error state with retry functionality), and direct tenant context selection[cite: 13].

## 4. Purpose
Allows unauthenticated and authenticated users to browse all available instructors on the platform[cite: 13]. Selecting an instructor sets the active instructor context (`selectInstructor`) and navigates the user directly to that instructor's educational stages (`/:id/stages`)[cite: 13].

## 5. Visual Reference Sources
- **`instructor-selector.jpeg`:** Demonstrates the public visual language, hero banner section, and multi-column instructor card layout.
- **`src/components/ui/Avatar.jsx`:** Renders large instructor profile avatars (`size="lg"`)[cite: 13].
- **`src/components/ui/Badge.jsx`:** Displays subject specialization badges (e.g., "رياضيات")[cite: 13].
- **`src/components/ui/Button.jsx`:** Renders primary action buttons in empty/error states[cite: 13].

## 6. Page Anatomy
1. **Hero Header:** Background image banner overlay (`heroImg`) with a dark overlay, platform title ("منصة التعليم"), and promotional tagline[cite: 13].
2. **Main Content Container:** Constrained responsive container (`container mx-auto px-4 py-8`) hosting dynamic state views[cite: 13].
3. **Instructor Grid:** Multi-column layout displaying interactive instructor selection cards[cite: 13].
4. **Empty / Fallback State:** Centered card view displaying a title, helpful subtext, and a retry button when no instructors are found[cite: 13].
5. **Loading State:** Skeleton pulse grid with placeholder cards[cite: 13].

## 7. Layout Specification
- **Root Container:** `min-h-screen bg-surface-canvas text-ink-900` with explicit RTL direction (`dir="rtl"`)[cite: 13].
- **Hero Banner:** Full-width header (`w-full`) with responsive height (`h-56 md:h-72 lg:h-80`) overlayed with `bg-black/40`[cite: 13].
- **Grid Layout:** 1 column on mobile, 2 columns on tablet, 3 columns on desktop (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`)[cite: 13].
- **Instructor Card Internal Layout:** Outer clickable container (`button.text-right.bg-surface-default.rounded-2xl.shadow-card.p-4.flex.flex-col.items-stretch`) containing:
  - Header Row: Avatar on the right, title/badge and bio on the left (`flex items-center gap-4`)[cite: 13].
  - Footer Row: Location metadata on the right, directional call-to-action ("عرض المسارات") on the left (`mt-4 flex items-center justify-between`)[cite: 13].

## 8. Visual Specification
- **Hero Image:** Background coverage via `bg-cover bg-center` using localized asset `hero.png` with a `bg-black/40` tint layer for high contrast text readability[cite: 13].
- **Instructor Card Elevation & Transitions:** `shadow-card hover:shadow-lg transition-shadow`[cite: 13].
- **Bio Text Clamp:** Constrained bio description utilizing `line-clamp-2 overflow-hidden` with `WebkitLineClamp: 2` fallback[cite: 13].
- **Typography & Colors:**
  - Hero Header: `text-3xl md:text-4xl lg:text-5xl font-bold text-white`[cite: 13].
  - Hero Subtitle: `text-sm md:text-base text-white/90`[cite: 13].
  - Instructor Name: `text-lg font-semibold text-ink-900`[cite: 13].
  - Bio Text: `text-sm text-ink-700`[cite: 13].
  - Location Label: `text-xs text-ink-500`[cite: 13].
  - Action Label: `text-sm text-ink-600`[cite: 13].
- **Skeleton Loaders:** 6 animated cards (`Array.from({ length: 6 })`) using `animate-pulse bg-surface-muted rounded-2xl h-40`[cite: 13].

## 9. Search & Filter Presence
- **Search/Filter:** **Not present.** The component renders all instructors provided by `InstructorContext` directly without search inputs, subject filter tabs, or sorting controls[cite: 13].

## 10. User Interactions
- **Card Click Selection:** Clicking any instructor card triggers `handleSelect(ins)`, executing `selectInstructor(ins)` in the context and navigating to `/:instructorId/stages`[cite: 13].
- **Retry Attempt:** In empty/error states, clicking "إعادة المحاولة" triggers `fetchInstructors()` via `InstructorContext`[cite: 13].

## 11. Responsive Behavior
- **Mobile (`< 640px`):** Hero height `h-56`[cite: 13]. Instructor grid collapses to a single full-width column (`grid-cols-1`)[cite: 13].
- **Tablet (`640px - 1024px`):** Hero height scales to `h-72`[cite: 13]. Instructor grid expands to 2 columns (`sm:grid-cols-2`)[cite: 13].
- **Desktop (`≥ 1024px`):** Hero height scales to `h-80`[cite: 13]. Instructor grid expands to 3 columns (`lg:grid-cols-3`)[cite: 13].

## 12. RTL Behavior
- Explicitly enforced at the top-level container (`dir="rtl"`)[cite: 13].
- Text inside instructor cards is explicitly aligned right (`text-right`)[cite: 13].
- Flex containers (`flex items-center gap-4`) naturally place the `Avatar` on the right side and text content on the left in RTL mode[cite: 13].

## 13. Data & Business Rules
- **Route Definition:** `path: '/'`, `index: true`, `auth: null`, `title: 'اختر المدرس'`[cite: 13].
- **Instructor ID Resolution:** Identifier fallback order evaluates `ins.id`, then `ins._id`, and lastly `ins.name`[cite: 13].
- **Bio Fallback:** If `tagline` and `bio` are missing, defaults to `'مدرس متخصص يقدم محتوى متميز ومتابعة شخصية.'`[cite: 13].

## 14. Do Not Change
- Do not alter the route parameter target (`/:id/stages`) on instructor selection[cite: 13].
- Do not add client-side search or subject filtering unless explicitly requested and backed by context features[cite: 13].
- Do not remove the `dir="rtl"` attribute from the primary page wrapper[cite: 13].

## 15. Implementation Instructions
1. **Context Provision:** Ensure `InstructorContext` provides `instructors`, `loading`, `selectInstructor`, and `fetchInstructors`[cite: 13].
2. **Navigation Validation:** Confirm that target routes `/:instructorId/stages` exist and correctly read the selected instructor context or URL parameter[cite: 13].

## 16. Definition of Done
- Renders hero banner with full RTL text alignment[cite: 13].
- Displays skeleton cards when `loading` is true[cite: 13].
- Lists instructor cards in a responsive grid when `instructors` array contains data[cite: 13].
- Invokes `selectInstructor` and navigates to `/:id/stages` when an instructor card is clicked[cite: 13].
- Renders empty card with retry button when no instructors are available[cite: 13].