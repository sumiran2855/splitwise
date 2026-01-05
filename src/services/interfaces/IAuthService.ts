export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      phoneNumber?: string;
      isEmailVerified: boolean;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
  error?: string;
}

export interface IAuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  signup(userData: SignupRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthResponse>;
}
