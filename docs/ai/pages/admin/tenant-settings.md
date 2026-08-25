# TenantSettingsPage — UI Reference

## Source Page

`src/pages/admin/TenantSettingsPage.jsx`[cite: 11]

## Backend / Feature Context

This page serves as the configuration hub for tenant administrators (instructors)[cite: 11]. It allows them to manage platform branding, configure the Paymob payment gateway for direct commission-free sales, and manage their teaching assistants' roles and permissions[cite: 11]. Currently, the page relies heavily on mock data and simulated API responses for UI interactions (such as saving payment settings or generating access codes), though it contains draft `api.post` and `api.patch` calls for assistant management[cite: 11]. Note that inline comments indicate potential issues with double `/api/v1` prefixes in the current API integration drafts[cite: 11].

## Reference Image

`tenant-settings.jpeg`

## Purpose

The `TenantSettingsPage` allows platform owners to personalize their learning management system instance[cite: 11]. It provides controls for visual identity (logo and theme), financial integration (Paymob API keys), team management (inviting and setting permissions for assistants), and currently includes a section for generating lecture access codes[cite: 11].

## Current Structure

The page is vertically segmented into four distinct configuration sections[cite: 11]:
1.  **Header:** Displays the page title ("إعدادات المنصة") and a dynamic subtitle welcoming the user[cite: 11].
2.  **Section 1: Branding (الهوية البصرية):** Contains a file input for a logo upload with a visual preview, a text input for the brand name, and radio buttons to toggle between light and dark themes[cite: 11].
3.  **Section 2: Payment Gateway (بوابة الدفع (Paymob)):** Includes inputs for the Paymob API Key (with a toggleable visibility state) and the Integration ID, followed by a save button[cite: 11].
4.  **Section 3: Assistant Manager (إدارة المساعدين):** Features a header with an "إضافة مساعد" (Add Assistant) toggle button[cite: 11]. It contains a conditionally rendered form to invite new assistants by specifying their name, email, and specific permissions[cite: 11]. Below the form is a table listing current assistants, their invite status, their granted permissions, and actions to edit those permissions[cite: 11].
5.  **Section 4: Lecture Access Codes (أكواد الوصول للمحاضرات):** A utility section to generate a specific number of access codes for a selected mock course, including a feature to copy generated codes to the clipboard[cite: 11].

## Visual Direction

There are significant visual and structural differences between the provided code and the `tenant-settings.jpeg` reference image:
*   **Section Headers:** The reference design features distinct, colored, rounded icon badges next to section titles (e.g., a palette for branding, a credit card for payments, and a users icon for assistants). The current code lacks these icons entirely[cite: 11].
*   **Input Aesthetics:** The code utilizes standard bordered inputs with a white background (`bg-surface-default`)[cite: 11]. The reference design features borderless, soft purple filled rectangles for input fields.
*   **Button Styling:** The design utilizes prominent yellow primary buttons. The code leverages a generic `variant="primary"`, which depending on platform defaults, may not match the design's specific yellow[cite: 11].
*   **Layout Alignment:** In the "Branding" section of the design, the logo upload is a large circular dropzone with a text label beside it. The code uses a standard `<input type="file">` alongside a square image preview[cite: 11].
*   **Missing Sections:** Section 4 (Lecture Access Codes) exists in the code but is not visible in the provided reference image crop[cite: 11].

## Layout

*   **Container:** The page is wrapped in a `min-h-screen bg-surface-canvas` container with `container mx-auto px-4 py-6` for centering and padding[cite: 11].
*   **Cards:** Each major settings category is wrapped in a `rounded-2xl bg-surface-default shadow-card p-6 mb-4` container[cite: 11].
*   **Grids:** Uses responsive CSS grids (`grid-cols-1 md:grid-cols-2` or `md:grid-cols-3`) to arrange inputs side-by-side on larger screens[cite: 11].

## Typography

*   **Page Title:** `text-2xl font-semibold`[cite: 11].
*   **Section Titles:** `text-lg font-semibold text-ink-900`[cite: 11].
*   **Input Labels:** `text-sm font-medium text-ink-700`[cite: 11].
*   **Helper Text:** `text-xs text-ink-500` used for explanations and copy feedback[cite: 11].

## Components

*   `Input`: `../../components/ui/Input`[cite: 11]
*   `Button`: `../../components/ui/Button`[cite: 11]
*   `Badge`: `../../components/ui/Badge`[cite: 11]

## Actions

*   **Theme Toggle:** Selecting a theme radio button triggers `handleThemeSelect`, which calls `toggleTheme()` from `ThemeContext` if the selection differs from the current state[cite: 11].
*   **Logo Upload:** Triggers `URL.createObjectURL` to generate a local preview of the selected image[cite: 11].
*   **Save Payment Settings:** Simulates a save action, logging data to the console and displaying a temporary success banner[cite: 11].
*   **Create Assistant:** Submits an API POST request to create an assistant, appends the mocked/returned assistant to the local list, and displays an invite link[cite: 11].
*   **Copy Invite Link:** Writes the generated invite link to the system clipboard[cite: 11].
*   **Edit Permissions:** Toggles an inline editing mode for a specific assistant row in the table, allowing checkbox modification of `can_upload_video`, `can_grade_exams`, and `can_generate_access_codes` before simulating a PATCH request[cite: 11].
*   **Generate Codes:** Creates a specified number of randomized 8-character uppercase alphanumeric codes[cite: 11].

## States

*   **Visibility Toggle:** The Paymob API key input toggles between `password` and `text` types based on the `showApiKey` boolean[cite: 11].
*   **Success Feedback:** Temporary text banners (`text-success-DEFAULT`) appear after copying links, codes, or saving payment settings[cite: 11].
*   **Error Handling:** Catch blocks in API requests populate `formError` or `editError` states, rendering inline danger banners (`bg-danger-soft`)[cite: 11].
*   **Invite Status:** Badges visually differentiate assistant statuses (e.g., `success` variant for 'active', `neutral` variant for 'pending')[cite: 11].

## Responsive Behavior

*   The layout utilizes CSS grid breakpoints (`md:grid-cols-2`, `md:grid-cols-3`) to collapse side-by-side form fields into single columns on mobile viewports[cite: 11].

## RTL

*   The root `div` explicitly enforces right-to-left layout via the `dir="rtl"` attribute[cite: 11]. The assistant table also includes a localized `dir="rtl"` attribute[cite: 11].

## Data / Business Logic Constraints

*   **Theme Context:** The code acknowledges that `ThemeContext` currently only exposes a `toggleTheme` function, requiring logic to ensure the toggle is only fired when the radio selection diverges from the active theme[cite: 11].
*   **Assistant Editing:** Editing permissions happens completely inline within the table row rather than opening a separate modal[cite: 11].

## Do Not Change

*   Do not alter the payload structure or boolean requirements for the assistant permissions (`can_upload_video`, `can_grade_exams`, `can_generate_access_codes`) as they reflect backend contract expectations[cite: 11].
*   Retain the clipboard API implementation (`navigator.clipboard.writeText`) for copy functionalities[cite: 11].

## AI Implementation Rules

*   Update the section headers to include the illustrative icons (palette, credit card, users) as depicted in the reference design.
*   Refactor the input field styling across the page to match the soft-filled, borderless aesthetic of the reference image.
*   Reconfigure the "Branding" section's logo upload to match the circular drag-and-drop/upload UI shown in the design, removing the standard file input text.
*   Investigate the architectural placement of Section 4 (Lecture Access Codes); verify if it belongs on this settings page or if it should be fully migrated to the `ScratchCardManager` page where similar code generation exists.

## Definition of Done

The component is considered complete when the visual UI precisely matches the provided `tenant-settings.jpeg` reference (including section icons and input aesthetics), API endpoint paths are corrected (removing double `/api/v1` prefixes), and the assistant invitation flow operates flawlessly with a live backend.