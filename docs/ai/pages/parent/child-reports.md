---
title: Child Reports Page
route: "/:instructorId/parent/reports"
auth: parent
description: "A detailed reporting interface allowing parents to view their child's grades, attendance, assignment status, and lecture progress."
layout: standard (implied sidebar + top navbar)
---

# Child Reports Page

The `ChildReportsPage` provides a comprehensive view of a student's academic performance, split across multiple functional tabs. It integrates with the parent dashboard ecosystem by filtering data based on the currently selected child.

## 1. Overview & Core Features

*   **Global Context Integration:** Utilizes `useSelectedChild()` to automatically display the active child's avatar, name, grade, and related academic data.
*   **Tabbed Navigation:** Separates complex reporting data into four focused views: **الدرجات** (Grades), **الحضور** (Attendance), **الواجبات** (Assignments), and **تقدم المحاضرات** (Lecture Progress).
*   **Dynamic Data Rendering:** Uses fallback mock data to populate tables and progress bars, formatting dates and dynamically applying color classes based on numerical performance (e.g., green for ≥ 85, red for < 60).

## 2. Visual Matching & Design Audit

There are substantial layout, structural, and content discrepancies between the provided source code and the `child-reports.jpeg` design reference. The current code acts as a functional prototype, whereas the design depicts a highly stylized dashboard.

### Header Discrepancies
*   **Layout:** The code aligns the child's profile info to the right and action buttons to the left. The design centers the child's avatar, name, and grade badge, placing the action buttons on the far left.
*   **Action Buttons:** The code features "تصدير تقرير" (Export Report) and "طلب اجتماع" (Request Meeting). The design features "طباعة" (Print) and "تصدير PDF" (Export PDF).

### Tabs Menu
*   **Alignment:** The code renders the tabs in a standard flex row (right-aligned via RTL). The design centers the tab text links symmetrically below the header profile.

### Grades Tab (Active View in Design) Discrepancies
*   **Structure:** The code renders a single, full-width basic HTML `<table>` for grades. The design features a multi-column dashboard layout:
    *   **Main Column (Exams List):** A styled list of "سجل الاختبارات الأخيرة" (Recent Exams Log) featuring distinct icons, fractional scores (e.g., `95/100`), stacked dates, and qualitative status badges with trend arrows (e.g., "ممتازة ↗", "تحتاج تحسين ↘").
    *   **Side Column (Performance Summary):** A distinct card titled "ملخص الأداء" (Performance Summary) showing a large average score and an overall progress bar at the bottom.
    *   **Bottom Row (Teacher Note):** A full-width, yellow-tinted card containing a lightbulb icon and personalized teacher feedback ("ملاحظة المعلم").
*   **Missing Features:** The code currently lacks the Performance Summary card, the Teacher Note card, and the qualitative trend badges shown in the design.

## 3. Data Fetching & State

*   **Context:** `useSelectedChild()` retrieves the `selectedChildId`.
*   **Mock Sources:** Pulls from `mockChildren`, `mockReports`, and `mockActivities` located in `../../mocks/parentData`. 
*   **Local State:** 
    *   `activeTab`: Tracks the currently visible tab section (defaults to `'grades'`).
*   **Inline Fallbacks:** Due to missing structures in the global mock file, the `AssignmentsTab` component defines its own localized mock object (`assignmentsByChild`) to ensure the tab renders content.

## 4. Component Architecture

The page is broken down into modular functional components for each tab, keeping the main export clean:
*   `GradesTab`: Renders the exam/subject grades history.
*   `AttendanceTab`: Generates a rolling 6-day mock attendance record.
*   `AssignmentsTab`: Renders a table of homework tasks and their grading status.
*   `LectureProgressTab`: Renders a list of enrolled courses with visual horizontal progress bars.
*   `ChildReportsPage`: The parent orchestrator managing layout, context retrieval, and tab switching.

## 5. Known Issues & Refactoring Notes

The source code contains several inline `FIX` comments highlighting architectural adjustments that should be maintained or addressed during refactoring:
*   **Missing Mock Data:** `mockReports[childId].assignments` did not exist in `parentData.js`. A localized inline array was added so the tab functions.
*   **Key Property Names:** The mock course objects utilize `progressPercent` (not `progress`), and the child object utilizes `grade` (not `class`).
*   **UI Component Constraints:** 
    *   The `Button` component does not support an `'outline'` variant; it was updated to `'ghost'`.
    *   The `Badge` component does not support a `'warning'` variant; pending assignments were updated to use the `'neutral'` variant.