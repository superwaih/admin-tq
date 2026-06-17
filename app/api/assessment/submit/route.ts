import { NextResponse } from 'next/server';
import { withTransaction } from '@/src/lib/db';
import { computeResults } from '@/src/lib/assessment-compute';
import { getServerSession } from '@/src/lib/session';
import type { AssessmentData } from '@/src/types/assessment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    // Only the student themselves can submit their assessment. The acting user
    // comes from the signed session cookie — any `userId` in the body is ignored.
    if (session.role !== 'student') {
      return NextResponse.json({ error: 'Only students can submit an assessment' }, { status: 403 });
    }
    const userId = session.userId;

    const body = await req.json();
    const responses: AssessmentData | undefined = body?.responses;
    if (!responses) {
      return NextResponse.json({ error: 'responses are required' }, { status: 400 });
    }

    const results = computeResults(responses);
    const now = new Date().toISOString();

    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO student_assessments_responses (user_id, responses, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (user_id) DO UPDATE SET responses = EXCLUDED.responses, updated_at = now()`,
        [userId, JSON.stringify(responses)],
      );
      await client.query(
        `INSERT INTO student_assessments_results (user_id, results, updated_at)
         VALUES ($1, $2, now())
         ON CONFLICT (user_id) DO UPDATE SET results = EXCLUDED.results, updated_at = now()`,
        [userId, JSON.stringify(results)],
      );
      await client.query(
        `INSERT INTO student_assessment_profiles (user_id, assessment_completed, assessment_completed_at)
         VALUES ($1, true, $2)
         ON CONFLICT (user_id) DO UPDATE SET assessment_completed = true, assessment_completed_at = $2`,
        [userId, now],
      );
    });

    return NextResponse.json({ ok: true, results, completedAt: now });
  } catch (err: any) {
    console.error('[assessment/submit]', err);
    return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
  }
}
