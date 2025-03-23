import { Controller, Get, Query, Render } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { Category } from '@prisma/client';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @Get()
    @Render('tutors')
    async getTutorCards(@Query('category') category?: Category) {
        const tutors = await this.tutorsService.getTutorListBySubjectCategory(category);

        return {
            title: 'Репетиторы',
            styles: ['tutors.module', 'header'],
            scripts: ['header', 'tutors'],
            mainClass: 'tutors-page',
            header: 'header',
            footer: 'footer',
            tutors,
            categories: Object.values(Category),
            selectedCategory: category || '',
        };
    }
}
