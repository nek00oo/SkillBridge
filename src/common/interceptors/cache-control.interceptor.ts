import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const CACHE_CONTROL_METADATA_KEY = 'cache-control';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<Response>();

        const cacheControl = this.reflector.get<string>(CACHE_CONTROL_METADATA_KEY, context.getHandler());

        return next.handle().pipe(
            tap(() => {
                if (cacheControl) {
                    res.setHeader('Cache-Control', cacheControl);
                }
            }),
        );
    }
}
