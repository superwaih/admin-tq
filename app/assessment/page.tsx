import { Suspense } from 'react';
import AssessmentClient from './AssessmentClient';

export const metadata = {
  title: 'Potential Assessment — AdmitIQ',
};

export default function AssessmentPage() {
  return (
    <Suspense fallback={null}>
      <AssessmentClient />
    </Suspense>
  );
}
