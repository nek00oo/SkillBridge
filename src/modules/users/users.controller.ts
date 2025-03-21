import { Controller, Get, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { UnauthorizedRedirectFilter } from '../auth/filters/unauthorized-redirect.filter';

@Controller('profile')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @UseFilters(UnauthorizedRedirectFilter)
    @UseGuards(JwtAuthGuard)
    @Get()
    @Render('profile')
    async getProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        const user = await this.userService.getUserById(userId);
        return {
            title: 'Профиль',
            styles: ['profile', 'header', 'iziToast.min'],
            scripts: ['profile', 'header', 'iziToast.min'],
            mainClass: 'profile-section',
            header: 'header',
            user,
        };
    }
}
