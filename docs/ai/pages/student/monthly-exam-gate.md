# docs/ai/pages/student/monthly-exam-gate.md

## Page Overview
**Path:** `src/pages/student/MonthlyExamGatePage.jsx`
**Route:** `/:instructorId/subscriptions/gate`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
A gatekeeping page that blocks access to the next subscription month until the student passes the required monthly exam.

## Backend Context
- `GET /subscriptions/:stageId/checkout`
- Monthly exam submission endpoints.

## Visual References
1. `src/pages/student/SubscriptionDashboard.jsx` (for month cards)
2. `src/components/ui/EmptyState.jsx` (for the locked messaging layout)
3. `src/components/ui/Alert.jsx` (for warning/requirement banners)

## Design Intent & Patterns
- **Layout:** Centered focus card on an off-white background explaining the restriction.
- **Lock UI:** Use the existing locked/padlock icon patterns. 
- **Typography:** Clear, elegant Arabic messaging stating "You must pass the month's final exam to unlock the next stage."
- **Buttons:** A primary CTA directing the student to the required exam. If the exam is already passed, the CTA should smoothly transition to the checkout/unlock flow.# docs/ai/pages/student/monthly-exam-gate.md

## Page Overview
**Path:** `src/pages/student/MonthlyExamGatePage.jsx`
**Route:** `/:instructorId/subscriptions/gate`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
A gatekeeping page that blocks access to the next subscription month until the student passes the required monthly exam.

## Backend Context
- `GET /subscriptions/:stageId/checkout`
- Monthly exam submission endpoints.

## Visual References
1. `src/pages/student/SubscriptionDashboard.jsx` (for month cards)
2. `src/components/ui/EmptyState.jsx` (for the locked messaging layout)
3. `src/components/ui/Alert.jsx` (for warning/requirement banners)

## Design Intent & Patterns
- **Layout:** Centered focus card on an off-white background explaining the restriction.
- **Lock UI:** Use the existing locked/padlock icon patterns. 
- **Typography:** Clear, elegant Arabic messaging stating "You must pass the month's final exam to unlock the next stage."
- **Buttons:** A primary CTA directing the student to the required exam. If the exam is already passed, the CTA should smoothly transition to the checkout/unlock flow.