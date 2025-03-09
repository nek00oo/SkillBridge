import { Controller, Post, UseGuards, Request, Get, Logger, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('/registration')
    async registration(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`st1 CrUser email: ${createUserDto.email}`);
        this.logger.log(`st1 CrUser password: ${createUserDto.password}`);
        return this.authService.registration(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/aboba')
    getAboba(@Request() req) {
        return 'Hello World!';
    }
}
