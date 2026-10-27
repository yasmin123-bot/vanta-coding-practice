# VANTA — Coding Practice for Beginners

The current milestone establishes the frontend foundation and bilingual landing page. It intentionally does not implement accounts, backend persistence, code execution, AI assistance, projects, or competitions.

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

- `src/App.tsx` — landing page and working locale/menu interactions.
- `src/i18n/messages.ts` — Arabic and English copy for one shared UI.
- `src/content/initialHtmlExercise.ts` — useful lesson/challenge content preserved from the original prototype for a later learning feature; it does not execute code.
- `src/styles/` — VANTA tokens and responsive presentation styles.
- `public/brand/vanta-logo.png` — logo/wordmark crop from the supplied identity reference; not redrawn.
- `brand-spec.md` — asset provenance and design tokens.

Arabic is the default locale and uses RTL. The language switch changes page copy, document direction, `lang`, title, and description. The selected locale is remembered locally when browser storage is available.
