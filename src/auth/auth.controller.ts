import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Req() req: RequestWithUser) {
        return this.authService.login(req.user);
    }

    @Post('/registration')
    async registration(@Body() createUserDto: CreateUserDto) {
        return this.authService.registration(createUserDto);
    }
}
