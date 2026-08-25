# Tenant Homepage — UI Reference

## 1. Source
`src/pages/student/TenantHomepage.jsx`[cite: 12]

## 2. Output
`docs/ai/pages/student/tenant-homepage.md`

## 3. Implementation Status
Implemented[cite: 12]. The page features a dynamic, themeable hero section displaying the instructor's profile information, alongside a responsive grid presenting the instructor's available course catalog[cite: 12]. Currently relies on mock data (`instructorProfile` and `catalogCourses`) for content[cite: 12].

## 4. Purpose
Serves as the dedicated, public-facing storefront for an individual instructor (tenant)[cite: 12]. It introduces the instructor, highlights their teaching brand/bio, and provides a clear, categorized view of their available courses to prospective and returning students[cite: 12].

## 5. Visual Reference Sources
- **`src/components/common/CourseCard.jsx`:** Used to render individual course items in the catalog grid[cite: 12].
- **Public Directory (`screen_2.jpg`):** While `screen_2.jpg` shows the *global* platform index, this tenant homepage shares its clean, modern, card-based UI and focus on prominent typography and educator branding.

## 6. Page Anatomy
1. **Tenant Hero Section (`<section>`):** A highly stylized, branded header block featuring the tenant's platform badge, instructor name, biography, and quick statistics pills[cite: 12].
2. **Catalog Section (`<section>`):** A section dedicated to listing available courses[cite: 12]. It includes a header with a section title ("الكورسات المتاحة") and a "View All" ("عرض الكل") action, followed by the course card grid[cite: 12].

## 7. Layout Specification
- **Root Layout:** Vertical stacked flow using `flex flex-col gap-10` to create substantial breathing room between the hero and the catalog[cite: 12].
- **Hero Container:** Padded heavily (`p-8 sm:p-12`), relative positioning to contain background effects, with `overflow-hidden` and a large border radius (`rounded-[var(--radius-xl)]`)[cite: 12].
- **Hero Content:** Flex column layout (`flex-col gap-4`) for text, with a wrapping flex row (`flex flex-wrap gap-3`) for the statistics pills[cite: 12].
- **Catalog Header:** Flexbox layout (`flex items-center justify-between mb-5`) to separate the section title from the "View All" link[cite: 12].
- **Catalog Grid:** Standard responsive grid using `grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3`[cite: 12].

## 8. Visual Specification
- **CSS Variable Themeing:** The page relies extensively on CSS variables to adapt to the specific instructor's brand colors:
  - Hero Background: `var(--color-sidebar)`[cite: 12].
  - Accent Colors: `var(--color-accent)`, `var(--color-accent-ink)`, `var(--color-accent-strong)`[cite: 12].
  - Text Colors: `var(--color-sidebar-ink)`, `var(--color-sidebar-ink-muted)`, `var(--color-ink)`[cite: 12].
- **Background Treatments:**
  - **Pattern:** Uses an absolute inset inverse geometric pattern (`bg-geo-pattern-inverse`) mapped over the hero background[cite: 12].
  - **Glow Effect:** Features a soft, decorative accent glow positioned off-center (`-left-16 -top-16`), utilizing `opacity-20` and extreme blur (`blur-3xl`) for an ambient lighting effect[cite: 12].
- **Typography:**
  - Instructor Name: Uses display font `font-display`, scales responsively (`text-3xl sm:text-4xl`), and balances text wrapping (`text-balance`)[cite: 12].
  - Biography: Constrained width (`max-w-xl`), relaxed line height (`leading-relaxed`), and small text (`text-sm`)[cite: 12].
- **Statistic Pills:** Semi-transparent containers (`backgroundColor: "rgba(255,255,255,0.08)"`) with heavy rounding (`rounded-2xl`) that sit cleanly on the colored hero background[cite: 12]. Contains an accent-colored SVG icon and bold text[cite: 12].

## 9. User Interactions
- **View All Action:** A text link ("عرض الكل") with a subtle opacity transition on hover (`transition-opacity hover:opacity-80`)[cite: 12]. Currently acts as a UI placeholder for catalog expansion navigation[cite: 12].
- **Course Selection:** Users interact directly with the standard `CourseCard` components in the grid to view specific course details[cite: 12].

## 10. Responsive Behavior
- **Hero Padding:** Adjusts from standard `p-8` on mobile to expansive `p-12` on larger screens (`sm` breakpoint)[cite: 12].
- **Hero Typography:** Instructor name scales up from `text-3xl` to `text-4xl` on `sm` screens[cite: 12].
- **Course Grid:** Fluidly adapts from a single column on mobile (`grid-cols-1`) to 2 columns on tablets (`sm:grid-cols-2`), and 3 columns on desktop monitors (`lg:grid-cols-3`)[cite: 12].

## 11. RTL Behavior
- Elements inherently support the platform's RTL setup.
- The decorative ambient glow in the hero is positioned using `-left-16`[cite: 12]. In an RTL context, this anchors the glow to the trailing (left) edge, providing visual balance against the right-aligned text content.
- The catalog header naturally places the section title on the right and the "عرض الكل" action on the left using `justify-between`[cite: 12].

## 12. Do Not Change
- Do not remove or hardcode the CSS variable themeing (`var(--color-...)`); it is required for multi-tenant white-labeling[cite: 12].
- Do not modify the responsive breakpoint strategy for the course grid[cite: 12].
- Do not alter the relative `z-index` layering in the hero section, which ensures text remains legible above the decorative glow and pattern overlays[cite: 12].

## 13. Implementation Instructions
1. **API Integration:** Replace `instructorProfile` and `catalogCourses` imports with an active data-fetching hook (e.g., `useTenantData(instructorId)`).
2. **Routing:** Ensure the "عرض الكل" link is wired to the tenant's full catalog route (e.g., `/${instructorId}/courses`).
3. **Empty States:** Add a fallback UI if `catalogCourses.length === 0` to inform visitors that the instructor has not published any courses yet.