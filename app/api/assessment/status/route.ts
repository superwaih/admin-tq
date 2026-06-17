import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';
import { getServerSession, resolveAssessmentTarget } from '@/src/lib/session';

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

    const { rows } = await query<{ assessment_completed: boolean; assessment_completed_at: string | null }>(
      `SELECT assessment_completed, assessment_completed_at
       FROM student_assessment_profiles WHERE user_id = $1`,
      [access.userId],
    );

    const row = rows[0];
    return NextResponse.json({
      completed: row?.assessment_completed ?? false,
      completedAt: row?.assessment_completed_at ?? null,
    });
  } catch (err: any) {
    console.error('[assessment/status]', err);
    return NextResponse.json({ error: 'Failed to load status', completed: false, completedAt: null }, { status: 500 });
  }
}
