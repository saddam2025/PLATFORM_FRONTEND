# docs/ai/pages/assistant/parent-messages-inbox.md

## Page Overview
**Path:** `src/pages/assistant/ParentMessagesInboxPage.jsx`
**Route:** `/:instructorId/assistant/messages`
**Status:** Visual reference provided (`parent-activity_2.png`).

## Purpose
Provides the assistant/admin interface for handling technical support and platform monitoring inquiries from parents. 

## Backend Context
*(To be implemented - requires new messaging service models and routes)*

## Visual References & Image Analysis
- **Reference File:** `parent-activity_2.png`
- **Layout:** Two main columns alongside the standard right-aligned green sidebar. 
- **Left Column (Chat):** A direct messaging interface with a header (showing parent status). Chat bubbles utilize yellow for incoming parent messages and gray/off-white for assistant replies. Includes an input field with attachment and send icons.
- **Right Column (Assistant Notes):** A stack of cleanly bordered cards displaying notes from other assistants regarding student performance (e.g., homework reviews, exam scores). 
- **Typography & Colors:** High utilization of the off-white background, subtle card borders, and elegant Arabic typography for high readability.

## Design Intent & Patterns
- **Components:** Construct reusable `ChatBubble` and `MessageInput` components that strictly adhere to the border-radius and color hexes in the reference image.
- **Cards:** The assistant notes on the right must use the exact minimalist card pattern (subtle shadow, clean structural proportions) standard across the platform.