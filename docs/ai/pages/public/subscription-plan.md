# Subscription Plan Page — UI Reference

## 1. Source
`src/pages/public/SubscriptionPlanPage.jsx`[cite: 16]

## 2. Output
`docs/ai/pages/public/subscription-plan.md`

## 3. Implementation Status
Implemented[cite: 16]. Operates as a public route (`path: '/:instructorId/stages/:stageId/plans'`, `auth: null`) determining how a student will purchase access to the educational content for a previously selected stage[cite: 16]. Uses a side-by-side comparative card layout[cite: 16].

## 4. Purpose
To present the user with the platform's two primary monetization models: a comprehensive Monthly Subscription or a flexible Pay-per-Lecture model[cite: 16]. It highlights features, prices, and academic requirements (e.g., exam gates) before routing the user to checkout or the course catalog[cite: 16].

## 5. Visual Reference Sources
- **`subscription-plan.jpeg`:** Demonstrates the high-contrast, clean card design. The Monthly plan is emphasized as the primary path with brand colors (yellow button, prominent placement).
- **`src/components/ui/Button.jsx`:** Provides `primary`, `subtle`, and `ghost` variants used for the CTAs[cite: 16].
- **`src/components/ui/Badge.jsx`:** Renders the "الأكثر شيوعاً" (Most Popular) highlight[cite: 16].

## 6. Page Anatomy
1. **Header:** Title ("خطط الاشتراك") and descriptive subtitle contextualizing the choice[cite: 16].
2. **Main Content Grid:** A balanced two-column grid housing the plan cards[cite: 16].
3. **Monthly Subscription Card:** The primary offering, featuring a badge, price, feature list, academic progression rule, and primary checkout action[cite: 16].
4. **Pay-per-Lecture Card:** The secondary offering, featuring price, feature list, and action to browse individual courses[cite: 16].

## 7. Layout Specification
- **Root Layout:** Full-height container (`min-h-screen bg-surface-canvas`) set to RTL (`dir="rtl"`)[cite: 16].
- **Header:** Padding and bottom border (`bg-surface-default border-b border-surface-border px-4 py-6`)[cite: 16].
- **Card Grid:** `grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch`, ensuring both cards share equal height regardless of content differences[cite: 16].
- **Card Internal Layout:** Flex column layout (`flex flex-col`), grouping header/price at the top, features in the middle, and pinning actions to the bottom (`mt-6`)[cite: 16].

## 8. Plan Details & Visual Presentation

### Monthly Subscription (اشتراك شهري)
- **Highlight:** Includes a `Badge` component labeled "الأكثر شيوعاً" (Most Popular)[cite: 16].
- **Pricing Typography:** Large bold text (`text-3xl font-bold text-ink-900`) displaying the rate (e.g., "199 ر.س / شهر")[cite: 16].
- **Academic Rule (Exam Gate):** Includes a specific warning text block (`text-sm text-ink-500`) stating: "يجب اجتياز اختبار الشهر بنسبة 50% على الأقل للاشتراك بالشهر التالي" (Must pass the monthly exam with at least 50% to subscribe to the next month)[cite: 16]. This ties into the broader `MonthlyExamGatePage` logic.
- **CTA:** Primary yellow button (`variant="primary"`) labeled "اشترك الآن"[cite: 16].

### Pay-per-Lecture (الدفع لكل محاضرة)
- **Pricing Typography:** Large bold text matching the monthly card, displaying the per-unit rate (e.g., "15 ر.س / محاضرة")[cite: 16].
- **CTA:** Uses a subdued button style (`variant="subtle"`) labeled "تصفح المحاضرات" to visually de-emphasize it compared to the monthly plan[cite: 16].

### Feature Lists
- Both cards render an unordered list (`<ul className="mt-6 space-y-3">`) using a custom `FeatureItem` component[cite: 16].
- Each item features a brand-colored checkmark SVG (`text-brand-500`) aligned next to the feature text (`text-sm`)[cite: 16].

## 9. User Interactions & Transitions
- **Monthly Checkout Transition:** Clicking "اشترك الآن" triggers `goToSubscriptionCheckout`, navigating to `/${instructorId}/checkout/subscription/${stageId}`[cite: 16].
- **Per-Lecture Transition:** Clicking "تصفح المحاضرات" triggers `goToCourses`, navigating directly to the catalog via `/${instructorId}/stages/${stageId}/courses`[cite: 16].
- **Secondary Actions:** Both cards include a secondary `variant="ghost"` button ("تفاصيل الخطة" and "مقارنة") for future modal or expansion logic[cite: 16].

## 10. Locked / Disabled States
- Currently, the 50% exam requirement is presented as an informational text block (`text-sm text-ink-500`) on the public view[cite: 16]. 
- *Note for deeper implementation:* When integrated with authenticated user state, this button should visually disable or redirect to a `MonthlyExamGatePage` explanation if the student has failed the prerequisite exam.

## 11. Responsive Behavior
- **Mobile/Tablet (`< 1024px`):** The grid collapses to a single column (`grid-cols-1`), stacking the Monthly card above the Per-Lecture card[cite: 16].
- **Desktop (`≥ 1024px`):** The layout utilizes two side-by-side columns (`lg:grid-cols-2`)[cite: 16].

## 12. RTL Behavior
- Global RTL is strictly enforced (`dir="rtl"`)[cite: 16].
- The layout inherently places the Monthly Subscription card on the right (the primary starting point in an RTL reading flow) and the Per-Lecture card on the left[cite: 16].
- Header text is explicitly aligned to the right (`text-right`)[cite: 16].
- The `FeatureItem` SVG checkmarks are rendered on the right side of the text, matching RTL expectations[cite: 16].

## 13. Data & Business Rules
- **Context Preservation:** Requires `instructorId` and `stageId` route parameters to maintain the user's intended path toward checkout[cite: 16].
- **Pricing:** Prices (`monthlyPrice`, `perLecturePrice`) and features (`monthlyFeatures`, `perLectureFeatures`) are defined within the component scope, ready to be replaced by API data[cite: 16].

## 14. Do Not Change
- Do not modify the target routing URLs (`/${instructorId}/checkout/subscription/${stageId}` and `/${instructorId}/stages/${stageId}/courses`), as downstream checkout pages expect this specific parameter structure[cite: 16].
- Do not change the `items-stretch` class on the grid, as equal-height cards are a strict requirement for side-by-side pricing UI[cite: 16].
- Do not remove the academic warning (50% rule) from the monthly subscription card[cite: 16].