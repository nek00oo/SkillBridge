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

        const errorResponse: ErrorResponse = {
            message: (exceptionResponse as ErrorResponse).message || 'Internal server error',
            error: (exceptionResponse as ErrorResponse).error || 'Unknown error',
        };

        response.status(status).json({
            statusCode: status,
            ...errorResponse,
        });
    }
}
