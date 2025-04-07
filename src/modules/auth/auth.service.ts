import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserInterface } from './interfaces/user.interface';
import { RequestWithCookies } from './interfaces/requestWithCookies';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<SanitizedUser | null> {
        const user = await this.usersService.findUserByEmail(email);

        if (user && (await this.validatePassword(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }

        return null;
    }

    login(user: UserInterface) {
        const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registration(createUserDto: CreateUserDto) {
        const client = await this.usersService.findUserByEmail(createUserDto.email);
        if (client) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.createUser({ ...createUserDto, password: hashedPassword });

        return this.login(user);
    }

    async IsAuthenticated(req: RequestWithCookies): Promise<boolean> {
        const token = req.cookies['authToken'];

        if (!token) {
            return false;
        }

        try {
            const { email } = this.jwtService.verify<JwtPayload>(token);
            const user = await this.usersService.findUserByEmail(email);

            return !!user;
        } catch {
            return false;
        }
    }

    private validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

type SanitizedUser = Omit<User, 'password'>;
