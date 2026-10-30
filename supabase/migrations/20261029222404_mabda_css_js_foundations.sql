-- Allow real progress and saved drafts for the three active Foundation paths.
-- This forward-only migration preserves all existing rows and does not change RLS,
-- grants, Auth, or ownership rules. Applied to the hosted VANTA Supabase project.

alter table public.path_progress
  drop constraint if exists path_progress_path_id_check;

alter table public.path_progress
  add constraint path_progress_path_id_check check (path_id in (
    'html-fundamentals',
    'css-fundamentals',
    'javascript-fundamentals'
  ));

alter table public.lesson_progress
  drop constraint if exists lesson_progress_lesson_id_check;

alter table public.lesson_progress
  add constraint lesson_progress_lesson_id_check check (lesson_id in (
    'html-introduction',
    'html-headings-paragraphs',
    'html-links-navigation',
    'html-images-attributes',
    'html-first-page',
    'css-what-is-css',
    'css-selectors',
    'css-colors-backgrounds',
    'css-typography',
    'css-box-model',
    'css-display-layout',
    'css-flexbox',
    'css-responsive',
    'js-what-is-javascript',
    'js-variables',
    'js-data-types',
    'js-operators',
    'js-conditionals',
    'js-functions',
    'js-arrays',
    'js-dom-basics',
    'js-events'
  ));

alter table public.lesson_progress
  drop constraint if exists lesson_progress_path_check;

alter table public.lesson_progress
  add constraint lesson_progress_path_check check (
    (
      path_id = 'html-fundamentals'
      and lesson_id in (
        'html-introduction',
        'html-headings-paragraphs',
        'html-links-navigation',
        'html-images-attributes',
        'html-first-page'
      )
    )
    or (
      path_id = 'css-fundamentals'
      and lesson_id in (
        'css-what-is-css',
        'css-selectors',
        'css-colors-backgrounds',
        'css-typography',
        'css-box-model',
        'css-display-layout',
        'css-flexbox',
        'css-responsive'
      )
    )
    or (
      path_id = 'javascript-fundamentals'
      and lesson_id in (
        'js-what-is-javascript',
        'js-variables',
        'js-data-types',
        'js-operators',
        'js-conditionals',
        'js-functions',
        'js-arrays',
        'js-dom-basics',
        'js-events'
      )
    )
  );

alter table public.practice_drafts
  drop constraint if exists practice_drafts_exercise_id_check;

alter table public.practice_drafts
  add constraint practice_drafts_exercise_id_check check (exercise_id in (
    'html-introduction',
    'html-headings-paragraphs',
    'html-links-navigation',
    'html-images-attributes',
    'html-first-page',
    'css-what-is-css',
    'css-selectors',
    'css-colors-backgrounds',
    'css-typography',
    'css-box-model',
    'css-display-layout',
    'css-flexbox',
    'css-responsive',
    'js-what-is-javascript',
    'js-variables',
    'js-data-types',
    'js-operators',
    'js-conditionals',
    'js-functions',
    'js-arrays',
    'js-dom-basics',
    'js-events'
  ));
