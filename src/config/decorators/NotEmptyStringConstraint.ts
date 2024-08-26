import {
  registerDecorator,
  ValidationArguments, ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomEmptyTextValidator implements ValidatorConstraintInterface {
  defaultMessage(_: ValidationArguments): string {
    return 'El campo es requerido';
  }

  validate(value: string, _: ValidationArguments): boolean {
    if (value === null) {
      return false;
    }

    if (value === undefined) {
      return false;
    }

    return value.trim().length > 0;
  }
}

export function NotEmptyText(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'NotEmptyText',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: CustomEmptyTextValidator,
    });
  };
}
