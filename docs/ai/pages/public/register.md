# Register Page — UI Reference

## 1. Source
`src/pages/public/RegisterPage.jsx`[cite: 16]
`src/components/forms/RegisterForm.jsx` (Inferred via visual reference and page integration)

## 2. Output
`docs/ai/pages/public/register.md`

## 3. Implementation Status
Implemented[cite: 16]. Serves as the public registration entry point for new users (Students and Parents) joining a specific instructor's tenant (`path: '/:instructorId/register'`)[cite: 16]. Uses a responsive split-screen layout on desktop and a focused card layout on mobile, utilizing the same core authentication visual language as the Login page[cite: 16]. 

## 4. Purpose
To capture user credentials, basic identity information, and account type (Student vs. Parent) for onboarding. The page dynamically incorporates the instructor's context (name and avatar) to reassure users they are registering in the correct environment[cite: 16].

## 5. Visual Reference Sources
- **`register.jpeg`:** Showcases the desktop split-screen layout. The left panel contains promotional illustrations and text, while the right panel houses the interactive registration form with role toggles, standard inputs, side-by-side password fields, and the submit button.
- **`src/components/forms/RegisterForm.jsx`:** The active form component handling role switching, input state, validation, and submission logic (inferred from page component integration)[cite: 16].

## 6. Page Anatomy
1. **Root Container:** A full-height grid layout (`grid min-h-screen grid-cols-1 lg:grid-cols-2`) configured for RTL[cite: 16].
2. **Promo Sidebar (`<aside>`):** A branded, visually rich panel (hidden on mobile) highlighting platform features ("محتوى متكامل", "تتبّع التقدّم") and instructor identity[cite: 16].
3. **Main Content (`<main>`):** The centered container for the form[cite: 16].
4. **Header:** 
   - **Mobile:** Displays instructor avatar and "إنشاء حساب جديد"[cite: 16].
   - **Desktop:** Displays "حساب جديد" and a contextual subtitle[cite: 16].
5. **Registration Form (`<RegisterForm />`):** The card-based interactive form (`rounded-3xl bg-surface-default p-6 shadow-card`)[cite: 16].

## 7. Form Structure & Hierarchy (`RegisterForm.jsx`)
Based on `register.jpeg`, the form follows this vertical hierarchy:
- **Role Toggle (Segmented Control):** Allows users to switch between "طالب" (Student) and "ولي أمر" (Parent). The active state uses the brand's primary yellow color.
- **Full Name Input:** "الاسم الكامل" (Text input).
- **Email Input:** "البريد الإلكتروني" (Email input with LTR placeholder `example@domain.com`).
- **Password Grid:** A 2-column row containing:
  - Password Input: "كلمة السر" (with masked dot characters).
  - Confirm Password Input: "تأكيد كلمة السر".
- **Conditional Input (Parent Role):** If "ولي أمر" is selected, a "كود ربط الطالب" (Student Link Code) field appears, featuring a key icon.
- **Submit Button:** Full-width primary button labeled "إنشاء حساب" with a left-pointing arrow icon (indicating forward progress in RTL).
- **Terms Disclaimer:** Small muted text below the button stating agreement to terms and privacy policy.

## 8. Layout Specification
- **Grid Structure:** Two equal columns on large screens (`lg:grid-cols-2`), stacking into a single column on smaller screens (`grid-cols-1`)[cite: 16].
- **Sidebar Styling:** Utilizes CSS variables for dynamic tenant theming (`var(--color-sidebar)`, `var(--color-accent)`) and includes a subtle background pattern (`bg-geo-pattern-inverse`)[cite: 16].
- **Form Card:** Matches the `LoginPage` aesthetic with `bg-surface-default`, heavy border radius (`rounded-3xl`), and distinct elevation (`shadow-card`)[cite: 16].

## 9. User Interactions & States
- **Role Switching:** Toggling the account type dynamically updates form validation rules and reveals/hides the "Student Link Code" field.
- **Validation:**
  - Standard required field checks.
  - Email format validation.
  - Password strength and exact match validation between the "Password" and "Confirm Password" fields.
- **Error States:** Invalid inputs trigger inline error text and red highlight borders around the corresponding `Input` components.
- **Loading State:** Upon submission, the "إنشاء حساب" button should enter a disabled loading state to prevent double submissions.
- **Success Behavior:** Upon successful registration, the user should be automatically logged in and redirected to their dashboard, or pushed to an onboarding success view.

## 10. Responsive Behavior
- **Mobile (`< 1024px`):** The visual promo `<aside>` is completely hidden (`hidden lg:flex`)[cite: 16]. The form centers itself in the viewport, and the password fields stack vertically to accommodate narrow screens. The mobile-specific header is displayed.
- **Desktop (`≥ 1024px`):** The screen splits 50/50[cite: 16]. The promo sidebar provides branding context on one side, while the desktop-specific header and form occupy the other[cite: 16]. The password fields sit side-by-side.

## 11. RTL Behavior
- The entire page explicitly enforces Right-to-Left orientation (`dir="rtl"`)[cite: 16].
- Flexbox and Grid layouts naturally reverse their flow. (e.g., in `register.jpeg`, the split layout correctly respects RTL flow).
- The submit button icon (an arrow) points to the left, which is the logical "next/forward" direction in Arabic interfaces.

## 12. Data & Business Rules
- **Route Guarding:** Protected by `auth: null` (acting as a guest route)[cite: 16]. Authenticated users attempting to visit this page will be redirected.
- **Tenant Context:** Extracts `instructorId` from URL params to assign the new user to the correct tenant roster upon creation[cite: 16]. It uses `InstructorContext` to dynamically render the instructor's name and avatar[cite: 16].

## 13. Do Not Change
- Do not remove `InstructorContext` integration, as it is critical for white-labeling the page per tenant[cite: 16].
- Do not modify the responsive hiding logic (`hidden lg:flex`) of the promo sidebar[cite: 16].
- Maintain strict alignment with the existing `LoginPage` input styles and form container aesthetics.