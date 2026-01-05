import { IValidator, ValidationResult } from '../interfaces/IValidator';

export class EmailValidator implements IValidator {
  validate(value: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value) {
      errors.push('Email is required');
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
