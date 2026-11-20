import { lazy, Suspense, type ComponentProps } from 'react';
import type PracticeStudio from './PracticeStudio';

const PracticeStudioView = lazy(() => import('./PracticeStudio'));

type LazyPracticeStudioProps = ComponentProps<typeof PracticeStudio>;

function LazyPracticeStudio({ locale, ...props }: LazyPracticeStudioProps) {
  const loadingLabel = locale === 'ar' ? 'جارٍ تحميل مساحة التدريب…' : 'Loading Practice Studio…';

  return (
    <Suspense fallback={<p className="student-loading-state" role="status" aria-live="polite">{loadingLabel}</p>}>
      <PracticeStudioView locale={locale} {...props} />
    </Suspense>
  );
}

export default LazyPracticeStudio;
