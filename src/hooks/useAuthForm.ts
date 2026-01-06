import { useAuth } from '@/src/hooks/useAuth';
import { useAuthFormContext } from '@/src/contexts/authFormContext';
import { LoginRequest, SignupRequest } from '@/src/services/interfaces/IAuthService';

// Login-specific hook
export function useLoginForm() {
  const auth = useAuth();
  const { formData, fieldErrors, setFieldErrors, handleSuccess, handleFieldError, handleGeneralError, handleFieldChange, navigate } = useAuthFormContext<LoginRequest>();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const success = await auth.login(formData);
    
    if (success) {
      handleSuccess();
    } else if (auth.error) {
      if (auth.error.includes('Email')) {
        handleFieldError('email', auth.error);
      } else if (auth.error.includes('Password')) {
        handleFieldError('password', auth.error);
      } else {
        handleGeneralError(auth.error);
      }
    }
  };

  return {
    formData,
    fieldErrors,
    handleFieldChange,
    handleFormSubmit,
    isLoading: auth.isLoading,
    navigate
  };
}

// Signup-specific hook
export function useSignupForm() {
  const auth = useAuth();
  const { formData, fieldErrors, setFieldErrors, handleSuccess, handleFieldError, handleGeneralError, handleFieldChange, navigate } = useAuthFormContext<SignupRequest>();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const success = await auth.signup(formData);
    
    if (success) {
      handleSuccess();
    } else if (auth.error) {
      if (auth.error.includes('Email')) {
        handleFieldError('email', auth.error);
      } else if (auth.error.includes('Password')) {
        handleFieldError('password', auth.error);
      } else if (auth.error.includes('Name')) {
        handleFieldError('name', auth.error);
      } else {
        handleGeneralError(auth.error);
      }
    }
  };

  return {
    formData,
    fieldErrors,
    handleFieldChange,
    handleFormSubmit,
    isLoading: auth.isLoading,
    navigate
  };
}
