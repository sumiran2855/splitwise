export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IValidator {
  validate(value: string): ValidationResult;
}
