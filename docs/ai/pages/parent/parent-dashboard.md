---
title: Parent Dashboard
route: "/:instructorId/parent/dashboard"
auth: parent
description: "Main dashboard for parents to view their child's academic progress, pending assignments, upcoming events, and urgent alerts."
layout: standard (implied sidebar + top navbar)
---

# Parent Dashboard

The `ParentDashboard` serves as the primary landing page for authenticated parent users. It provides a consolidated view of a selected child's performance metrics, upcoming schedule, and important system alerts.

## 1. Overview & Core Features

*   **Child Selection Integration:** Automatically syncs with the `SelectedChildContext` to display data relevant only to the currently active child.
*   **Performance Summary:** Displays high-level metrics including current academic score, pending assignments, and completed lessons.
*   **Upcoming Schedule:** A timeline view of upcoming exams, homework deliveries, and meetings.
*   **Urgent Alerts:** A notification center for critical updates (e.g., low grades, subscription renewals, teacher messages).

## 2. Visual Matching & Design Audit

Based on the reference image `parent-dashboard.jpeg`, the current source code provides the correct logical structure and data binding, but requires significant UI refactoring to match the target design.

### Discrepancies (Code vs. Design):
*   **Header Section:** 
    *   *Design:* Features a large styled card with a dynamic greeting ("مرحباً بك، والد سارة"), subtext with the child's grade, an avatar with a "متفوقة" (Excelling) badge, and a large, stylized gold button for "تحميل التقرير الشهري" (Download Monthly Report).
    *   *Code:* Currently implements a simpler flex layout with the child's name, a generic grade badge, and two standard buttons ("مراسلة المعلم", "عرض تقرير مفصل").
*   **Stat Cards:**
    *   *Design:* Each card contains specific graphical elements: custom icons (chart, calendar, checkmark) and trend indicators (e.g., a green `4% ↑` badge for academic performance).
    *   *Code:* The `StatCard` component only renders raw text (title, value, hint) without icons or styled trend badges.
*   **Lower Layout Grid:**
    *   *Design:* Split into two distinct columns: "تنبيهات عاجلة" (Alerts) takes the primary/wider right column, while "المواعيد القادمة" (Upcoming Events) sits in the narrower left column.
    *   *Code:* Both sections are stacked vertically at full width using standard section containers (`space-y-6`).
*   **Alert Cards:**
    *   *Design:* Highly stylized cards with colored side-borders (red, green, yellow), large distinct icons (warning triangle, info circle, envelope), and left-pointing chevrons acting as action triggers.
    *   *Code:* Renders generic list items utilizing standard UI `Badge` and "عرض" (View) text buttons.
*   **Upcoming Events Timeline:**
    *   *Design:* Includes specific times (e.g., "10:00 صباحاً") and richer subtitles.
    *   *Code:* Generates simple dates using `toLocaleDateString` and basic type mappings ('اختبار' or 'واجب').

## 3. Data Fetching & State

*   **Context:** Consumes `selectedChildId` from `useSelectedChild()`.
*   **Mocks:** Relies on `mockChildren` and `mockReports` from `../../mocks/parentData`.
*   **Derived State:**
    *   `activeChildId`: Falls back to the first child in the mock array if no child is selected.
    *   `child` & `report`: Memoized objects that refresh when `activeChildId` changes.
    *   `upcoming` & `alerts`: Arrays that pull from `report`, or dynamically generate default mock items if the report is empty.

## 4. Component Architecture

*   `StatCard`: A localized functional component for rendering the top metric cards (Academic Performance, Pending Assignments, Completed Lessons).
*   `TimelineItem`: A localized functional component that renders a single row in the "Upcoming Events" section, featuring a dot-and-line timeline graphic.
*   `ParentDashboard`: The main export orchestrating data retrieval and layout rendering.

## 5. Known Issues & Refactoring Notes

The source code includes several `FIX` comments indicating recent corrections that should be maintained or monitored:
*   **Date Calculation Math:** The default fallback dates for upcoming events were previously adding seconds instead of milliseconds to `Date.now()`. This has been corrected (`3 * 24 * 3600 * 1000`).
*   **Button Variants & Sizes:** The design system's `Button` component does not support an `"outline"` variant or `"xs"` size. These have been patched in the code to use `"ghost"` and `"sm"` respectively.
*   **Nested Report Data:** Data mapping for `pendingAssignments` and `completedLessons` was updated to correctly reference `report?.summary?.X` instead of `report?.X`.