import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgramService, ProgramApiResponse } from '@/src/services/programService';
import type { Program } from '@/src/types';

export type ProgramFilterOptions = {
  province?: string;
  requiresAif?: boolean;
  requiresMmi?: boolean;
};

function normalizeProgramId(ouacCode: string) {
  return ouacCode.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function mapApiProgram(program: ProgramApiResponse): Program {
  const probability = Math.min(
    95,
    Math.max(
      10,
      program.competitiveness ? Math.round(program.competitiveness * 10) : 45
    )
  );

  const admissionAvgRange =
    program.cutoff_min != null && program.cutoff_max != null
      ? `${Math.round(program.cutoff_min)}–${Math.round(program.cutoff_max)}%`
      : program.cutoff_median != null
      ? `${Math.round(program.cutoff_median)}%`
      : 'TBD';

  return {
    id: normalizeProgramId(program.ouac_code),
    name: program.program_name,
    university: program.university,
    province: program.province as Program['province'],
    probability,
    admissionAvgRange,
    supplementalType: program.requires_aif
      ? 'AIF required'
      : program.requires_mmi
      ? 'MMI required'
      : 'None required',
    deadline: null,
    confidenceProfiles: program.annual_seats ?? 0,
    confidenceThreshold: 30,
    trend: null,
  };
}

export function useProgram(filters?: ProgramFilterOptions) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stableFilters = useMemo(
    () =>
      filters
        ? {
            province: filters.province,
            requiresAif: filters.requiresAif,
            requiresMmi: filters.requiresMmi,
          }
        : undefined,
    [filters]
  );

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiPrograms = await ProgramService.listPrograms(stableFilters);
      setPrograms(apiPrograms.map(mapApiProgram));
    } catch (err: any) {
      setError(err.message || 'Failed to load programs');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, [stableFilters]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs,
    loading,
    error,
    refresh: fetchPrograms,
  };
}
