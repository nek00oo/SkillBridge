import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);

        this.logger.log(`User email: ${user?.email}`);

        if (user && (await this.validatePassword(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        this.logger.log(`Payload sub: ${payload.sub}`);
        this.logger.log(`Payload email: ${payload.email}`);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async registration(createUserDto: CreateUserDto) {
        const client = await this.usersService.getUserByEmail(createUserDto.email);
        this.logger.log(`st2.1 Client email: ${client?.email}`);
        this.logger.log(`st2.1 Client password: ${client?.password}`);
        if (client) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.createUser({ ...createUserDto, password: hashedPassword });
        this.logger.log(`st2.2 User email: ${user.email}`);
        this.logger.log(`st2.2 User password: ${user.password}`);
        return this.login(user);
    }

    private validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
