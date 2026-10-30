# Mabda — مبدأ · by VANTA

Mabda is the beginner coding-learning product developed by the VANTA team. The existing repository and persistence identifiers keep their VANTA names for compatibility; this is not a new application or a new database tenant. VANTA's team logo assets are preserved, not redesigned.

The bilingual product includes a learning Home, path catalog, and three active foundation paths: HTML (5 lessons), CSS (8 lessons), and JavaScript (9 lessons). Each lesson offers explanations, examples, an unsolved Practice Studio exercise, and a four-option quiz with stable randomized options, feedback, retries, and first-attempt scoring. Programming fundamentals beyond these foundations, problem-solving, challenges, projects, AI assistance, and competitions remain planned unless explicitly identified as current functionality.

Practice Studio uses CodeMirror for HTML, CSS, and JavaScript. It provides static diagnostics with locations and suggestions, an isolated iframe preview, runtime JavaScript feedback, stale-preview status, and a separate exercise checklist. Running code or passing the checklist does not complete a lesson or change a quiz result. Reset restores the unsolved starter locally; it does not overwrite a cloud draft. Signed-in learners can explicitly save and restore their account-owned draft. Guests are told their draft is not cloud-saved. This is educational iframe isolation, not an absolute security guarantee or a full VS Code implementation.

Real Supabase email/password authentication, confirmation/recovery callbacks, dashboard/profile UI guards, and account-owned progress are integrated. RLS is the database authorization boundary; UI route guards are not a substitute for it. Quiz results are client-submitted learning summaries, not server-verified awards or credentials. A live authenticated sign-up/login/recovery/persistence test still requires a usable, confirmed test-account session; build success or guest tests cannot establish it.

## Run locally

```sh
npm ci
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY locally
npm run dev
```

Without Supabase configuration the public content remains available, while account pages explain the missing setup. Never place database passwords, service-role keys, or secret keys in Vite variables. Only browser-safe URL and publishable-key values belong in `VITE_` configuration. `.env.local` is ignored.

The existing migrations and hosted project are the source of truth. Verify the target and migration history before applying to another project; do not reset student data. Brand integration does not require changing Supabase/Auth/RLS settings.

## Verify

```sh
npm run typecheck
npm test
npm run build
git diff --check
npm run preview
```

Unit/contract tests cover locale parity, quiz identity and ordering, progress derivation, safe return paths, unsolved starters, validators, diagnostics locations, and preview document boundaries. They do not prove RLS isolation or authenticated persistence. Browser acceptance evidence and the remaining-work roadmap are documented separately. Vite currently warns about chunks above 500 KB; route/content and parser chunking remain performance work, not a suppressed warning.

Optional browser acceptance uses Python Playwright, installed Chromium, and Node >=22.15. Start a build preview first, then run:

```sh
BASE_URL=http://127.0.0.1:5175 EVIDENCE_DIR=/tmp/mabda-browser-acceptance python3 tests/browser_acceptance.py
BASE_URL=http://127.0.0.1:5175 EVIDENCE_DIR=/tmp/mabda-auth-intro-acceptance python3 tests/auth_intro_acceptance.py
BASE_URL=http://127.0.0.1:5175 EVIDENCE_DIR=/tmp/mabda-app-shell-acceptance python3 tests/app_shell_acceptance.py
```

Pass `THEME=dark` to the main acceptance harness to exercise the same flow in Dark mode. Additional focused checks use the same `BASE_URL` / `EVIDENCE_DIR` settings:

```sh
python3 tests/theme_ui_acceptance.py
python3 tests/theme_practice_acceptance.py
```

The UI matrix covers 320/390/768/1440px, both themes/locales, header assets, focus, reduced motion, and stored preference. The App Shell matrix additionally covers 1024px, drawer focus trapping/Escape/outside click, existing route destinations, real Practice Studio access, and Home content/statuses. The Auth/Intro matrix checks first-visit gating, return-path preservation, form fields/validation, visibility controls, SPA switching, callback bypass, contrast, RTL/LTR, and overflow. It does not submit credentials or mutate Supabase. The practice checks prove that plain text still renders but fails required-tag checks, and that theme switching preserves editor/quiz state. They never submit an auth form or write a cloud draft.

Set `CHROMIUM_PATH` if the installed browser is not `/usr/bin/chromium`. The harness reads content fixtures through Node's built-in type stripping (currently marked experimental), tests guest routes, mobile/desktop, quiz/retry/scoring, language switching and focus, and writes screenshots/results outside the repository. It does not create accounts, submit authentication forms, or write student data. Live account persistence and RLS isolation need a separate authorized authenticated test.

## Structure

| Area | Responsibility |
|---|---|
| `src/App.tsx`, `src/content/learningSystem.ts` | Existing route resolution, product Home, language, activity tracking |
| `src/brand/`, `src/components/BrandLogo.tsx` | Mabda identity contract and actual approved Raster logo display |
| `src/styles/tokens.css`, `src/styles/mabda.css`, `src/styles/app-shell.css` | Semantic palette, typography, shared product composition and App Shell |
| `src/auth/`, `src/state/`, `src/services/` | Existing Auth, account-bound progress, profile, and draft services |
| `src/components/StartLesson.tsx`, `LearningLesson.tsx` | HTML lessons and independent quiz flow |
| `PracticeStudio.tsx`, `PracticeCodeEditor.tsx`, `src/utils/practice*` | Editor, diagnostics, iframe preview, checklist, draft UI |
| `src/content/initialHtmlExercise.ts` | Preserved original HTML teaching content, still reused |
| `src/i18n/` | Arabic/English parity, account and learning copy |
| `supabase/migrations/`, `src/lib/database.types.ts` | Existing reviewed schema and browser types |
| `public/manus-routes.json` | Static page-route manifest matching current route catalog |
| `public/brand/mabda/` | Approved source images and documented pixel crops; no traced SVG |
| `tests/` | Reproducible local contract tests |

Arabic is default (RTL); English is LTR. Code always stays LTR. Light is the default theme; the App Shell menu control switches the entire app to Dark and saves the manual choice under `mabda-theme`. A central ThemeProvider and early HTML bootstrap restore it without overriding it with OS preferences. If browser storage is blocked, switching still works in memory for that page. The existing `vanta-locale` storage key is deliberately preserved. The first Auth visit shows Intro before Login/Sign Up/Forgot Password; Next stores `mabda-has-seen-intro` in browser storage, and callback/reset routes bypass onboarding. To replay it during development, clear that key from localStorage (or sessionStorage fallback) and reload `/login`; there is no user-facing reset button. Existing drafts containing `Welcome to VANTA.` remain valid in the first exercise alongside the new `Welcome to Mabda.` copy; drafts are never rewritten automatically.

See [Mabda brand integration notes](docs/mabda-brand-spec.md) for source provenance and review limits, [future roadmap proposals](docs/mabda-roadmap.md) for seven possible follow-up areas beyond the active HTML/CSS/JavaScript foundations, and [account/progress setup](docs/supabase-account-progress.md) for current technical integration guidance. The root `brand-spec.md` remains the historical VANTA studio reference.
