import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { parse, isValid } from 'date-fns';

@ValidatorConstraint({ name: 'customDateString', async: false })
export class CustomDateStringConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const format = args.constraints[0] as string;
        const parsedDate = parse(value, format, new Date());
        return isValid(parsedDate);
    }

    defaultMessage(args: ValidationArguments) {
        const format = args.constraints[0] as string;
        return `Invalid date format. Expected format: ${format}`;
    }
}

export function CustomDateString(format: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'customDateString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [format],
            options: validationOptions,
            validator: CustomDateStringConstraint,
        });
    };
}
