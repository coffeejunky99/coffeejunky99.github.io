# AGENTS.md

# Repository Agent Rules

This repository is maintained with AI-assisted development. Follow these
rules unless explicitly instructed otherwise.

## Project Goal

Maintain a premium personal portfolio for **Akira Hata
(CoffeeJunky99)**.

Design principles:

-   Premium
-   Minimal
-   Modern
-   Coffee × Technology
-   Fast
-   Accessible
-   Responsive

------------------------------------------------------------------------

## Documentation

All project documentation belongs in the `instructions/` directory.

Examples:

``` text
instructions/
├── portfolio-redesign.md
├── color-system.md
├── ui-guidelines.md
├── animation-guidelines.md
└── component-rules.md
```

Do not place specification documents in the repository root.

Whenever implementation changes invalidate existing documentation,
update the corresponding document inside `instructions/`.

------------------------------------------------------------------------

## Naming Convention

Use lowercase kebab-case.

Good:

-   portfolio-redesign.md
-   color-system.md
-   hero-section.md

Avoid:

-   Portfolio.md
-   DesignFile.md
-   MyInstruction.md

------------------------------------------------------------------------

## Tech Stack

Keep the project as a static website.

Allowed:

-   HTML
-   CSS
-   Vanilla JavaScript

Do not introduce build tools or frameworks unless explicitly requested.

------------------------------------------------------------------------

## Design Rules

Primary color:

-   Orange (#FF7A00)

Secondary accent:

-   Green (#2ECC71)

Background:

-   #0D0D0D

Keep the overall palette restrained.

Do not create a gaming, cyberpunk, or neon aesthetic.

------------------------------------------------------------------------

## Code Quality

-   Prefer readability over cleverness.
-   Remove dead code.
-   Avoid duplication.
-   Keep CSS organized with variables.
-   Use semantic HTML.
-   Keep JavaScript modular.

------------------------------------------------------------------------

## Accessibility

Always preserve or improve:

-   Keyboard navigation
-   Focus states
-   ARIA attributes
-   Color contrast
-   Responsive layout
-   prefers-reduced-motion support

------------------------------------------------------------------------

## Before Finishing

Verify:

-   No console errors
-   Responsive layout
-   Existing functionality still works
-   Documentation updated if behavior changed

Do not stop at proposing changes. Implement them when asked.
