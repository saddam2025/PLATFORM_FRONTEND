# Checkout Page — UI Reference

## 1. Source
`src/pages/student/CheckoutPage.jsx`[cite: 12]

## 2. Output
`docs/ai/pages/student/checkout.md`

## 3. Implementation Status
Partially implemented. The layout, state management, and user flows for both scratch cards and electronic payments are built[cite: 12]. However, the actual Paymob iframe and backend validation for scratch cards are currently mocked[cite: 12]. 

## 4. Purpose
Provides a secure checkout interface allowing students to purchase specific courses or activate monthly subscriptions[cite: 12]. It offers two main payment avenues: pre-paid scratch cards and an electronic payment gateway (Paymob)[cite: 12].

## 5. Reference Image
No specific reference image provided. Follows the platform's standard card and dashboard layout aesthetic.

## 6. Visual Reference Sources
- **Shared Components:** `Input`, `Button`, and `Badge` dictate form field, action button, and tag styles[cite: 12].
- **Subscription Patterns:** The summary card inherits styling cues from standard subscription selection, utilizing clean borders, explicit pricing, and clear contrast.

## 7. Feature / Backend Context
- **Route:** `/:instructorId/checkout/:courseId`[cite: 12].
- **Auth & Access:** Requires authentication and the `student` role[cite: 12].
- **Purchase Type Logic:** Distinguishes between course purchases and platform subscriptions based on the `courseId` parameter; if it equals `'subscription'`, the checkout configures for a subscription model[cite: 12].
- **Stage Tracking:** Captures an optional `stageId` from URL search parameters to associate subscriptions with a specific academic stage[cite: 12].

## 8. Page Anatomy
1.  **Header:** Displays the page title ("الدفع") and a dynamic subtitle detailing whether it is a course purchase or a subscription activation[cite: 12].
2.  **Payment Method Selector:** Two pill-style toggle buttons allowing the user to switch between "بطاقة شحن" (Scratch Card) and "الدفع الإلكتروني" (Electronic Payment)[cite: 12].
3.  **Payment Form Area:** 
    - *Scratch Card View:* Contains a text input, validation messaging, and a primary submit button[cite: 12].
    - *Paymob View:* Displays a loading skeleton, resolving into a placeholder for the Paymob payment iframe[cite: 12].
4.  **Order Summary Card:** A dedicated sticky-style sidebar displaying the item title, applicable stage badge, and the final price total in Egyptian Pounds (ج.م)[cite: 12].

## 9. Layout Specification
- **Container:** Constrained to `max-w-4xl mx-auto` to maintain readability and focus[cite: 12].
- **Vertical Rhythm:** Uses `space-y-6` between the header and main content block[cite: 12].
- **Grid Architecture:** Utilizes a responsive grid (`grid-cols-1 lg:grid-cols-3 gap-6`)[cite: 12].
- **Column Distribution:** On large screens, the payment selection/forms span two columns (`lg:col-span-2`), while the order summary occupies one column[cite: 12].

## 10. Visual Specification
- **Cards:** Uses the standard platform container style: `bg-surface-default`, `rounded-2xl`, and `shadow-card` with `p-6` padding[cite: 12].
- **Method Toggle Buttons:**
  - Active: Uses `bg-brand-500 text-ink-900` for high visibility[cite: 12].
  - Inactive: Uses `bg-surface-default border border-surface-border text-ink-700`[cite: 12].
- **Typography:**
  - Page Title: `text-xl font-semibold text-ink-900`[cite: 12].
  - Subtitle: `text-sm text-ink-500 mt-1`[cite: 12].
  - Total Price: `font-semibold text-ink-900`[cite: 12].
- **Success Banner:** Uses `bg-success-soft text-success-DEFAULT` with `rounded-md`[cite: 12].

## 11. Component Reuse
- `../../components/ui/Input`[cite: 12].
- `../../components/ui/Button`[cite: 12].
- `../../components/ui/Badge`[cite: 12].

## 12. User Interactions
- **Toggle Methods:** Clicking the payment method buttons switches the visible payment form state (`method` state)[cite: 12].
- **Code Entry:** Typing in the scratch card input clears any existing validation errors and updates the `code` state[cite: 12].
- **Form Submission:** Submitting the scratch card triggers a loading state (`activating`), validates the input (currently against a mock `'VALID123'`), and initiates a success flow or an error message[cite: 12].

## 13. UI States
- **Idle (Scratch Card):** Input is empty, button reads "تفعيل" (Activate)[cite: 12].
- **Error (Scratch Card):** Missing or invalid code sets `codeError`, passing a red outline/message to the `Input` component[cite: 12].
- **Activating:** Button disables and reads "جارٍ التفعيل..." (Activating...) during simulated network request[cite: 12].
- **Success:** Payment form hides, replaced by a green success banner stating "تم التفعيل بنجاح! جارٍ التحويل..." (Activated successfully! Redirecting...)[cite: 12].
- **Paymob Loading:** Shows a pulsing skeleton (`animate-pulse bg-surface-muted h-64`) simulating iframe network load[cite: 12].
- **Paymob Loaded:** Displays the iframe container (currently a placeholder reading "بوابة الدفع (Paymob)")[cite: 12].

## 14. Responsive Behavior
- **Mobile/Tablet:** The layout stacks vertically into a single column (`grid-cols-1`), placing the payment forms directly above the order summary[cite: 12].
- **Desktop:** At the `lg` breakpoint, expands to a 3-column grid where the summary card sits adjacent to the payment forms[cite: 12].

## 15. RTL Requirements
- The top-level container strictly enforces right-to-left layout via `dir="rtl"`[cite: 12].
- Flexbox utility `justify-between` in the summary card correctly anchors labels to the right and prices to the left within the RTL context[cite: 12].

## 16. Motion & Micro-interactions
- **Toggle Animation:** The payment method buttons utilize `transition-colors` for a smooth active/inactive state change[cite: 12].
- **Loading Skeleton:** The Paymob placeholder uses `animate-pulse` to indicate loading before resolving[cite: 12].
- **Delays:** Artificial timeouts simulate real-world loading latency before redirects[cite: 12].

## 17. Data & Business Rules
- **Redirection Logic:** On successful payment, subscriptions redirect the user to `/:instructorId/dashboard`, whereas course purchases redirect directly to the learning environment at `/:instructorId/player/:courseId`[cite: 12].
- **Mock Validation:** Currently strictly checks against `'VALID123'` to allow testing of the success flow[cite: 12].

## 18. Do Not Change
- Do not invent direct credit card inputs. The architecture explicitly delegates electronic payments to the external Paymob gateway iframe[cite: 12].
- Maintain the exact `instructorId` and `courseId` URL parameters required for route matching[cite: 12].
- Preserve the RTL structure (`dir="rtl"`)[cite: 12].

## 19. Implementation Instructions
- **API Wiring:** Replace the `'VALID123'` mock logic with an actual backend `POST` request to validate scratch cards and process enrollment[cite: 12].
- **Paymob Integration:** Replace the gray `h-64` placeholder `div` with an actual iframe rendering the Paymob gateway[cite: 12]. This requires fetching the integration key/token from the tenant's configured backend settings.
- **Dynamic Pricing:** Remove `MOCK_COURSE` and `MOCK_SUBSCRIPTION`. Fetch actual price details and titles based on the `courseId` and `stageId` from the backend context[cite: 12].

## 20. Definition of Done
- The page renders correctly on both mobile (stacked) and desktop (two-column split).
- Users can toggle smoothly between Scratch Card and Paymob payment views.
- Entering a valid scratch card registers the purchase via API and successfully redirects the user to the correct post-purchase page.
- The Paymob iframe successfully loads and handles the external payment lifecycle.
- Real dynamic pricing data populates the order summary.