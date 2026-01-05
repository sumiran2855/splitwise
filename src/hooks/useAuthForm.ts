import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigation } from '@/src/contexts/navigationContext';
import { useAuth } from '@/src/hooks/useAuth';
import { LoginRequest, SignupRequest } from '@/src/services/interfaces/IAuthService';

// Base hook with common functionality
function useBaseAuthForm<T extends LoginRequest | SignupRequest>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { navigate, setAuthenticated } = useNavigation();
  const auth = useAuth();

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

  return {
    formData,
    fieldErrors,
    setFieldErrors,
    handleFieldChange,
    handleSuccess,
    handleFieldError,
    handleGeneralError,
    auth,
    navigate
  };
}

// Login-specific hook
export function useLoginForm() {
  const base = useBaseAuthForm<LoginRequest>({
    email: '',
    password: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    base.fieldErrors && base.setFieldErrors({});

    const success = await base.auth.login(base.formData);
    
    if (success) {
      toast.success('Welcome back!');
      base.handleSuccess();
    } else if (base.auth.error) {
      if (base.auth.error.includes('Email')) {
        base.handleFieldError('email', base.auth.error);
      } else if (base.auth.error.includes('Password')) {
        base.handleFieldError('password', base.auth.error);
      } else {
        base.handleGeneralError(base.auth.error);
      }
    }
  };

  return {
    formData: base.formData,
    fieldErrors: base.fieldErrors,
    handleFieldChange: base.handleFieldChange,
    handleFormSubmit,
    isLoading: base.auth.isLoading,
    navigate: base.navigate
  };
}

// Signup-specific hook
export function useSignupForm() {
  const base = useBaseAuthForm<SignupRequest>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    base.setFieldErrors({});

    const success = await base.auth.signup(base.formData);
    
    if (success) {
      toast.success('Account created successfully!');
      base.handleSuccess();
    } else if (base.auth.error) {
      if (base.auth.error.includes('Email')) {
        base.handleFieldError('email', base.auth.error);
      } else if (base.auth.error.includes('Password')) {
        base.handleFieldError('password', base.auth.error);
      } else if (base.auth.error.includes('Name')) {
        base.handleFieldError('name', base.auth.error);
      } else {
        base.handleGeneralError(base.auth.error);
      }
    }
  };

  return {
    formData: base.formData,
    fieldErrors: base.fieldErrors,
    handleFieldChange: base.handleFieldChange,
    handleFormSubmit,
    isLoading: base.auth.isLoading,
    navigate: base.navigate
  };
}
