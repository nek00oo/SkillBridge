import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Render, Req, UseGuards } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { Category } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async createTutorCard(@Req() req: RequestWithUser, @Body() createTutorCardDto: CreateTutorCardDto) {
        const authorId = req.user.id;
        return this.tutorsService.createTutorCard(authorId, createTutorCardDto);
    }

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

    @Get('filter')
    async getTutorListBySubjectCategory(@Query('category') category: Category) {
        return this.tutorsService.getTutorListBySubjectCategory(category);
    }

    @Get(':id')
    async getTutorCardById(@Param('id') id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/edit')
    async updateTutorCard(@Req() req: RequestWithUser, @Body() createTutorCardDto: UpdateTutorCardDto) {
        const authorId = req.user.id;
        return this.tutorsService.updateTutorCard(authorId, createTutorCardDto);
    }

    @Delete(':id')
    async deleteTutorCardById(@Param('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }
}
