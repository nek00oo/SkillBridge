import { Prisma } from '@prisma/client';
import { prismaError } from 'prisma-better-errors';

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
                throw error;
            }
        };

        return descriptor;
    };
}
