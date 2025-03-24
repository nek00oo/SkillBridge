import { Controller, Render, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
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
