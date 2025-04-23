import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        // определяем статус (для HttpException свои, иначе – 500)
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // то, что в getResponse(): может быть строка, объект с message[] и т.п.
        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : { message: (exception as Error).message };

        // Логируем максимально подробно
        console.error('==== Exception caught by AllExceptionFilter ====');
        console.error('URL:', req.method, req.url);
        console.error('Exception instance:', exception);
        console.error('Status:', status);
        console.error('Response payload:', JSON.stringify(exceptionResponse, null, 2));
        console.error('Stack trace:', (exception as Error).stack);
        console.error('==============================================');

        // И возвращаем клиенту тоже подробный ответ
        res.status(status).json(
            typeof exceptionResponse === 'string'
                ? { statusCode: status, message: exceptionResponse }
                : { statusCode: status, ...exceptionResponse },
        );
    }
}
