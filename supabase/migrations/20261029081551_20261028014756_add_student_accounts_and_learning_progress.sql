-- VANTA student account data. All progress is private to its authenticated owner.
-- Quiz scores are client-submitted learning summaries, not trusted credentials or rewards.

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.path_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  path_id text not null check (path_id = 'html-fundamentals'),
  started_at timestamptz not null default now(),
  last_opened_at timestamptz not null default now(),
  primary key (user_id, path_id)
);

create table public.lesson_progress (
  user_id uuid not null,
  path_id text not null,
  lesson_id text not null check (lesson_id in (
    'html-introduction',
    'html-headings-paragraphs',
    'html-links-navigation',
    'html-images-attributes',
    'html-first-page'
  )),
  started_at timestamptz not null default now(),
  last_opened_at timestamptz not null default now(),
  completed_at timestamptz,
  quiz_score smallint,
  quiz_total smallint,
  primary key (user_id, lesson_id),
  constraint lesson_progress_path_fk
    foreign key (user_id, path_id)
    references public.path_progress (user_id, path_id)
    on delete cascade,
  constraint lesson_progress_path_check check (path_id = 'html-fundamentals'),
  constraint lesson_progress_score_pair_check check (
    (quiz_score is null and quiz_total is null)
    or (quiz_score is not null and quiz_total is not null and quiz_total > 0 and quiz_score between 0 and quiz_total)
  ),
  constraint lesson_progress_completion_check check (
    (completed_at is null) = (quiz_score is null)
  )
);

create index lesson_progress_user_last_opened_idx
  on public.lesson_progress (user_id, last_opened_at desc);

alter table public.profiles enable row level security;
alter table public.path_progress enable row level security;
alter table public.lesson_progress enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
revoke all on table public.path_progress from public, anon, authenticated;
revoke all on table public.lesson_progress from public, anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.path_progress to authenticated;
grant select, insert, update on table public.lesson_progress to authenticated;

create policy "students read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "students create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "students update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "students read their own path progress"
  on public.path_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "students start their own paths"
  on public.path_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "students update their own path progress"
  on public.path_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "students read their own lesson progress"
  on public.lesson_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "students start their own lessons"
  on public.lesson_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "students update their own lesson progress"
  on public.lesson_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
