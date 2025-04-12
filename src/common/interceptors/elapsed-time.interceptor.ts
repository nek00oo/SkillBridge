import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { GqlContext } from '../interfaces/GqlContext';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const contextType = context.getType<'rpc' | 'http' | 'ws' | 'graphql'>();
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                const elapsed = Date.now() - start;

                if (contextType === 'graphql') {
                    const gqlCtx = GqlExecutionContext.create(context);
                    const gqlContext: GqlContext = gqlCtx.getContext<GqlContext>();

                    if (gqlContext?.res?.setHeader) {
                        gqlContext.res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
                    }
                } else if (contextType === 'http') {
                    const res = context.switchToHttp().getResponse<Response>();
                    if (res?.setHeader) {
                        res.setHeader('X-Elapsed-Time', `${elapsed}ms`);
                    }
                }
            }),
        );
    }
}
