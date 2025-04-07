import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { RequestWithCookies } from '../interfaces/requestWithCookies';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: RequestWithCookies) => {
                    return request?.cookies?.authToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY') || 'SECRET',
        });
    }

    validate(payload: JwtPayload) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}
