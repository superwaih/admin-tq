import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';
import { getServerSession, resolveAssessmentTarget } from '@/src/lib/session';
import type { AssessmentData, AssessmentResults } from '@/src/types/assessment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    // Identity is derived server-side. A client-supplied id only matters for
    // counselors viewing one of their students; students can only see their own.
    const access = resolveAssessmentTarget(session, searchParams.get('userId'));
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }
    const userId = access.userId;

    const [resultsRes, responsesRes, profileRes] = await Promise.all([
      query<{ results: AssessmentResults }>(
        `SELECT results FROM student_assessments_results WHERE user_id = $1`, [userId]),
      query<{ responses: AssessmentData }>(
        `SELECT responses FROM student_assessments_responses WHERE user_id = $1`, [userId]),
      query<{ assessment_completed: boolean; assessment_completed_at: string | null }>(
        `SELECT assessment_completed, assessment_completed_at FROM student_assessment_profiles WHERE user_id = $1`, [userId]),
    ]);

    return NextResponse.json({
      results: resultsRes.rows[0]?.results ?? null,
      responses: responsesRes.rows[0]?.responses ?? null,
      completed: profileRes.rows[0]?.assessment_completed ?? false,
      completedAt: profileRes.rows[0]?.assessment_completed_at ?? null,
    });
  } catch (err: any) {
    console.error('[assessment/results]', err);
    return NextResponse.json({ error: 'Failed to load results' }, { status: 500 });
  }
}
