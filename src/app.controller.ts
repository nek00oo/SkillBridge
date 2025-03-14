import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('index')
    getHome() {
        return {
            title: 'SkillBridge',
            styles: ['index.module'],
            scripts: ['main_page'],
            mainClass: 'main',
            header: 'header_main',
            footer: 'footer',
        };
    }
}
