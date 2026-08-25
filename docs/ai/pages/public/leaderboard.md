# Leaderboard Page — UI Reference

## 1. Source
`src/pages/public/LeaderboardPage.jsx`[cite: 14]

## 2. Output
`docs/ai/pages/public/leaderboard.md`

## 3. Implementation Status
Implemented[cite: 14]. Features a public honor roll leaderboard (`path: '/:instructorId/leaderboard'`, `auth: null`) displaying top student performers in assignments and exams[cite: 14]. Uses client-side mock student data sorted dynamically by total score, complete with stage filtering, top-3 podium cards, and a full ranking data table[cite: 14].

## 4. Purpose
Serves as an encouragement and recognition view for students under a specific instructor domain[cite: 14]. It ranks students by calculated overall performance scores (`totalScore`) derived from assignment averages (`homeworkAvg`) and exam averages (`examAvg`)[cite: 14].

## 5. Visual Reference Sources
- **`leaderboard.jpeg`:** Demonstrates visual layout containing top-3 podium arrangement (with center rank #1 height emphasis, badges, avatars) and the bottom detailed ranking table.
- **`src/components/ui/Avatar.jsx`:** Used for rendering student profile pictures across podium cards (`size="lg"`) and table rows (`size="sm"`)[cite: 14].
- **`src/components/ui/Badge.jsx`:** Displays top-3 rank titles ("الأول", "الثاني", "الثالث") on podium cards[cite: 14].
- **`src/components/ui/Button.jsx`:** Button design system available for structural extensions[cite: 14].

## 6. Page Anatomy
1. **Header Bar (`<header>`):** Title bar with trophy icon, subtitle ("أفضل الطلاب في الواجبات والاختبارات"), and stage filter dropdown ("تصفية حسب المرحلة")[cite: 14].
2. **Top 3 Podium Section (`<section>`):** Card grid featuring highlighted podium cards for ranks #1, #2, and #3 with distinct background accents[cite: 14].
3. **Full Rankings Table Section (`<section>`):** Detailed table displaying all filtered students with explicit ranking numbers, names, stages, assignment averages, exam averages, and total scores[cite: 14].

## 7. Layout Specification
- **Root Layout:** Vertical stacked layout (`min-h-screen bg-surface-canvas text-ink-900`) set explicitly to RTL (`dir="rtl"`)[cite: 14].
- **Header Row Layout:** Flex container (`flex items-center justify-between`) containing title group on the right and stage filter control on the left[cite: 14].
- **Main Container:** Centered responsive container (`container mx-auto px-4 py-8 space-y-6`)[cite: 14].
- **Top 3 Grid:** 3-column layout on desktop (`grid grid-cols-1 lg:grid-cols-3 gap-6`)[cite: 14].
- **Table Container:** Rounded card container (`rounded-2xl bg-surface-default shadow-card p-4`) wrapping a responsive overflow table (`overflow-x-auto`)[cite: 14].

## 8. Visual Specification
- **Podium Accent Variants:**
  - **Rank #1 (First):** Light yellow accent (`bg-yellow-100 border-yellow-200`) with badge label "الأول"[cite: 14].
  - **Rank #2 (Second):** Light gray accent (`bg-gray-100 border-gray-200`) with badge label "الثاني"[cite: 14].
  - **Rank #3 (Third):** Light amber accent (`bg-amber-50 border-amber-200`) with badge label "الثالث"[cite: 14].
- **Table Highlight State:**
  - Rows for top-3 students (rank $\le 3$) feature a subtle brand highlight background (`bg-brand-50`)[cite: 14].
  - Rows are separated by standard borders (`border-t border-surface-border`)[cite: 14].
- **Typography & Colors:**
  - Trophy Icon: Brand accent color (`text-brand-500`)[cite: 14].
  - Main Title: Bold headline (`text-2xl font-semibold`)[cite: 14].
  - Total Score Value: Bold primary brand text (`font-bold text-brand-600`)[cite: 14].
  - Table Headers: Subtle muted text (`text-xs text-ink-500`)[cite: 14].

## 9. Filters & Search
- **Stage Filter Dropdown:**
  - Select control allowing users to filter leaderboard data by educational stage[cite: 14].
  - Options: Default "الكل" (All) plus specific stage values (` الصف السابع` through `الصف الثاني عشر`)[cite: 14].
  - Dynamically filters both podium cards and table rows simultaneously[cite: 14].
- **Search:** **Not present.** The implementation does not include student name or ID text search inputs[cite: 14].

## 10. User Interactions
- **Stage Filter Selection:** Selecting a stage via the header `<select>` updates `stageFilter` state[cite: 14]. This dynamically re-calculates sorted rankings, updating both the top-3 podium and the full table view[cite: 14].

## 11. Empty & Loading States
- **Loading State:** **Not present.** Data is directly processed from in-memory arrays (`MOCK_STUDENTS`) via `useMemo`[cite: 14].
- **Empty State:** If stage filter results yield zero matches, `top3` renders empty cards, and the table body renders no rows[cite: 14].

## 12. Responsive Behavior
- **Mobile (`< 1024px`):** Top 3 podium cards stack vertically into 1 column (`grid-cols-1`)[cite: 14]. Header filter wraps or adjusts within flex containers[cite: 14]. Table scrolls horizontally (`overflow-x-auto`) to preserve layout integrity[cite: 14].
- **Desktop (`≥ 1024px`):** Top 3 podium cards expand into a 3-column row (`lg:grid-cols-3`)[cite: 14].

## 13. RTL Behavior
- Enforced at page container level (`dir="rtl"`)[cite: 14].
- Table headers and cell contents are explicitly aligned right (`text-right`)[cite: 14].
- Flexbox items flow from right to left, positioning the trophy icon on the right side of the main title[cite: 14].

## 14. Data & Business Rules
- **Ranking Calculation:** Sorting is executed in descending order using `totalScore` (`b.totalScore - a.totalScore`)[cite: 14].
- **Top-3 Podium Allocation:** `top3 = filtered.slice(0, 3)`[cite: 14].
- **Table Population:** Renders all items in `filtered` array with computed numerical ranks (`rank = i + 1`)[cite: 14].

## 15. Do Not Change
- Do not remove `dir="rtl"` top-level directional configuration[cite: 14].
- Do not alter the total score sorting priority[cite: 14].
- Do not remove top-3 table row highlight styles (`bg-brand-50`)[cite: 14].

## 16. Implementation Instructions
1. **Data Hook Integration:** Replace static `MOCK_STUDENTS` and `STAGES` arrays with real API data hooks (e.g., `useLeaderboard(instructorId)`).
2. **Dynamic Podium Order:** Ensure podium card rendering visually emphasizes the 1st rank (e.g., center position on desktop views if required by enhanced design systems).

## 17. Definition of Done
- Leaderboard header displays trophy icon and stage filter dropdown[cite: 14].
- Top-3 students render in dedicated podium cards with distinct accent colors and badges ("الأول", "الثاني", "الثالث")[cite: 14].
- Table lists full student rankings with explicit positions, assignment averages, exam averages, and total scores[cite: 14].
- Stage filter correctly filters both podium and table data[cite: 14].
- Layout is responsive and fully supports RTL orientation[cite: 14].