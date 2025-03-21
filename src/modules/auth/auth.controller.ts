import { Controller, Post, UseGuards, Body, Req, Res, Render, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    login(@Req() req: RequestWithUser, @Res() res: Response) {
        const { access_token } = this.authService.login(req.user);

        res.cookie('authToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Authenticated successfully' });
    }

    @Post('/registration')
    async registration(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const { access_token } = await this.authService.registration(createUserDto);

        res.cookie('authToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: 'Authenticated successfully' });
    }

    @Get()
    @Render('login')
    getAuth() {
        return {
            title: 'Login',
            styles: ['login.module', 'response', 'iziToast.min'],
            scripts: ['login', 'registration', 'iziToast.min'],
            mainClass: 'auth',
        };
    }

    @Render('register_mobile')
    @Get('register_mobile')
    getRegisterForMobile() {
        return {
            title: 'Register',
            styles: ['register_mobile', 'response', 'iziToast.min'],
            scripts: ['registration', 'iziToast.min'],
            mainClass: 'sign-up',
        };
    }
}
