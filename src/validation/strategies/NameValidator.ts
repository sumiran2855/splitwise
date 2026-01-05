import { IValidator, ValidationResult } from '../interfaces/IValidator';

export class NameValidator implements IValidator {
  validate(value: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Name is required');
      return { isValid: false, errors };
    }

    if (value.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (value.trim().length > 50) {
      errors.push('Name must not exceed 50 characters');
    }

    if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
      errors.push('Name can only contain letters and spaces');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
