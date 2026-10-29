# VANTA Supabase account and progress integration

This document records the implementation boundary and primary upstream references for the first account-backed learning milestone.

## Local setup

1. Create or select a Supabase project and configure its Auth URL settings. Set the Site URL to the deployed VANTA origin, and add `http://localhost:5173/**` plus `http://127.0.0.1:5173/**` to the redirect allow list. Add the exact deployed origin and any preview origin you intend to test, including `/auth/callback` and `/reset-password` destinations; do not use a broad wildcard in production.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` plus `VITE_SUPABASE_PUBLISHABLE_KEY` from the project's Connect/API Keys page.
3. Never place `sb_secret_*`, `service_role`, or other privileged keys in a `VITE_` variable or browser bundle. This app uses only the publishable key; database ownership is enforced by RLS.
4. For a new environment, review and apply the checked-in migration through the Supabase CLI: `supabase db push` (after `supabase link`) or run the migration SQL in that project's SQL editor. The migration is already applied to the VANTA hosted project; verify its migration history before applying it elsewhere. It grants profile updates only for the authenticated owner so learners can change their display name; it does not grant email or password changes through the profile screen.
5. Configure the Supabase Auth email provider, confirmation email, recovery email, and allowed redirect URLs. Test using a development project before production.
6. Restart Vite after changing environment variables. Missing or malformed setup is shown in the UI; the app does not simulate a successful account or database operation.

The checked-in local Supabase CLI config uses the Vite development origin and enables email confirmations for local Auth. Email confirmation/recovery messages are handled by the local mail catcher when running Supabase locally. For a hosted project, configure the corresponding Auth email templates/provider and allowed URLs in that project's dashboard.

## Implementation map

- `src/lib/supabaseClient.ts`: browser client configuration and rejection of secret/service-role keys.
- `src/auth/AuthProvider.tsx`: Supabase session restoration, auth-state subscription, and same-tab password-recovery state.
- `src/services/studentData.ts`: typed profile bootstrap and path/lesson progress reads and writes; path and lesson opens use their database unique keys, and updates verify that a row was affected.
- `src/state/StudentProgressProvider.tsx`: account-bound state, cross-account response guards, serialized writes, refresh/error states, and a confirmed display-name update.
- `src/utils/learningProgress.ts`: derives the current, resumable, recommended, and completed HTML lessons from persisted rows; it does not invent local progress.
- `src/content/learningSystem.ts`: explicit auth, profile, dashboard, path, and lesson routes.
- `src/i18n/studentPortal.ts`: Arabic and English account/dashboard copy.
- `src/components/StudentAccountPages.tsx`: login, signup, email confirmation callback, password reset, dashboard, and profile screens.
- `src/components/StudentNavActions.tsx`: account-aware navigation and sign-out.
- `supabase/migrations/20261028014756_add_student_accounts_and_learning_progress.sql`: profiles and progress tables, constraints, grants, and owner-only RLS.

## Student core flow

- After Auth restores a session, the provider loads the profile and the signed-in user's path and lesson rows. An initial load failure is shown as an error with a retry action rather than as a default zero-progress dashboard. When data has already loaded, a later refresh failure keeps the last confirmed snapshot visible with an error notice.
- Opening the available HTML path or a lesson records `last_opened_at`. The dashboard and path page derive the resume lesson from persisted incomplete lessons; if none exists, they recommend the first incomplete lesson. If the path is complete, the dashboard offers review rather than labeling a completed path as in progress.
- Completing a lesson's quiz persists the score from the first answer to each question in that quiz run, plus its completion timestamp; retrying a question does not increase that score. Starting a fresh quiz run later replaces the stored summary for that lesson rather than creating attempt history. The lesson result is always shown, but the UI states whether saving was confirmed and offers a retry when it was not. Individual answer selections are not stored. Scores are learner-submitted summaries, not server-verified proof of skill.
- The profile page can update only `profiles.display_name`. RLS and the update grant constrain this to `auth.uid() = user_id`; email and password changes remain in the dedicated Auth flows.
- CSS and JavaScript paths, achievements, and additional account features remain planned; no lesson records are fabricated for unavailable paths.

The Vite client stores the Supabase Auth session using the official JavaScript client. The visible route guard is a UX convenience, not the authorization boundary: Postgres RLS is the enforcement layer for account-owned records. Only the five catalogued HTML lesson IDs can be persisted. CSS and JavaScript paths remain planned.

Quiz score and completion fields are client-submitted learning summaries. RLS ensures a learner can write only their own rows, but it does not prove quiz correctness against a trusted server; do not use these fields for awards, payments, ranking, or certification without a server-verified design.

## Official references checked

- Supabase JavaScript Auth `signUp`: https://supabase.com/docs/reference/javascript/auth-signup
- Supabase JavaScript Auth `resetPasswordForEmail`: https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
- Supabase password-based Auth flows, including redirect allow-list requirements: https://supabase.com/docs/guides/auth/passwords
- Supabase Auth redirect URL configuration: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase Auth PKCE flow and code exchange: https://supabase.com/docs/guides/auth/sessions/pkce-flow
- Supabase API key types and publishable/secret key guidance: https://supabase.com/docs/guides/getting-started/api-keys
- Supabase PostgreSQL Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase CLI local development and migrations: https://supabase.com/docs/guides/cli/local-development
- Supabase JavaScript client package: https://github.com/supabase/supabase-js

The current product is a client-rendered Vite application, not an SSR application. If VANTA later moves to SSR, review Supabase's `@supabase/ssr` client/cookie guidance and server-side authorization pattern before porting this browser session setup.
