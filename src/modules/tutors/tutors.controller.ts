import { Controller, Get, Query, Render } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { Category } from '@prisma/client';
import { Pagination } from '../../common/types/pagination';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @Get()
    @Render('tutors')
    async getTutorCards(
        @Query('category') category?: Category,
        @Query('page') page = '1',
        @Query('limit') limit = '12',
    ) {
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 9;

        const { tutors, total } = await this.tutorsService.getTutorListBySubjectCategory(
            category,
            parsedPage,
            parsedLimit,
        );

        const totalPages = Math.ceil(total / parsedLimit);

        const pagination: Pagination = {
            prev: parsedPage > 1 ? parsedPage - 1 : null,
            next: parsedPage < totalPages ? parsedPage + 1 : null,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1),
            current: parsedPage,
        };

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
            pagination: pagination,
        };
    }
}
