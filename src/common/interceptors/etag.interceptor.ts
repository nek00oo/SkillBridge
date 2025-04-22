import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request, json } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
    intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
        const contextType = context.getType<'rpc' | 'http' | 'ws' | 'graphql'>();

        return next.handle().pipe(
            map((body: T) => {
                if (contextType === 'http') {
                    const req: Request = context.switchToHttp().getRequest();
                    const res: Response = context.switchToHttp().getResponse();
                    if (req.url.startsWith('/api/v1/auth')) {
                        return next.handle(); // пропусти без ETag
                    }

                    const etag = generateETag(body);
                    const clientETag = req.headers['if-none-match'];

                    if (etag === clientETag) {
                        res.status(304).end();
                        return EMPTY;
                    } else {
                        res.setHeader('ETag', etag);
                    }
                }

                return body;
            }),
        );
    }
}

function generateETag(body: any): string {
    const json = JSON.stringify(body);
    return createHash('sha1').update(json).digest('hex');
}
