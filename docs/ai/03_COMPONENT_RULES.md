# COMPONENT RULES
Version: 1.0

---

# Mission

Every interface in this project must be built by composing existing components.

Consistency is more important than creativity.

Never invent a new visual style if an existing component can be reused.

---

# General Rules

Always search for an existing component before creating a new one.

Never duplicate JSX that already exists.

Never duplicate Tailwind classes across pages.

Extract reusable UI only when repeated 3+ times.

---

# Button

Source

src/components/ui/Button.jsx

Always use this component.

Never use:

<button className="...">

unless semantic HTML absolutely requires it.

Allowed Variants

Primary

Secondary

Outline

Ghost

Danger

Allowed Sizes

sm

md

lg

xl

Buttons must keep consistent:

Height

Radius

Font

Spacing

Hover

Focus

Disabled State

---

# Input

Source

src/components/ui/Input.jsx

Always use Input.

Never create custom input styling.

Validation UI must remain consistent.

---

# Badge

Source

src/components/ui/Badge.jsx

Badges communicate status only.

Never use badges as buttons.

Never invent badge colors.

---

# Avatar

Source

src/components/ui/Avatar.jsx

Always use Avatar.

Never recreate circular profile images.

Always preserve fallback state.

---

# Theme Toggle

Reuse ThemeToggle.

Never recreate theme switching.

---

# Course Card

Source

src/components/common/CourseCard.jsx

Course cards must always use the shared component.

Do not redesign CourseCard inside pages.

Only extend it if necessary.

---

# Navbar

Reuse Navbar.

Never rebuild navigation.

Only modify when requested.

---

# Sidebar

Sidebar is shared.

Never create page-specific sidebars.

Do not change navigation behavior.

---

# Layouts

Always reuse existing layouts.

Student pages use Student Layout.

Parent pages use Parent Layout.

Admin pages use Admin Layout.

Never duplicate layouts.

---

# Icons

Use Lucide icons only.

Allowed sizes

18

20

24

32

Icons must align perfectly with text.

---

# Cards

Cards should follow one visual language.

Large radius.

Soft shadow.

Generous padding.

Consistent spacing.

Do not create card variants unless needed.

---

# Forms

Always compose forms from:

Input

Button

Badge

Avatar

Never mix raw HTML styles with shared components.

---

# Reusability Rule

Before creating any component ask:

Does a similar component already exist?

Can it be extended?

Can props solve the problem?

If YES,

reuse it.

---

# Forbidden

❌ Duplicate Button styles

❌ Duplicate Input styles

❌ Duplicate Avatar styles

❌ Duplicate Card styles

❌ Duplicate Navbar

❌ Duplicate Sidebar

❌ Duplicate Layout

Consistency always wins over originality.