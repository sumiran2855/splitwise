import { IAuthService, LoginRequest, SignupRequest, AuthResponse } from '../interfaces/IAuthService';
import { ApiClient } from '../../api/ApiClient';
import { ValidationService, ValidationType } from '../../validation/ValidationService';
import { AuthUtils } from '../../utils/auth';
import { API_ROUTES } from '../../api/routes';

export class AuthService implements IAuthService {
  constructor(
    private apiClient: ApiClient,
    private validationService: ValidationService
  ) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Validate input
    const validation = this.validationService.validateMultiple([
      { type: ValidationType.EMAIL, value: credentials.email },
      { type: ValidationType.PASSWORD, value: credentials.password }
    ]);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    try {
      const response = await this.apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
      
      if (response.data.success && response.data.data) {
        AuthUtils.setAuth(response.data.data);
      }
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    // Validate input
    const validation = this.validationService.validateMultiple([
      { type: ValidationType.NAME, value: userData.name },
      { type: ValidationType.EMAIL, value: userData.email },
      { type: ValidationType.PASSWORD, value: userData.password }
    ]);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    if (!userData.confirmPassword) {
      return {
        success: false,
        error: 'Password confirmation is required'
      };
    }

    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    try {
      const { confirmPassword, ...signupData } = userData;
      const response = await this.apiClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, signupData);
      
      if (response.data.success && response.data.data) {
        AuthUtils.setAuth(response.data.data);
      }
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AuthUtils.clearAuth();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(API_ROUTES.AUTH.REFRESH);
      
      if (response.data.success && response.data.data) {
        AuthUtils.setAuth(response.data.data);
      }
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }
}
