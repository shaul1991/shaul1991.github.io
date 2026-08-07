---
version: alpha
name: Evidence
description: Evidence-first dark portfolio system for clear, credible technical storytelling.
colors:
  canvas: "#090A0D"
  surface: "#111319"
  surface-raised: "#171A22"
  text-primary: "#F4F5F7"
  text-secondary: "#A9AFBD"
  text-muted: "#747C8C"
  primary: "#8B8DFF"
  accent-strong: "#AEB0FF"
  info: "#63B3FF"
  success: "#4FD1A5"
  danger: "#FF7A90"
typography:
  display:
    fontFamily: system-ui
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  heading:
    fontFamily: system-ui
    fontSize: 2rem
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: system-ui
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: ui-monospace
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.canvas}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 24px
  badge:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: 8px
  metadata:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: 8px
  async-info:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.info}"
    rounded: "{rounded.lg}"
    padding: 24px
  async-success:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    rounded: "{rounded.lg}"
    padding: 24px
  async-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    rounded: "{rounded.lg}"
    padding: 24px
---

## Overview

Evidence is a dark, restrained portfolio system for presenting engineering work as a sequence of problems, decisions, and verified outcomes. It borrows Linear's clarity and density discipline without copying its product styling. Content hierarchy and credibility always outrank decoration.

## Colors

Near-black canvas colors reduce glare while keeping surfaces distinct through restrained borders rather than heavy shadows. Violet is the primary interaction color; blue is informational. Accent colors are intentionally scarce so links, focus, and primary actions remain obvious.

All body text and interactive states must meet WCAG AA contrast. `text-muted` is reserved for non-essential metadata and must not carry critical meaning by itself.

## Typography

Use the operating system sans-serif stack for fast loading and a native feel. Display typography is compact and confident; body copy remains relaxed and readable. Monospace is limited to technical labels, dates, code, and compact metadata—not paragraphs.

## Layout

Pages use a readable maximum width, generous section spacing, and simple stack/cluster/grid primitives. Mobile content order is the source of truth. Layout must remain usable without JavaScript at 320px and must not introduce horizontal scrolling.

## Elevation & Depth

Depth comes from surface contrast and one-pixel borders. Avoid glassmorphism, blurred backdrops, glowing gradients, and decorative shadow stacks. Raised surfaces are used only when grouping improves comprehension.

## Shapes

Corners are small and precise. Controls use the medium radius, cards use the large radius, and labels use the small radius. Avoid pill shapes except for short status metadata.

## Components

Buttons, cards, badges, navigation, and evidence blocks share semantic tokens. Components must preserve visible keyboard focus, a minimum 44px interactive target, and reduced-motion behavior. Portfolio-specific pages may override semantic accents but not foundational contrast or spacing contracts.

## Do's and Don'ts

- Do lead with role, outcome, and evidence.
- Do keep one dominant action per section.
- Do use progressive enhancement for API-backed data.
- Do provide loading, empty, error, and stale-data states for async content.
- Don't hide core career content behind JavaScript or API availability.
- Don't expose secrets, private repository data, or privileged API tokens in browser code.
- Don't use animated backgrounds, excessive gradients, skill meters, or icon-card walls.
