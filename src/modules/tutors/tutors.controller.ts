import { Controller, Get, Render } from '@nestjs/common';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @Get()
    @Render('tutors')
    async getTutorCards() {
        return {
            title: 'Репетиторы',
            styles: ['tutors.module', 'header'],
            scripts: ['header'],
            mainClass: 'tutors-page',
            header: 'header',
            footer: 'footer',
            tutors: await this.tutorsService.getAllTutorCard(),
        };
    }
}
