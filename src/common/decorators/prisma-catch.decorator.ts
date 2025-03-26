import { Prisma } from '@prisma/client';
import { prismaError } from 'prisma-better-errors';
import { BadRequestException } from '@nestjs/common';

type AnyFunction = (...args: any[]) => Promise<any>;

export function PrismaCatch() {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<AnyFunction>) {
        const originalMethod = descriptor.value;

        if (!originalMethod) {
            throw new Error('Decorator can only be applied to method declarations');
        }

        descriptor.value = async function (this: any, ...args: any[]): Promise<any> {
            try {
                return await originalMethod.apply(this, args);
            } catch (error: unknown) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new prismaError(error);
                }

                if (error instanceof Prisma.PrismaClientValidationError) {
                    throw new BadRequestException(extractValidationMessage(error));
                }

                throw error;
            }
        };

        function extractValidationMessage(error: Prisma.PrismaClientValidationError) {
            const message = error.message.split('\n').find((line) => line.includes('argument'));

            return message?.split('.')[0].trim() || 'Invalid data provided';
        }

        return descriptor;
    };
}
