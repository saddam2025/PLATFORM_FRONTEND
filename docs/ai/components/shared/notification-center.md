# docs/ai/components/shared/notification-center.md

## Component Overview
**Path:** `src/pages/shared/NotificationCenter.jsx`
**Status:** Visual reference provided (`notification-center.jpeg`).

## Purpose
A role-agnostic notification dropdown (used by Students, Parents, Assistants, and Admins) to display system alerts, new content, and messages.

## Backend Context
- `GET /notifications`
- `GET /notifications/unread-count`
- `PATCH /notifications/:id/read`

## Visual References & Image Analysis
- **Reference File:** `notification-center.jpeg`
- **Layout:** A floating popover/dropdown originating from a bell icon in the top header. 
- **List Items:** Each notification row features a circular icon with a colored background (e.g., yellow for new videos), elegant Arabic title text, secondary descriptive text, and a minimal relative timestamp on the left. Unread items have a distinct indicator (e.g., a yellow dot).
- **Footer:** A centralized text link to "View all notifications".

## Design Intent & Patterns
- **Popover:** Reuse the platform's existing dropdown menu shadow and border-radius tokens. 
- **Icons:** Standardize the icon wrappers to maintain clean structural proportions.
- **Theme:** Ensure the popover background is pure white or the designated off-white, maintaining high contrast with the text.