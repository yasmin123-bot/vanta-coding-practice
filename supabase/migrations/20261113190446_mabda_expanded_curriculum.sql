-- Allow the expanded Mabda curriculum to store lesson progress and practice drafts.
-- This migration only widens lesson/exercise ID checks; it preserves every existing row
-- and does not change Auth, RLS policies, grants, ownership, or path IDs.

alter table public.lesson_progress
  drop constraint if exists lesson_progress_lesson_id_check;

alter table public.lesson_progress
  add constraint lesson_progress_lesson_id_check check (lesson_id in (
    'html-introduction',
    'html-headings-paragraphs',
    'html-links-navigation',
    'html-images-attributes',
    'html-first-page',
    'html-document-metadata',
    'html-semantic-structure',
    'html-lists-tables',
    'html-accessible-forms',
    'html-form-validation',
    'html-media',
    'html-multi-section-page',
    'css-what-is-css',
    'css-selectors',
    'css-colors-backgrounds',
    'css-typography',
    'css-box-model',
    'css-display-layout',
    'css-flexbox',
    'css-responsive',
    'css-specificity-inheritance',
    'css-sizing-units',
    'css-display-visibility',
    'css-positioning',
    'css-grid',
    'css-pseudo-selectors',
    'css-custom-properties',
    'css-web-fonts-surfaces',
    'css-motion',
    'css-layout-debugging',
    'css-responsive-page',
    'js-what-is-javascript',
    'js-variables',
    'js-data-types',
    'js-operators',
    'js-conditionals',
    'js-functions',
    'js-arrays',
    'js-dom-basics',
    'js-events',
    'js-loops',
    'js-type-conversion',
    'js-functions-scope',
    'js-objects',
    'js-array-methods',
    'js-string-number-methods',
    'js-dom-manipulation',
    'js-form-interactions',
    'js-json',
    'js-local-storage',
    'js-error-handling',
    'js-promises-async',
    'js-fetch',
    'js-modules-organization'
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
        'html-first-page',
        'html-document-metadata',
        'html-semantic-structure',
        'html-lists-tables',
        'html-accessible-forms',
        'html-form-validation',
        'html-media',
        'html-multi-section-page'
      )
    )
    or (
      path_id = 'css-fundamentals'
      and lesson_id in (
        'css-what-is-css',
        'css-selectors',
        'css-colors-backgrounds',
        'css-typography',
        'css-specificity-inheritance',
        'css-box-model',
        'css-display-layout',
        'css-sizing-units',
        'css-display-visibility',
        'css-positioning',
        'css-flexbox',
        'css-responsive',
        'css-grid',
        'css-responsive-page',
        'css-pseudo-selectors',
        'css-custom-properties',
        'css-web-fonts-surfaces',
        'css-motion',
        'css-layout-debugging'
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
        'js-loops',
        'js-type-conversion',
        'js-functions',
        'js-arrays',
        'js-functions-scope',
        'js-objects',
        'js-array-methods',
        'js-string-number-methods',
        'js-dom-basics',
        'js-events',
        'js-dom-manipulation',
        'js-form-interactions',
        'js-json',
        'js-local-storage',
        'js-error-handling',
        'js-promises-async',
        'js-fetch',
        'js-modules-organization'
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
    'html-document-metadata',
    'html-semantic-structure',
    'html-lists-tables',
    'html-accessible-forms',
    'html-form-validation',
    'html-media',
    'html-multi-section-page',
    'css-what-is-css',
    'css-selectors',
    'css-colors-backgrounds',
    'css-typography',
    'css-specificity-inheritance',
    'css-box-model',
    'css-display-layout',
    'css-sizing-units',
    'css-display-visibility',
    'css-positioning',
    'css-flexbox',
    'css-responsive',
    'css-grid',
    'css-responsive-page',
    'css-pseudo-selectors',
    'css-custom-properties',
    'css-web-fonts-surfaces',
    'css-motion',
    'css-layout-debugging',
    'js-what-is-javascript',
    'js-variables',
    'js-data-types',
    'js-operators',
    'js-conditionals',
    'js-functions',
    'js-arrays',
    'js-dom-basics',
    'js-events',
    'js-loops',
    'js-type-conversion',
    'js-functions-scope',
    'js-objects',
    'js-array-methods',
    'js-string-number-methods',
    'js-dom-manipulation',
    'js-form-interactions',
    'js-json',
    'js-local-storage',
    'js-error-handling',
    'js-promises-async',
    'js-fetch',
    'js-modules-organization'
  ));
