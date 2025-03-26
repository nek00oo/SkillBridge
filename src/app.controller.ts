import { Controller, Get, Render, Req } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { RequestWithCookies } from './modules/auth/interfaces/requestWithCookies';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @Render('index')
    async getHome(@Req() req: RequestWithCookies) {
        const isAuthenticated = await this.authService.IsAuthenticated(req);

        return {
            title: 'SkillBridge',
            styles: ['index.module'],
            scripts: ['main_page'],
            mainClass: 'home-page',
            header: 'header_main',
            footer: 'footer',
            authButtonLabel: isAuthenticated ? 'Профиль' : 'Войти',
            authButtonLink: isAuthenticated ? '/profile' : '/auth',
        };
    }
}
