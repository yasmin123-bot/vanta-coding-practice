# VANTA — Coding Practice for Beginners

VANTA Learning System v1 includes a bilingual landing page and an available HTML Fundamentals path with five beginner lessons. Lessons use guided explanations, read-only code examples, and interactive four-option quizzes with retry feedback. CSS and JavaScript learning paths remain planned.

The student account milestone adds real Supabase email/password authentication, optional email confirmation (according to Supabase project settings), password reset, a protected-by-UI dashboard/profile, and account-owned path/lesson progress. Progress is stored in the configured Supabase database and protected by PostgreSQL Row Level Security (RLS). The checked-in migration is applied to the VANTA hosted project; verify migration history before applying it to another project.

Quiz scores are client-submitted learning summaries and are not server-verified. They must not be used as trusted awards or credentials. Code examples remain read-only: no code execution, AI assistant, or competitions are implemented.

## Run locally

```sh
npm install
cp .env.example .env.local
# Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local
npm run dev
```

To run the app without Supabase values, leave the environment unset; public learning content remains viewable and account pages explain that Supabase setup is required. Registration, login, database progress, confirmation, and recovery require a configured Supabase project and its matching Auth URL/email settings.

Apply the migration only after selecting the intended Supabase project and reviewing it:

```sh
supabase link --project-ref <project-ref>
supabase db push
```

Never put a Supabase secret/service-role key into a Vite environment variable. `VITE_` values are included in the browser bundle; use a publishable key only.

## Verify

```sh
npm run typecheck
npm run build
npm run preview
```

## Structure

- `src/App.tsx` — bilingual landing page, route selection, and signed-in learning activity tracking.
- `src/auth/AuthProvider.tsx` — Supabase Auth session restoration and subscription.
- `src/lib/supabaseClient.ts` — safe, typed browser client setup.
- `src/lib/database.types.ts` — types for the profile and progress tables.
- `src/services/studentData.ts` — profile bootstrap and path/lesson data access.
- `src/state/StudentProgressProvider.tsx` — account-bound student progress state.
- `src/components/StudentAccountPages.tsx` — account flows, student dashboard, and profile.
- `src/components/StudentNavActions.tsx` — session-aware navigation and sign-out.
- `src/components/StartLesson.tsx` — first HTML lesson and guided quiz.
- `src/components/LearningLesson.tsx` — reusable view for the remaining HTML lessons.
- `src/components/LearningSystemPage.tsx` — path catalog and path outline pages.
- `src/content/learningSystem.ts` — route catalog and learning-path availability status.
- `src/content/initialHtmlExercise.ts` — original HTML exercise content preserved and reused as lesson material; code is not executed.
- `src/i18n/` — Arabic/English landing, path, lesson, quiz, and account copy.
- `supabase/migrations/` — reviewed schema migration with user-owned RLS policies.
- `docs/supabase-account-progress.md` — setup, security boundary, and official reference links.
- `src/utils/quizChoices.ts` — validated randomized option order shared by quizzes.
- `src/styles/` — VANTA tokens, responsive presentation, and reduced-motion rules.
- `public/brand/` — existing VANTA logo assets; the mark is preserved, not redesigned.
- `brand-spec.md` — asset provenance and design tokens.

Arabic is the default locale and uses RTL; English uses LTR. The language switch updates page copy, document direction, `lang`, title, and description. The selected locale is remembered locally when browser storage is available.
