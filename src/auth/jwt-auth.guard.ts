import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithCookies } from './interfaces/requestWithCookies';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<RequestWithCookies>();
        const token = request.cookies?.authToken;
        if (!token) {
            throw new UnauthorizedException('Токен не найден');
        }
        return super.canActivate(context);
    }
}
