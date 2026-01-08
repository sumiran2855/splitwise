import { useState, useCallback, useMemo } from 'react';
import { AuthService } from '../services/client/AuthService';
import { ApiClient } from '../api/ApiClient';
import { ValidationService } from '../validation/ValidationService';
import { LoginRequest, SignupRequest } from '../services/interfaces/IAuthService';

export interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  signup: (userData: SignupRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authService = useMemo(() => {
    const apiClient = ApiClient.getInstance();
    const validationService = ValidationService.getInstance();
    return new AuthService(apiClient, validationService);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const signup = useCallback(async (userData: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signup(userData);
      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  return {
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError
  };
};
