const API_BASE_URL = process.env.NEXT_PUBLIC_API_CORE_URL || 'http://localhost:8000';

export type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiClient {
  static readonly baseUrl = API_BASE_URL;

  static async request<T>(endpoint: string, options: ApiRequestOptions = {}) {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
      : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (options.auth !== false && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const { auth, ...requestOptions } = options;
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...requestOptions, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || 'Request failed');
    }

    return res.json() as Promise<T>;
  }
}
