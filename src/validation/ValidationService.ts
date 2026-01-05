import { IValidator, ValidationResult } from './interfaces/IValidator';
import { EmailValidator } from './strategies/EmailValidator';
import { PasswordValidator } from './strategies/PasswordValidator';
import { NameValidator } from './strategies/NameValidator';

export enum ValidationType {
  EMAIL = 'email',
  PASSWORD = 'password',
  NAME = 'name',
}

export class ValidationService {
  private static instance: ValidationService;
  private validators: Map<ValidationType, IValidator>;

  private constructor() {
    this.validators = new Map();
    this.initializeValidators();
  }

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  private initializeValidators(): void {
    this.validators.set(ValidationType.EMAIL, new EmailValidator());
    this.validators.set(ValidationType.PASSWORD, new PasswordValidator());
    this.validators.set(ValidationType.NAME, new NameValidator());
  }

  public validate(type: ValidationType, value: string): ValidationResult {
    const validator = this.validators.get(type);
    if (!validator) {
      throw new Error(`No validator found for type: ${type}`);
    }
    return validator.validate(value);
  }

  public validateMultiple(validations: Array<{ type: ValidationType; value: string }>): ValidationResult {
    const allErrors: string[] = [];
    
    for (const validation of validations) {
      const result = this.validate(validation.type, validation.value);
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  public addValidator(type: ValidationType, validator: IValidator): void {
    this.validators.set(type, validator);
  }
}
