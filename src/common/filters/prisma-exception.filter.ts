import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { prismaError } from 'prisma-better-errors';

@Catch(prismaError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: prismaError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.statusCode;

        // Для API-роутов
        if (request.path.startsWith('/api')) {
            return response.status(status).json({
                statusCode: exception.statusCode,
                message: exception.message,
                metaData: exception.metaData,
            });
        }

        // Для MVC-роутов
        response.status(status).render('error', {
            statusCode: status,
            message: exception.message,
            layout: 'error-layout',
        });
    }
}
