# Parent Activity Page — UI Reference

## Source Page

`src/pages/parent/ParentActivityPage.jsx`

## Backend / Feature Context

The `ParentActivityPage` is a communications hub for parents, served on the route `/:instructorId/parent/activity` and protected under the `parent` auth role[cite: 16]. It combines three key interaction streams: assistant notes/feedback, administrative support messaging, and a student activity log[cite: 16]. Currently, the page relies on local state for active messaging and static/mock data for assistant comments (`taFeedback`) and student activities (`mockActivities`) tied to the active child retrieved via `useSelectedChild`[cite: 16].

## Reference Image

`parent-activity.png`

## Purpose

This page allows parents to read qualitative feedback from teaching assistants regarding their child's coursework, chat directly with administrative/technical support staff, and monitor recent student activities on the platform[cite: 16].

## Current Structure

The page is vertically organized into three distinct sections[cite: 16]:
1. **Assistant Notes (ملاحظات المساعدين):** A section listing cards with TA comments, TA avatars, relative dates, and subject references[cite: 16].
2. **Administrative Support (الدعم الإداري):** An interactive chat panel containing a scrollable message list, message timestamping, an auto-scroll ref hook, an text input field, and a send button[cite: 16].
3. **Recent Activity (النشاط الأخير):** A vertical timeline showing recent actions recorded for the selected child[cite: 16].

## Visual Direction

There are significant layout and visual differences between the current code implementation and the `parent-activity.png` reference image:
* **Layout Structure:**
  * *Design:* Features a two-column layout. The left side contains a wide chat interface for "الدعم الإداري والتقني", while the right side contains "ملاحظات المساعدين".
  * *Code:* Currently stacked in a single vertical column (Assistant Notes $\rightarrow$ Admin Support Chat $\rightarrow$ Recent Activity)[cite: 16].
* **Missing/Extra Sections:**
  * The "النشاط الأخير" (Recent Activity) timeline section exists in the code[cite: 16], but is completely absent from the reference design.
* **Support Chat UI:**
  * *Design:* Modern messenger interface. Includes an header with "الدعم الإداري والتقني", an "online" status indicator ("متصل الآن"), date dividers ("اليوم"), color-coded speech bubbles (yellow for parent, light grey for support), an attachment clip icon, and a pill-shaped input box with a yellow circular send button containing a paper plane icon.
  * *Code:* Standard rectangular card with a basic white inner box, simple input field, and a generic text button ("إرسال")[cite: 16].
* **Assistant Notes Cards:**
  * *Design:* Each card features a top-aligned subject tag (e.g., "رياضيات متقدمة", "الهندسة الفراغية"), assistant avatar, relative timestamp ("منذ ساعتين"), and comment body in a white rounded container.
  * *Code:* Renders TA name, date, comment, and a text string reading "متعلق بـ: ..."[cite: 16].

## Layout

* **Container:** Full-width block with `space-y-6` spacing[cite: 16].
* **Cards:** Each section is wrapped in a `rounded-2xl bg-surface-default shadow-card p-4` container[cite: 16].
* **Chat Container:** Boxed container with a max-height of 320px and overflow auto-scrolling[cite: 16].

## Typography

* **Section Headers:** `text-lg font-semibold`[cite: 16].
* **Item Titles / Names:** `font-medium text-ink-900`[cite: 16].
* **Timestamps / Metadata:** `text-xs text-ink-500`[cite: 16].
* **Body / Comments:** `text-sm text-ink-700`[cite: 16].

## Components

* `Avatar`: `../../components/ui/Avatar`[cite: 16]
* `Button`: `../../components/ui/Button`[cite: 16]
* `Input`: `../../components/ui/Input`[cite: 16]

## Actions

* **Send Chat Message:** Triggers `sendMessage()` on button click or `Enter` keypress, appending the text to local `messages` state and resetting `inputValue`[cite: 16].
* **Child Context Lookup:** Retrieves active child ID via `useSelectedChild()` or defaults to the first child in `mockChildren`[cite: 16].

## States

* **Empty Chat:** Renders "لا توجد رسائل بعد" if `messages` array is empty[cite: 16].
* **Empty Activity Log:** Renders "لا توجد أنشطة حديثة" if no activity records exist for the active child[cite: 16].
* **Auto-Scroll Chat:** `messagesRef` automatically scrolls to the bottom when new messages are added[cite: 16].

## Responsive Behavior

* Current code uses full-width stacked sections. The target design requires a two-column grid (`lg:grid-cols-2` or asymmetrical grid) on desktop viewports.

## RTL

* Explicitly enforced via `dir="rtl"` on the parent wrapper[cite: 16]. Chat alignment correctly mirrors user messages (`ml-auto text-right` for parent, `mr-auto text-left` for admin)[cite: 16].

## Data / Business Logic Constraints

* `mockActivities` is an object keyed by `childId` (`mockActivities[activeChildId]`)[cite: 16].
* Active child fallback ensures the page does not crash if `selectedChildId` is initialised as `null`[cite: 16].

## Do Not Change

* Retain `useSelectedChild` integration for dynamic child filtering[cite: 16].
* Maintain the `Enter` keypress handler logic for sending messages[cite: 16].

## AI Implementation Rules

* Refactor page layout into a 2-column grid to match `parent-activity.png` (Chat on left, Assistant Notes on right).
* Restructure the chat UI:
  * Add header status badge ("متصل الآن"), option menu icon, date badge ("اليوم"), and styled speech bubbles.
  * Style the chat input bar as a pill with attachment clip button and circular icon button for sending.
* Restructure Assistant Notes cards to display subject tags at the top and match the rounded card design.
* Evaluate whether to remove or relocate the "النشاط الأخير" (Recent Activity) section based on design system guidelines, as it is absent from the target mockup.