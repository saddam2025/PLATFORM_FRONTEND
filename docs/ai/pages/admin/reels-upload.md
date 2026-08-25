# docs/ai/pages/admin/reels-upload.md

## Page Overview
**Path:** `src/pages/admin/ReelsUploadPage.jsx`
**Route:** `/:instructorId/reels/upload`
**Status:** Visual reference provided (`reels-upload.jpeg`).

## Purpose
Interface for instructors to upload and manage short-form educational video content (Reels). 

## Backend Context
- `POST /instructors/:instructorId/reels`

## Visual References & Image Analysis
- **Reference File:** `reels-upload.jpeg`
- **Layout:** Two main sections over an off-white background. The right side features a minimalist upload widget; the left displays a grid of previously uploaded Reels.
- **Upload Component:** A dashed-border drag-and-drop zone with a clean, structural icon, descriptive text inputs, and a stage-selection dropdown.
- **Cards:** Vertical video cards with rounded corners, displaying a thumbnail, view count badge in the top right, and bold, elegant Arabic typography for the title at the bottom.
- **Navigation:** The standard green admin sidebar is persistent on the right (RTL layout).
- **Buttons:** Primary yellow action buttons with rounded borders.

## Design Intent & Patterns
Implement exact spacing, border-radius, and shadow tokens observed in `reels-upload.jpeg`. The drag-and-drop zone should utilize the existing file-upload micro-interactions. Ensure the video cards reuse the global card shadow and hover elevation tokens.# docs/ai/pages/admin/reels-upload.md

## Page Overview
**Path:** `src/pages/admin/ReelsUploadPage.jsx`
**Route:** `/:instructorId/reels/upload`
**Status:** Visual reference provided (`reels-upload.jpeg`).

## Purpose
Interface for instructors to upload and manage short-form educational video content (Reels). 

## Backend Context
- `POST /instructors/:instructorId/reels`

## Visual References & Image Analysis
- **Reference File:** `reels-upload.jpeg`
- **Layout:** Two main sections over an off-white background. The right side features a minimalist upload widget; the left displays a grid of previously uploaded Reels.
- **Upload Component:** A dashed-border drag-and-drop zone with a clean, structural icon, descriptive text inputs, and a stage-selection dropdown.
- **Cards:** Vertical video cards with rounded corners, displaying a thumbnail, view count badge in the top right, and bold, elegant Arabic typography for the title at the bottom.
- **Navigation:** The standard green admin sidebar is persistent on the right (RTL layout).
- **Buttons:** Primary yellow action buttons with rounded borders.

## Design Intent & Patterns
Implement exact spacing, border-radius, and shadow tokens observed in `reels-upload.jpeg`. The drag-and-drop zone should utilize the existing file-upload micro-interactions. Ensure the video cards reuse the global card shadow and hover elevation tokens.