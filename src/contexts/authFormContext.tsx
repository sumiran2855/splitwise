import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';
import { LoginRequest, SignupRequest } from '@/src/services/interfaces/IAuthService';
import { Page } from '@/src/contexts/navigationContext';

interface AuthFormContextType<T extends LoginRequest | SignupRequest> {
  formData: T;
  fieldErrors: Record<string, string>;
  setFieldErrors: (errors: Record<string, string>) => void;
  handleFieldChange: (field: keyof T) => (value: string) => void;
  handleSuccess: () => void;
  handleFieldError: (field: string, error: string) => void;
  handleGeneralError: (error: string) => void;
  navigate: (route: Page) => void;
}

const AuthFormContext = createContext<AuthFormContextType<any> | null>(null);

export function useAuthFormContext<T extends LoginRequest | SignupRequest>(): AuthFormContextType<T> {
  const context = useContext(AuthFormContext);
  if (!context) {
    throw new Error('useAuthFormContext must be used within an AuthFormProvider');
  }
  return context as AuthFormContextType<T>;
}

interface AuthFormProviderProps<T extends LoginRequest | SignupRequest> {
  children: ReactNode;
  initialData: T;
}

export function AuthFormProvider<T extends LoginRequest | SignupRequest>({ 
  children, 
  initialData 
}: AuthFormProviderProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { navigate, setAuthenticated } = useNavigation();

  const handleFieldChange = (field: keyof T) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field as string]) {
      setFieldErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };

  const handleSuccess = () => {
    setAuthenticated(true);
    navigate('dashboard');
  };

  const handleFieldError = (field: string, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleGeneralError = (error: string) => {
    toast.error(error);
  };

  const value: AuthFormContextType<T> = {
    formData,
    fieldErrors,
    setFieldErrors,
    handleFieldChange,
    handleSuccess,
    handleFieldError,
    handleGeneralError,
    navigate
  };

  return (
    <AuthFormContext.Provider value={value}>
      {children}
    </AuthFormContext.Provider>
  );
}
