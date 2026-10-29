-- Student-owned code drafts are separate from quiz and lesson completion records.
create table public.practice_drafts (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null check (exercise_id in (
    'html-introduction',
    'html-headings-paragraphs',
    'html-links-navigation',
    'html-images-attributes',
    'html-first-page'
  )),
  html_code text not null default '',
  css_code text not null default '',
  js_code text not null default '',
  draft_version smallint not null default 1 check (draft_version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id),
  constraint practice_drafts_html_size_check check (octet_length(html_code) <= 65536),
  constraint practice_drafts_css_size_check check (octet_length(css_code) <= 65536),
  constraint practice_drafts_js_size_check check (octet_length(js_code) <= 65536),
  constraint practice_drafts_total_size_check check (
    octet_length(html_code) + octet_length(css_code) + octet_length(js_code) <= 131072
  )
);

-- A student must be authenticated to reach drafts through the Data API.
-- Explicit grants are required for newly created public tables; RLS separately
-- scopes every accessible row to the owner.
revoke all on table public.practice_drafts from public, anon, authenticated;
grant select, insert, update on table public.practice_drafts to authenticated;

alter table public.practice_drafts enable row level security;

create policy "students read their own practice drafts"
  on public.practice_drafts for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "students create their own practice drafts"
  on public.practice_drafts for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "students update their own practice drafts"
  on public.practice_drafts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
