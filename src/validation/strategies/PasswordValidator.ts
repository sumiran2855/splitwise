import { IValidator, ValidationResult } from '../interfaces/IValidator';

export class PasswordValidator implements IValidator {
  validate(value: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (value.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(value)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(value)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(value)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
