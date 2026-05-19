import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  UserProfile,
  SocialProvider 
} from '@/src/types/auth';
import { ApiClient } from '@/src/services/apiClient';

export class AuthService {
  private static request<T>(endpoint: string, options: Parameters<typeof ApiClient.request>[1] = {}) {
    return ApiClient.request<T>(endpoint, options);
  }

  // --- AUTH ENDPOINTS ---
  static login(data: LoginCredentials): Promise<AuthResponse> {
    return this.request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(data) });
  }

  static register(data: RegisterCredentials): Promise<{ message: string }> {
    return this.request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }

  static verifyEmail(email: string, otp: string): Promise<{ message: string }> {
    return this.request(`/api/v1/auth/verify-email?email=${encodeURIComponent(email)}&otp=${otp}`, { 
      method: 'GET' 
    });
}

  static refreshToken(refresh_token: string): Promise<AuthResponse> {
    return this.request('/api/v1/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) });
  }

  static forgotPassword(email: string): Promise<{ message: string }> {
    return this.request('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  }

  static resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    return this.request('/api/v1/auth/reset-password', { 
      method: 'POST', 
      body: JSON.stringify({ token, new_password }) 
    });
  }

  static socialAuth(provider: SocialProvider): void {
    if (typeof window !== 'undefined') {
      
    // Corrected path: includes /login suffix
      window.location.href = `${ApiClient.baseUrl}/api/v1/auth/${provider}/login`;
    }
  }

  // --- USER ENDPOINTS ---
  static getMe(): Promise<UserProfile> {
    return this.request('/api/v1/users/me', { method: 'GET' });
  }

  static updateUser(userId: string, data: Partial<UserProfile>): Promise<{ message: string }> {
    return this.request(`/api/v1/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  static deleteUser(userId: string): Promise<{ message: string }> {
    return this.request(`/api/v1/users/${userId}`, { method: 'DELETE' });
  }

  // --- TOKEN HELPERS ---
  private static saveStorageToken(key: string, value: string, remember: boolean) {
    if (typeof window === 'undefined') return;

    if (remember) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  }

  private static writeCookie(name: string, value: string, remember: boolean) {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    const maxAge = remember ? `; max-age=${30 * 24 * 60 * 60}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${maxAge}${secureFlag}`;
  }

  static storeTokens(data: AuthResponse, remember = true) {
    if (typeof window === 'undefined') return;

    this.saveStorageToken('access_token', data.access_token, remember);
    this.saveStorageToken('refresh_token', data.refresh_token, remember);
    this.writeCookie('access_token', data.access_token, remember);
    this.writeCookie('refresh_token', data.refresh_token, remember);
  }

  private static clearStoredTokens() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  static logout() {
    this.clearStoredTokens();
    document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'refresh_token=; path=/; max-age=0; SameSite=Lax';
  }

}