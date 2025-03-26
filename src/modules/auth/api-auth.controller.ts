import { Controller, Post, UseGuards, Body, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from './interfaces/requestWithUser';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class ApiAuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'User login' })
    @ApiBody({
        description: 'User credentials',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'strongPassword123' },
            },
            required: ['email', 'password'],
        },
    })
    @ApiResponse({ status: 200, description: 'Authenticated successfully. Auth token is set in cookie.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
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

    @ApiOperation({ summary: 'User registration' })
    @ApiBody({ type: CreateUserDto, description: 'User registration data' })
    @ApiResponse({ status: 200, description: 'Authenticated successfully. Auth token is set in cookie.' })
    @ApiResponse({ status: 400, description: 'User already exists or invalid data provided.' })
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
