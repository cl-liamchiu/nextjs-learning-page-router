# Implementation Plan: Tailwind → CSS Modules & Sass Migration

## 1. Summary

- **Objective**: Replace Tailwind CSS utilities with a Sass-based styling system using CSS Modules while preserving existing visuals and responsiveness across the application.
- **Key Outcomes**:
  - Introduce a shared design tokens layer (`src/styles/tokens.scss`) exposing CSS variables and mixins for reuse.
  - Convert all Tailwind-authored components/pages to scoped `.module.scss` files.
  - Add Stylelint with SCSS configuration to enforce the new styling conventions.
  - Remove Tailwind dependencies, PostCSS plugin usage, and utility class strings from the codebase.
- **Scope Sources**: Findings synthesized from `thoughts/shared/research/2025-10-03-tailwind-to-css-modules-transition.md`.

## 2. Goals & Success Metrics

| Goal                           | Metric / Acceptance Criteria                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Tailwind fully removed         | `tailwindcss` & `@tailwindcss/postcss` no longer present in `package.json`/lockfile; no `className` strings with Tailwind utilities remain. |
| Sass-based styling established | Every previously Tailwind-styled component consumes a `.module.scss`; shared styles centralized into `globals.scss` + tokens.               |
| Design tokens available        | `tokens.scss` defines CSS variables/mixins used at least by landing page, markdown flow, and homework suite.                                |
| Stylelint operational          | `npm run lint:styles` (or equivalent) validates SCSS files and is integrated into CI alongside JS lint/test/build commands.                 |
| Visual parity maintained       | Manual regression checklist for key routes signed off; optional screenshot diffs captured for future reference.                             |

## 3. Non-Goals

- Introducing a component library or altering visual design language (colors, typography, spacing) beyond necessary parity fixes.
- Rewriting existing UI logic, accessibility semantics, or canvas behavior.
- Implementing CSS-in-JS or alternative styling paradigms.
- Adding automated visual regression tooling (can be logged as follow-up).

## 4. Stakeholders & Roles

- **Primary Developer**: Responsible for executing migration phases, writing Sass modules, and updating build tooling.
- **Reviewer(s)**: Validate PRs for parity and tooling changes.
- **QA / Product**: Spot-check critical flows (landing, markdown reading, homework exercises, canvas demos).

## 5. Prerequisites & Dependencies

- Confirm Turbopack build pipeline supports Sass without extra configuration; if issues arise, temporarily switch to Next.js webpack build for debugging.
- Align with team on Stylelint ruleset (default SCSS + Prettier recommended) before large-scale conversion.
- Ensure adequate time for manual regression testing; no conflicting feature work should occur on same components during migration window.

## 6. Work Breakdown Structure

### Phase 0 – Tooling Enablement (Branch: `feat/css-modules-migration`)

1. **Install Sass**
   - Add `sass` dev dependency.
   - Validate `.scss` imports compile under Turbopack (`npm run dev`, `npm run build`).
2. **Set up Stylelint**
   - Add dependencies: `stylelint`, `stylelint-config-standard-scss`, `stylelint-config-prettier`, `stylelint-order`, etc.
   - Create `.stylelintrc.cjs` and `.stylelintignore`.
   - Add npm script `lint:styles` and extend CI to run it (optionally `npm run lint:all`).
3. **Convert globals entry**
   - Rename `src/styles/globals.css` → `globals.scss` and update `_app.tsx` import.
   - Remove `@import "tailwindcss";`.
4. **Introduce tokens**
   - Create `src/styles/tokens.scss` with:
     - CSS variables: color palette (light/dark), spacing scale, typography sizes, breakpoints.
     - Sass maps/mixins for flex utilities, button styles, transitions, responsive helpers.
   - Ensure `globals.scss` imports tokens and defines base selectors (`html`, `body`, `.markdown-body`, root variables).
5. **Validation**
   - Run `npm install` (updates lockfile) and `npm run lint`, `npm run lint:styles`, `npm run test`, `npm run build`.
   - Manual smoke test (landing page) to confirm styles still load.

### Phase 1 – Core Layout & Markdown Pages

1. **Landing page (`src/pages/index.tsx`)**
   - Create `index.module.scss` replicating current grid, spacing, responsive, and dark-mode states using tokens/mixins.
   - Replace Tailwind class strings with CSS Module references.
2. **Markdown card & renderer**
   - `src/components/markdown/markdown-card.tsx` → `markdown-card.module.scss` (hover, transitions, dark variants).
   - `MarkdownRenderer` already uses `.markdown-body`; ensure styling is provided via globals.
3. **Dynamic markdown page (`src/pages/[slug].tsx`)**
   - Introduce module for article layout (`markdown-page.module.scss`).
   - Ensure hero header/dark-mode colors come from tokens.
4. **Document adjustments**
   - Remove `className="antialiased"` from `_document.tsx` after adding `-webkit-font-smoothing` globally.
5. **Verification**
   - Automated: lint, stylelint, tests, build.
   - Manual: `/`, `/example` in light/dark modes (toggle OS or `prefers-color-scheme`).

### Phase 2 – Homework Shell Components

1. Create modules for:
   - `HomeworkLayout` (`homework-layout.module.scss`)
   - `HomeworkContent` (handle dynamic child classes via `clsx` if needed)
   - `HomeworkSidebar`
   - `HomeworkDescription`
2. Replace `BASE_CLASSNAMES` strings with module exports combined via `clsx` or array join.
3. Encode responsive behaviors (e.g., `lg:flex-row`, `sm:px-8`) with Sass breakpoints referencing tokens.
4. Validate `/homework` index route manually; ensure navigation highlights still work.
5. Automated checks as usual.

### Phase 3 – Homework Assignments 1 & 2

1. **Homework 1**
   - Create `homework1.module.scss`; migrate form layout, button states, error/success messaging.
   - Ensure radio inputs display correctly across breakpoints.
2. **Homework 2**
   - `homework2.module.scss`; handle button variants, draggable card styling, shadows.
   - Keep drag state consistent (ensure cursor/hover states match).
3. Post-migration validation: run automated checks; manual regression of `/homework/1` and `/homework/2` (input validation, drag-and-drop, add/remove actions).

### Phase 4 – Homework Assignment 3 (Post Board)

1. **Post Board page** (`post-board.module.scss`)
   - Dark theme backgrounds, card hover states, action buttons.
2. **Create Post page** (`create-post.module.scss`)
   - Form layout, file input styling (replace Tailwind `file:` utilities with custom SCSS targeting `::file-selector-button`).
3. **Modal component** (`modal.module.scss`)
   - Overlay positioning, z-index, button styles; ensure scroll locking behavior unaffected.
4. Manual regression: `/homework/3/index`, `/homework/3/post-board`, and `/homework/3/create-post` (edit flows, modals, file uploads).
5. Automated checks.

### Phase 5 – Homework Assignments 4 & 5 (Canvas Demos)

1. **Canvas Image Editor**
   - `canvas-image-editor.module.scss`; migrate button variants, hidden input styling, layout.
   - Optionally move inline `style` background into module while preserving dynamic canvas sizing logic.
2. **Image Zoom Demo**
   - `image-zoom-demo.module.scss`; same approach for buttons, instructions, hidden file input, canvas container.
3. Manual regression: ensure upload, rotate, blur, zoom interactions behave and styles intact.
4. Automated checks.

### Phase 6 – Tailwind Removal & Cleanup

1. Repository-wide search for Tailwind class strings; replace any stragglers (e.g., `dark:` modifiers, arbitrary values).
2. Remove Tailwind dependencies from `package.json`/`package-lock.json`; uninstall with `npm install`.
3. Update `postcss.config.mjs` to remove `@tailwindcss/postcss` plugin (if unused elsewhere).
4. Delete any leftover Tailwind config artifacts (none in repo currently) and clean README references.
5. Final validation pipeline: `npm run lint`, `npm run lint:styles`, `npm run test`, `npm run build`.
6. Manual smoke test checklist (landing, markdown, homework 1–5, canvas demos, dark mode).

## 7. Testing Strategy

- **Automated**: Run lint, stylelint, unit tests, and build after each phase. Consider adding unit snapshot tests for key components if regressions surface.
- **Manual**: Maintain a regression checklist covering:
  - Landing page hero & markdown list
  - Markdown article page (light/dark)
  - Homework landing/sidebar
  - Homework 1–5 flows (forms, drag-and-drop, modals, canvas interactions)
  - Mobile viewport spot checks via responsive dev tools.
- **Optional Future Work**: Introduce visual regression tooling (Percy/Chromatic) once Sass migration stabilizes.

## 8. Rollout & Deployment Plan

1. Keep work on feature branch with phased PRs (Phases 0–6) to ease review and reduce merge conflicts.
2. After each PR merges, run `npm run build` in CI to ensure production readiness.
3. Coordinate final merge with stakeholders; deploy during low-traffic window.
4. Post-deployment monitoring: analytics dashboards, user bug reports, and style lint logs.
5. Document new styling conventions in `README.md` or `CONTRIBUTING.md` (follow-up task).

## 9. Timeline (High-Level Estimate)

| Phase                      | Effort (person-days)                            |
| -------------------------- | ----------------------------------------------- |
| 0 – Tooling Enablement     | 1                                               |
| 1 – Core Layout & Markdown | 1.5                                             |
| 2 – Homework Shell         | 1                                               |
| 3 – Homework 1 & 2         | 1.5                                             |
| 4 – Homework 3             | 2                                               |
| 5 – Homework 4 & 5         | 1.5                                             |
| 6 – Cleanup & Final QA     | 1                                               |
| **Total**                  | **9.5 days** (adjust with buffer for QA/review) |

## 10. Risks & Mitigations

| Risk                                            | Probability | Impact | Mitigation                                                                                    |
| ----------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------------------------- |
| Missed Tailwind class causing visual regression | Medium      | High   | Exhaustive grep before cleanup; manual regression checklist; leverage tokens for consistency. |
| Sass build issues with Turbopack                | Low         | Medium | Validate in Phase 0; temporarily toggle `next build` to webpack if debugging required.        |
| Stylelint friction (false positives)            | Medium      | Medium | Calibrate config with team early; add overrides for legacy patterns when necessary.           |
| Dark mode parity drift                          | Medium      | High   | Centralize dark variants via CSS variables; test each page in dark mode before sign-off.      |
| Large diffs hinder PR review                    | Medium      | Medium | Submit phased PRs, include before/after screenshots where feasible.                           |

## 11. Open Questions / Follow-Ups

- Should we document a naming convention (e.g., BEM vs. descriptive) for Sass classes/modules? (Recommend discuss during Phase 0.)
- Do we want to export TypeScript helpers for tokens (e.g., enum of classnames) for future components?
- After migration, should we add automated visual regression tooling? Track as separate ticket.

## 12. Approval & Next Steps

- Share plan with stakeholders for sign-off.
- Upon approval, proceed with Phase 0 tasks on feature branch `feat/css-modules-migration`.
- Maintain progress log in `thoughts/shared/plans/` or project management tool, updating status per phase.
