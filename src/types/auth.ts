export type Role = 'student' | 'counselor' | 'parent' | 'admin';

/**
 * Simplified registration - only email and password required initially
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  role: Role;
}

/**
 * Extended profile data collected during onboarding
 */
export interface StudentProfile {
  first_name: string;
  last_name: string;
  province: string;
  school_name?: string;
  counselor_code?: string;
  grad_year?: string;
}

export interface CounselorProfile {
  first_name: string;
  last_name: string;
  province: string;
  school_name: string;
  job_title: string;
}

export interface ParentProfile {
  first_name: string;
  last_name: string;
  province: string;
  student_email: string;
}

export type ProfileData = StudentProfile | CounselorProfile | ParentProfile;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  
  province?: string;
  tenant_id?: string;
}

export type SocialProvider = 'google' | 'apple';