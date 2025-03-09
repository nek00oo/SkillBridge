import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { Category } from '@prisma/client';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @Post('/add')
    async createTutorCard(@Body() createTutorCardDto: CreateTutorCardDto) {
        const authorId: number = 1; //TODO Будем брать из токена
        return this.tutorsService.createTutorCard(authorId, createTutorCardDto);
    }

    @Get()
    @Render('tutors')
    getTutorCards() {
        return { tutors: this.tutorsService.getAllTutorCards() };
    }

    @Get('filter')
    async getTutorListBySubjectCategory(@Query('category') category: Category) {
        return this.tutorsService.getTutorListBySubjectCategory(category);
    }

    @Get(':id')
    async getTutorCardById(@Param('id') id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @Patch(':id/edit')
    async updateTutorCard(@Param('id') id: number, @Body() createTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCard(id, createTutorCardDto);
    }

    @Delete(':id')
    async deleteTutorCardById(@Param('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }
}
