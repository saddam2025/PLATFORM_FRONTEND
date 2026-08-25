# PATCH MODE
Version: 1.0

## Mission

You are NOT redesigning the application.

You are NOT rebuilding the page.

You are working inside an existing enterprise React application.

Your mission is to improve the requested UI while preserving everything else.

---

# Golden Rule

If you can achieve the requested result by editing 20 lines,

DO NOT edit 200.

If you can edit one component,

DO NOT rewrite the page.

---

# Never Do These

❌ Rewrite the whole JSX.

❌ Rewrite the page structure.

❌ Rewrite Layouts.

❌ Rename Components.

❌ Rename Files.

❌ Change Routes.

❌ Change Business Logic.

❌ Change API Calls.

❌ Change Context Providers.

❌ Change Authentication.

❌ Change Database Models.

❌ Change Folder Structure.

❌ Move Components without request.

❌ Replace existing reusable components.

---

# Always Do These

✅ Read the entire file first.

✅ Identify the smallest possible change.

✅ Reuse existing components.

✅ Reuse existing Tailwind classes.

✅ Reuse existing Design Tokens.

✅ Preserve responsive behavior.

✅ Preserve RTL.

✅ Preserve accessibility.

---

# File Modification Policy

Maximum file changes:

One file if possible.

Two files only if necessary.

Three files only when explicitly required.

Avoid touching unrelated files.

---

# Component Policy

Before creating any JSX:

Check if a component already exists.

Button

Input

Badge

Avatar

CourseCard

Navbar

Sidebar

Layout

If it exists,

reuse it.

---

# Styling Policy

Never hardcode:

Colors

Spacing

Radius

Shadows

Typography

Always use:

Tailwind utilities

Existing CSS variables

Existing Tokens

Existing Components

---

# Layout Policy

Do not change:

Grid structure

Container widths

Sidebar behavior

Navbar behavior

Responsive breakpoints

Unless explicitly requested.

---

# Responsive Policy

Desktop must never break.

Tablet must remain usable.

Mobile must remain functional.

Never introduce horizontal scrolling.

---

# Performance Policy

Do not create unnecessary rerenders.

Do not introduce unnecessary state.

Do not duplicate data.

Prefer memoization only if already used.

---

# Animation Policy

Never add decorative animation.

Animations must improve usability only.

Maximum duration:

300ms

Prefer:

opacity

scale

translate

Avoid:

bounce

spin

flash

---

# Output Policy

When finished, provide:

1. What changed.

2. Why it changed.

3. Which files changed.

4. Which components were reused.

5. Any assumptions.

Never explain unrelated code.

Never refactor without permission.

---

# Final Checklist

Before generating code ask yourself:

Did I preserve architecture?

Did I preserve routing?

Did I preserve business logic?

Did I preserve RTL?

Did I reuse components?

Did I avoid unnecessary rewrites?

If any answer is NO,

stop and revise the solution.