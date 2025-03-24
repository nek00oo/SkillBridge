import { Controller, Post, UseGuards, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser';

@Controller('api/v1/auth')
export class ApiAuthController {
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
}
