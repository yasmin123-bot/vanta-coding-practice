# VANTA — Coding Practice for Beginners

VANTA Learning System v1 includes a bilingual landing page and an available HTML Fundamentals path with five beginner lessons. Lessons use guided explanations, read-only code examples, and interactive four-option quizzes with retry feedback. Completion is temporary for the current browser session; quiz scores and personal learning profiles are not stored permanently.

The CSS and JavaScript paths are still planned. This release does not include accounts, backend persistence, code execution, AI assistance, or competitions; broader project features remain part of the product roadmap.

## Run locally

```sh
npm install
npm run dev
```

## Verify a production build

```sh
npm run typecheck
npm run build
npm run preview
```

## Structure

- `src/App.tsx` — bilingual landing page and route selection for learning paths and lessons.
- `src/components/StartLesson.tsx` — the first HTML lesson and its guided quiz.
- `src/components/LearningLesson.tsx` — reusable view for the remaining HTML lessons.
- `src/components/LearningSystemPage.tsx` — path catalog and path outline pages.
- `src/content/learningSystem.ts` — route catalog and availability status for learning paths.
- `src/content/initialHtmlExercise.ts` — original HTML exercise content preserved and reused as lesson material; code is displayed for learning and is not executed.
- `src/i18n/` — Arabic and English landing, path, lesson, and quiz copy.
- `src/state/sessionProgress.ts` — session-only lesson completion state.
- `src/utils/quizChoices.ts` — validated randomized option order shared by quizzes.
- `src/styles/` — VANTA tokens, responsive presentation, and reduced-motion rules.
- `public/brand/` — existing VANTA logo assets; the mark is preserved, not redesigned.
- `brand-spec.md` — asset provenance and design tokens.

Arabic is the default locale and uses RTL; English uses LTR. The language switch updates page copy, document direction, `lang`, title, and description. The selected locale is remembered locally when browser storage is available.
