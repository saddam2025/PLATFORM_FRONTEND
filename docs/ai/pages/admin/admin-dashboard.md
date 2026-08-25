# AdminDashboard — UI Reference

## Source Page

`src/pages/admin/AdminDashboard.jsx`

## Backend / Feature Context

The page currently relies entirely on frontend mock data constants (`MOCK_SUMMARY`, `MOCK_REVENUE_TREND`, `MOCK_REVENUE_SOURCES`, `MOCK_STUDENTS_EXPORT`). There are no active API service calls implemented in the current source for retrieving dashboard metrics or handling the export functionality (which relies on a client-side CSV blob generation).

## Reference Image

`design-reference/admin/admin-dashboard.jpeg`

## Purpose

Provides a high-level overview of platform performance for the Admin role. It displays key metrics, revenue trends, revenue source breakdowns, and offers quick access to common administrative actions like managing courses, viewing settings, and exporting student data.

## Current Structure

1.  **Page Header:** Greeting with the user's name and a subtitle.
2.  **Summary Cards:** Four metric cards showing active students, published courses, pending assistant tasks, and monthly revenue.
3.  **Data Visualization Section:**
    *   **Revenue Trend:** A custom CSS-based bar chart spanning the last 6 months.
    *   **Revenue Sources:** A breakdown of revenue sources (Paymob vs. Scratch Cards) with percentage progress bars.
4.  **Quick Actions:** A section containing direct links to key admin routes and a CSV export trigger.

## Visual Direction

The reference image communicates a clean, analytical, and spacious dashboard. The code implements a basic version of this, but the reference image indicates a more refined visual direction:
*   Summary cards are intended to have dedicated icons and trend indicators (e.g., "+12%").
*   The "Quick Actions" section is intended to be displayed as large, square, icon-centric cards, rather than the standard inline horizontal buttons currently in the code.
*   The revenue chart in the reference image features vertical Y-axis labels (50k, 40k, etc.) and horizontal grid lines, which are absent in the current simple CSS bar chart implementation.

## Layout

*   **Container:** Standard `dir="rtl"` block with `space-y-6` for vertical flow.
*   **Grid (Summary Cards):** Uses `grid-cols-1`, scaling to `sm:grid-cols-2` and `lg:grid-cols-4` with a `gap-4`.
*   **Grid (Middle Section):** Uses `grid-cols-1 lg:grid-cols-3` with `gap-6`. The revenue chart spans 2 columns (`lg:col-span-2`), and the revenue sources card takes the remaining 1 column.
*   **Grid (Quick Actions):** Currently a simple flexbox layout (`flex flex-wrap gap-3`), but the reference image suggests a grid of uniform cards.

## Typography

*   **Page Title:** `text-xl font-semibold text-ink-900`
*   **Section Titles:** `text-lg font-medium text-ink-900`
*   **Card Values:** `text-2xl font-bold text-ink-900`
*   **Subtitles/Labels:** `text-sm text-ink-500`, `text-xs text-ink-500`

## Components

*   `Button`: `../../components/ui/Button`
*   `Badge`: `../../components/ui/Badge`
*   `Link`: `react-router-dom`

## Cards

*   **Styling:** All cards utilize `bg-surface-default rounded-2xl shadow-card`. Padding varies slightly (`p-5` for summary cards, `p-6` for larger section cards).
*   **Usage:** Used for the 4 summary metrics, the revenue chart container, the revenue sources container, and the quick actions container.

## Actions

*   **Primary:** "إدارة الدورات" (Manage Courses) - currently a primary styled `Button`.
*   **Secondary/Ghost:** "أكواد الدخول / كروت الشحن" (Access Codes), "الإعدادات" (Settings), and "تصدير بيانات الطلاب" (Export Student Data).
*   *(Note: The reference image highlights the "Export Student Data" action with a distinct golden/yellow card background, diverging from the standard button styling).*

## States

*   **Data Driven:** The heights of the bars in the revenue chart and the widths of the progress bars in the revenue sources section are dynamically calculated inline based on the mock data percentages.
*   *Note: No explicit loading, empty, or error states are currently implemented in the JSX.*

## Responsive Behavior

*   **Mobile:** Everything stacks in a single column (`grid-cols-1`).
*   **Tablet (`sm`):** Summary cards form a 2x2 grid.
*   **Desktop (`lg`):** Summary cards form a 1x4 row. The middle section splits into a 2:1 ratio (Chart:Sources).

## RTL

*   The entire page is wrapped in `dir="rtl"`.
*   Data flows from right to left (e.g., the oldest month is on the far right of the bar chart, moving leftwards to the newest month).
*   The1. **Files Inspected:** `src/pages/admin/AdminDashboard.jsx`[cite: 1]
2. **Reference Image:** A reference image was found (`admin-dashboard.jpeg`).

```markdown
# Admin Dashboard Documentation

**File Path:** `src/pages/admin/AdminDashboard.jsx`  
**Route:** `/:instructorId/admin/dashboard`  
**Authentication:** Required (`admin`)  
**Title:** لوحة التحكم (Control Panel)

## 1. Overview
The `AdminDashboard` component acts as the main landing page for platform administrators[cite: 1]. It provides a high-level overview of the platform's performance, including student activity, course metrics, revenue trends, and quick access to common administrative actions[cite: 1]. The layout is optimized for RTL (Right-to-Left) Arabic formatting[cite: 1].

## 2. Dependencies
**External Libraries:**
* `react`: Utilizing `useMemo` for calculating derived state[cite: 1].
* `react-router-dom`: Utilizing `Link` for navigation and `useParams` to extract the `instructorId` from the URL[cite: 1].

**Internal Hooks:**
* `useAuth`: Used to retrieve the current logged-in `user` to display a personalized greeting[cite: 1].

**UI Components:**
* `Button`: Custom UI component for rendering interactive buttons[cite: 1].
* `Badge`: Custom UI component for rendering status or source indicators[cite: 1].

## 3. Data & State Management
Currently, the component uses statically defined mock constants to render the dashboard charts and metrics[cite: 1].
* **`MOCK_SUMMARY`**: Contains overall platform statistics (active students, published courses, pending assistant tasks, monthly revenue)[cite: 1].
* **`MOCK_REVENUE_TREND`**: An array containing 6 months of historical revenue data used for the bar chart[cite: 1].
* **`MOCK_REVENUE_SOURCES`**: Data representing the breakdown of revenue streams (e.g., Paymob vs. Scratch Cards)[cite: 1].
* **`MOCK_STUDENTS_EXPORT`**: A sample array of student objects used to demonstrate the CSV export functionality[cite: 1].

Derived variables using `useMemo`:
* **`maxRevenue`**: Calculates the peak monthly revenue from the trend array to dynamically scale the bar chart heights[cite: 1].
* **`totalRevenueSources`**: Sums the total revenue to calculate percentage widths for the source breakdown progress bars[cite: 1].

## 4. Helper Functions
* **`formatCurrency(n)`**: Converts a numeric value into a localized Egyptian Pound string (e.g., "1,000 ج.م")[cite: 1].
* **`SummaryCard({ label, value })`**: A purely presentational internal sub-component that displays a metric with a label and a large bold value inside a styled card[cite: 1].
* **`exportStudentsCsv(students)`**: Generates a CSV file from a given array of student objects[cite: 1]. It correctly maps headers in Arabic, handles cell formatting, applies a UTF-8 BOM to ensure Arabic characters render properly in Excel, and automatically triggers a download in the user's browser[cite: 1].

## 5. UI Structure
The page is organized into a grid-based layout:

### 5.1. Header
Displays a greeting, welcoming the user by name (e.g., "مرحباً أحمد 👋" or falling back to "المشرف") alongside a brief page description[cite: 1].

### 5.2. Summary Cards
A 4-column grid displaying key metrics[cite: 1]:
* Total Active Students[cite: 1].
* Published Courses[cite: 1].
* Pending Assistant Tasks[cite: 1].
* Total Monthly Revenue[cite: 1].

### 5.3. Analytics Section
A 3-column split section containing two primary widgets:
* **Revenue Bar Chart (Span: 2/3):** Displays vertical bars representing revenue across the last 6 months[cite: 1]. The height of each bar is dynamically calculated as a percentage relative to `maxRevenue`[cite: 1].
* **Revenue Sources (Span: 1/3):** Breaks down income streams (Paymob vs Scratch cards), rendering horizontal progress bars based on their percentage of `totalRevenueSources`[cite: 1].

### 5.4. Quick Actions
A card containing functional buttons for immediate navigation and tasks[cite: 1]:
* "إدارة الدورات" (Manage Courses): Routes to `/:instructorId/admin/courses`[cite: 1].
* "أكواد الدخول / كروت الشحن" (Access Codes / Scratch Cards): Routes to `/:instructorId/admin/scratch-cards`[cite: 1].
* "الإعدادات" (Settings): Routes to `/:instructorId/admin/settings`[cite: 1].
* "تصدير بيانات الطلاب" (Export Student Data): Triggers the `exportStudentsCsv` function to download a CSV file[cite: 1].

## 6. Reference Material
Matches the provided visual layout in `admin-dashboard.jpeg`, incorporating the 4 top cards, the dual-chart mid-section, and the bottom quick action grid. The layout scales responsively from 1 column on mobile to 4 columns on large screens for summary metrics[cite: 1].