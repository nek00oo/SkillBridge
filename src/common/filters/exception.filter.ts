import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        console.log('ALL_EXC:', exceptionResponse);
        const errorResponse: ErrorResponse = {
            message:
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as { message?: string }).message || 'Unknown error',
        };

        response.status(status).json({
            statusCode: status,
            ...errorResponse,
        });
    }
}
