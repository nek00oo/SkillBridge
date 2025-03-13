import { Controller, Post, UseGuards, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Req() req: RequestWithUser, @Res() res: Response) {
        const { access_token } = this.authService.login(req.user);

        res.cookie('authToken', access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });

        return res.status(200).json({ message: 'Authenticated successfully' });
    }

    @Post('/registration')
    async registration(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const { access_token } = await this.authService.registration(createUserDto);

        res.cookie('authToken', access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });

        return res.status(200).json({ message: 'Authenticated successfully' });
    }
}
