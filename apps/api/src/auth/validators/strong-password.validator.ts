/* eslint-disable no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'strongPassword', async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) return false;

    if (password.length < 8) return false;

    const hasUpper = /[A-Z]/.test(password);
    if (!hasUpper) return false;

    const hasLower = /[a-z]/.test(password);
    if (!hasLower) return false;

    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) return false;

    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password);
    if (!hasSpecial) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
}

export function StrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StrongPasswordConstraint,
    });
  };
}
