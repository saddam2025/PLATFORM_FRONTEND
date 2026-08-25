# ScratchCardManager — UI Reference

## Source Page

`src/pages/admin/ScratchCardManager.jsx`[cite: 10]

## Backend / Feature Context

This page currently operates on client-side state with mocked data and generation algorithms[cite: 10]. Access is restricted based on user roles and permissions; specifically, only users with the `admin` role or the `can_generate_access_codes` permission can generate new codes[cite: 10]. The page manages two distinct types of codes: monetary "Scratch Cards" (بطاقات الشحن) and direct "Lecture Access Codes" (أكواد المحاضرات)[cite: 10].

## Reference Image

`design-reference/admin/scratch-card-manager.jpeg`

## Purpose

The `ScratchCardManager` allows administrators and permitted assistants to bulk-generate and manage access codes[cite: 10]. These codes enable students to top up their wallet balances or bypass paywalls for specific lectures[cite: 10]. The interface also serves as a ledger to track which codes have been redeemed, by whom, and when[cite: 10].

## Current Structure

The page uses a tabbed interface to separate the two primary functions[cite: 10].
1.  **Header:** Displays the page title ("أكواد التفعيل") and a subtitle[cite: 10].
2.  **Permission Warning (Conditional):** Shows a danger badge if the user lacks generation permissions[cite: 10].
3.  **Tab Navigation:** Two toggle buttons for "بطاقات الشحن" (Scratch Cards) and "أكواد المحاضرات" (Lecture Codes)[cite: 10].
4.  **Tab 1 (Scratch Cards):**
    *   **Generation Form:** Inputs for Count, Batch ID, and Value, plus a submit button[cite: 10].
    *   **Ledger/Table:** A search input for Batch ID filtering and a table displaying code details, values, redemption status, and batch info[cite: 10].
5.  **Tab 2 (Lecture Codes):**
    *   **Generation Form:** Inputs for Count and a dropdown to select a specific lecture[cite: 10].
    *   **Output Grid:** Displays the generated codes in a grid with a "Copy All" action[cite: 10].

## Visual Direction

There are notable discrepancies between the current source code and the `scratch-card-manager.jpeg` reference image:
*   **Page Title:** The code uses "أكواد التفعيل" (Activation Codes)[cite: 10], while the reference design uses "إدارة الأكواد" (Code Management).
*   **Currency:** The code hardcodes `ج.م` (EGP) for scratch card values[cite: 10], whereas the design uses `ر.س` (SAR).
*   **Form Aesthetics:** The reference design displays form inputs with a light purple background and a distinct yellow primary button. The code uses standard platform UI inputs and buttons[cite: 10].
*   **Table Controls & Pagination:** The design shows icon buttons (filter, export) above the table and a pagination component below it. The code currently utilizes a simple text input for batch searching and lacks pagination[cite: 10].
*   **Status Badges:** The design features rounded pill badges with a small dot indicator for status. The code uses the standard platform `Badge` component[cite: 10].

## Layout

*   **Container:** Uses `space-y-6` for vertical rhythm and `dir="rtl"` for layout direction[cite: 10].
*   **Generation Forms:** Utilizes responsive CSS grids (`grid-cols-1 md:grid-cols-4` for scratch cards, `grid-cols-1 md:grid-cols-3` for lectures)[cite: 10].
*   **Table Container:** Employs `overflow-x-auto` to ensure the table remains accessible on smaller viewports[cite: 10].

## Typography

*   **Page Title:** `text-xl font-semibold text-ink-900`[cite: 10].
*   **Tab Text:** `text-sm font-medium`[cite: 10].
*   **Table Data (Codes):** Employs `font-mono` to ensure fixed-width character alignment for the alphanumeric codes[cite: 10].

## Components

*   `Input`: `../../components/ui/Input`[cite: 10]
*   `Button`: `../../components/ui/Button`[cite: 10]
*   `Badge`: `../../components/ui/Badge`[cite: 10]

## Actions

*   **Tab Switching:** Toggles active view between scratch cards and lecture codes[cite: 10].
*   **Generate Cards/Codes:** Prevented (button disabled) if the `canGenerate` permission evaluates to false[cite: 10]. Appends new mocked items to the respective state arrays[cite: 10].
*   **Toggle Reveal:** Unmasks an individual scratch card code in the table (switches from `1234-••••` to the full code)[cite: 10].
*   **Copy All (Lecture Codes):** Writes the generated lecture codes array to the system clipboard[cite: 10].

## States

*   **Permissions:** UI restricts actions and displays warnings based on `user.permissions` containing `can_generate_access_codes`[cite: 10].
*   **Masked Codes:** By default, the last segment of the code is obfuscated[cite: 10]. The UI allows selective unmasking per row[cite: 10].
*   **Redemption Status:** Maps a boolean (`isRedeemed`) to visual badge states (Success/Neutral)[cite: 10].
*   **Copy Status:** Briefly displays "تم النسخ" (Copied) after clicking the copy button[cite: 10].

## Responsive Behavior

*   Forms switch from a single stacked column (`grid-cols-1`) on mobile to a row layout (`md:grid-cols-x`) on larger screens to align with bottom-anchored submit buttons[cite: 10].

## RTL

*   The layout is explicitly configured for Right-to-Left formatting, which affects column ordering in the grids and text alignment in the tables[cite: 10].

## Data / Business Logic Constraints

*   Codes are generated randomly using a base-36 algorithm mapped to four-character chunks separated by dashes[cite: 10].
*   Lecture codes are bound to a specific `lectureId`, whereas Scratch Cards carry a specific monetary `value` and are grouped by a `batchId`[cite: 10].

## Do Not Change

*   Do not alter the permission evaluation logic checking `can_generate_access_codes`[cite: 10].
*   Retain the masking functionality (`maskCode` and `toggleReveal`) as it prevents accidental exposure of full codes during screen sharing or administration[cite: 10].

## AI Implementation Rules

*   When updating the UI to match the reference design, prioritize adding the missing export/filter UI elements and the pagination footer.
*   Update the page title and localized string representations (e.g., currency symbols) to align with the design specifications if platform localization settings dictate.

## Definition of Done

The component is considered complete when the layout closely mimics the reference image's aesthetic (including section titles and layout groupings), pagination and export interfaces are implemented, and code generation/fetching is connected to secure backend API routes.