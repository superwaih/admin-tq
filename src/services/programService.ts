import { ApiClient } from '@/src/services/apiClient';

export interface ProgramApiResponse {
  id: number;
  ouac_code: string;
  program_name: string;
  university: string;
  province: string;
  cutoff_min?: number | null;
  cutoff_median?: number | null;
  cutoff_max?: number | null;
  annual_seats?: number | null;
  requires_aif: boolean;
  requires_mmi: boolean;
  competitiveness?: number | null;
  confidence_level: 'high' | 'medium' | 'low';
  last_verified_date?: string | null;
  source_name?: string | null;
}

export class ProgramService {
  private static request<T>(endpoint: string, options: Parameters<typeof ApiClient.request>[1] = {}) {
    return ApiClient.request<T>(endpoint, options);
  }

  static listPrograms(filters?: {
    province?: string;
    requiresAif?: boolean;
    requiresMmi?: boolean;
  }): Promise<ProgramApiResponse[]> {
    const query = new URLSearchParams();

    if (filters?.province) {
      query.set('province', filters.province);
    }
    if (filters?.requiresAif !== undefined) {
      query.set('requires_aif', String(filters.requiresAif));
    }
    if (filters?.requiresMmi !== undefined) {
      query.set('requires_mmi', String(filters.requiresMmi));
    }

    const endpoint = `/api/v1/programs/${query.toString() ? `?${query}` : ''}`;
    return this.request<ProgramApiResponse[]>(endpoint, { method: 'GET' });
  }

  static getProgram(ouacCode: string): Promise<ProgramApiResponse> {
    return this.request<ProgramApiResponse>(`/api/v1/programs/${ouacCode}`, { method: 'GET' });
  }
}
