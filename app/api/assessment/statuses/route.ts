import { NextResponse } from 'next/server';
import { query } from '@/src/lib/db';
import { getServerSession, resolveAssessmentTargets } from '@/src/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface StatusEntry {
  completed: boolean;
  completedAt: string | null;
}

/**
 * Batch completion status for many students in one query.
 *
 * Replaces the N+1 pattern of one `/api/assessment/status` request per student.
 * Accepts `{ userIds: string[] }` and returns `{ statuses: Record<id, { completed,
 * completedAt }> }`. Identity is derived server-side; ids the session may not
 * read are dropped and default to incomplete on the client.
 */
export async function POST(req: Request) {
  try {
    const session = getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const rawIds = (body as { userIds?: unknown })?.userIds;
    if (!Array.isArray(rawIds) || rawIds.some((id) => typeof id !== 'string')) {
      return NextResponse.json({ error: 'userIds must be an array of strings' }, { status: 400 });
    }

    const allowedIds = resolveAssessmentTargets(session, rawIds as string[]);

    const statuses: Record<string, StatusEntry> = {};
    if (allowedIds.length === 0) {
      return NextResponse.json({ statuses });
    }

    const { rows } = await query<{
      user_id: string;
      assessment_completed: boolean;
      assessment_completed_at: string | null;
    }>(
      `SELECT user_id, assessment_completed, assessment_completed_at
       FROM student_assessment_profiles WHERE user_id = ANY($1)`,
      [allowedIds],
    );

    const byId = new Map(rows.map((r) => [r.user_id, r]));
    for (const id of allowedIds) {
      const row = byId.get(id);
      statuses[id] = {
        completed: row?.assessment_completed ?? false,
        completedAt: row?.assessment_completed_at ?? null,
      };
    }

    return NextResponse.json({ statuses });
  } catch (err: any) {
    console.error('[assessment/statuses]', err);
    return NextResponse.json({ error: 'Failed to load statuses', statuses: {} }, { status: 500 });
  }
}
