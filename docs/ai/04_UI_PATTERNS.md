# UI PATTERNS
Version: 1.0

## Purpose

This document defines the approved visual and structural patterns for the Riyadiaty educational platform.

The goal is to ensure that different pages are designed as parts of one product instead of independent AI-generated interfaces.

These patterns are guidelines for composition and hierarchy.

They do NOT replace existing React components.

Always reuse existing components whenever possible.

---

# 1. General Page Structure

Standard application pages should follow this hierarchy:

1. Page shell
2. Page header
3. Primary content
4. Secondary content
5. Supporting information
6. Secondary actions

Avoid filling every available area with content.

Whitespace is part of the design.

---

# 2. Page Header

A standard page header should contain:

- Page title
- Short description when useful
- Primary action when required

Example structure:

```text
Page Title
Supporting description

                         Primary Action