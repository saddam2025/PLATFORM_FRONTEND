# docs/ai/pages/student/reels-viewer.md

## Page Overview
**Path:** `src/pages/student/ReelsViewerPage.jsx`
**Route:** `/:instructorId/reels`
**Status:** Source file currently contains no implementation. No dedicated reference image.

## Purpose
A subscription-gated viewer for students to consume educational Reels. It must remain focused on education and integrate with the existing course player experience.

## Backend Context
- `GET /instructors/:instructorId/reels`

## Visual References
1. `src/pages/student/CoursePlayerPage.jsx` (for video container sizing and playback controls)
2. `src/components/ui/Badge.jsx` (for subject/stage categorization)
3. `src/components/layout/StudentLayout.jsx` (for the overarching shell)

## Design Intent & Patterns
- **Layout:** Full-height or centered vertical video player, maintaining the off-white minimalist theme. 
- **Video Controls:** Inherit styling from the main course video player (scrubber, play/pause, volume).
- **Lock States:** If a Reel belongs to a locked subscription month, apply the existing blurred or padlocked overlay pattern used in course modules.
- **Typography:** Titles and descriptions must use the platform's designated elegant Arabic typography.