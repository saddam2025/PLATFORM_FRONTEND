# Login Page — UI Reference

## 1. Source
`src/pages/public/LoginPage.jsx`[cite: 15]
`src/components/forms/LoginForm.jsx` (Inferred via visual reference and page integration)

## 2. Output
`docs/ai/pages/public/login.md`

## 3. Implementation Status
Implemented[cite: 15]. Serves as the primary authentication entry point for users attempting to access a specific tenant's educational platform (`path: '/:instructorId/login'`, `auth: 'guest'`)[cite: 15]. Features a centered authentication card layout containing the login form[cite: 15].

## 4. Purpose
Allows returning students and users to authenticate into a specific instructor's tenant environment. The route is protected by a `'guest'` auth guard, meaning users who are already logged in will be automatically redirected away from this page[cite: 15]. 

## 5. Visual Reference Sources
- **`login.jpeg`:** Demonstrates the visual layout, showcasing the card-based form, input fields with start/end icons, primary call-to-action button, and auxiliary navigation links (forgot password, sign up).
- **`src/components/forms/LoginForm.jsx`:** The encapsulated form component handling state, validation, and submission logic[cite: 15].

## 6. Page Anatomy
1. **Root Container:** A full-screen canvas centering the authentication card[cite: 15].
2. **Authentication Card:** An elevated surface container restricting the maximum width of the form[cite: 15].
3. **Card Header:** Contains the primary title ("تسجيل الدخول") and a welcoming subtitle ("أدخل بياناتك للوصول إلى حسابك")[cite: 15].
4. **Login Form (`<LoginForm />`):** The interactive core containing:
   - Email Input field.
   - Password Input field.
   - "Forgot Password?" recovery link.
   - Primary Submission Button.
   - "Create Account" navigational prompt.

## 7. Layout Specification
- **Root Layout:** Full viewport height, flexbox centering (`min-h-screen bg-surface-canvas text-ink-900 flex items-center justify-center px-4`)[cite: 15].
- **Card Container:** Constrained width container with standard elevation and padding (`w-full max-w-md bg-surface-default rounded-2xl shadow-card p-6`)[cite: 15].
- **Header Alignment:** Explicitly right-aligned text block (`text-right mb-6`) to adhere to RTL standards[cite: 15].
- **Spacing:** `mb-6` (24px) separating the header text from the `LoginForm` component[cite: 15].

## 8. Typography & Branding
- **Page Title:** Uses `text-2xl font-semibold`[cite: 15].
- **Subtitle:** Uses muted text `text-sm text-ink-500 mt-1`[cite: 15].
- **Tenant Context:** The URL parameter `instructorId` is passed directly to the `LoginForm` (`<LoginForm instructorId={instructorId} />`), which can be used to scope the authentication request or fetch specific tenant branding (such as the tenant logo seen in the visual reference)[cite: 15].

## 9. Component Reuse & Form Structure (`LoginForm.jsx`)
Based on the visual reference `login.jpeg` and standard platform architecture, the `LoginForm` leverages the following reusable UI patterns:
- **`Input` Component (Email):**
  - Label: "البريد الإلكتروني"
  - Placeholder: "example@domain.com"
  - Icon (Start/Trailing in RTL): Envelope icon.
  - Type: `email`.
- **`Input` Component (Password):**
  - Label: "كلمة المرور"
  - Placeholder: "********"
  - Icon (Start/Trailing in RTL): Lock icon.
  - Icon (End/Leading in RTL): Password visibility toggle (Eye icon).
  - Type: `password`.
- **Navigation Links:**
  - Password Recovery: "نسيت كلمة المرور؟" positioned below the password input, aligned to the start (right in RTL).
  - Sign Up Prompt: "ليس لديك حساب؟ إنشاء حساب" centered at the bottom of the card, utilizing a secondary/link button variant.
- **`Button` Component (Submit):**
  - Variant: `primary` (Brand yellow accent as seen in `login.jpeg`).
  - Label: "تسجيل الدخول".
  - Icon: Arrow indicating entry/submission.
  - Width: Full width (`w-full`).

## 10. User Interactions & States
- **Validation:** 
  - Email format validation upon blur or submission.
  - Password presence check.
- **Error States:** Invalid credentials or server errors should manifest as red error borders on the inputs and an inline error message block above the submit button.
- **Loading State:** Upon submission, the primary button should transition to a disabled/loading state (e.g., displaying a spinner) to prevent duplicate submissions.
- **Password Visibility:** Clicking the eye icon in the password field toggles the input type between `password` and `text`.

## 11. Responsive Behavior
- **Mobile (`< 640px`):** The form spans the full width of the screen minus the horizontal padding (`px-4`), utilizing the full available space[cite: 15]. 
- **Tablet/Desktop (`≥ 640px`):** The card is constrained to a maximum width (`max-w-md`), ensuring the form inputs do not stretch excessively and remain readable[cite: 15].

## 12. RTL Behavior
- The entire page explicitly enforces Right-to-Left orientation using `dir="rtl"` on the root `<div>`[cite: 15].
- Header text is bound to the right edge via `text-right`[cite: 15].
- Form labels and inputs naturally align text to the right.
- Input icons are mirrored contextually (e.g., the lock/envelope icons sit on the right side of the input field, while the password reveal toggle sits on the left).

## 13. Data & Business Rules
- **Authentication Guard:** Handled by the route definition (`auth: 'guest'`)[cite: 15]. Authenticated sessions must be redirected to `/:instructorId/dashboard` or the origin URL.
- **Tenant Isolation:** The form must include the `instructorId` parameter in its authentication payload to ensure the user is authenticated against the correct instructor's student roster[cite: 15].

## 14. Do Not Change
- Do not remove the `dir="rtl"` directive on the page wrapper[cite: 15].
- Do not alter the route parameter requirement (`/:instructorId/login`)[cite: 15].
- Do not modify the `auth: 'guest'` route protection[cite: 15].