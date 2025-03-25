import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { Category } from '@prisma/client';

@Controller('/api/v1/tutors')
export class ApiTutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTutorCard(@Req() req: RequestWithUser, @Body() createTutorCardDto: CreateTutorCardDto) {
        const authorId = req.user.id;
        return this.tutorsService.createTutorCard(authorId, createTutorCardDto);
    }

    @Get()
    async getTutorListBySubjectCategory(
        @Query('category') category: Category,
        @Query('page') page = 1,
        @Query('limit') limit = 12,
    ) {
        return this.tutorsService.getTutorListBySubjectCategory(category, page, limit);
    }

    @Get(':id')
    async getTutorCardById(@Param('id') id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @Patch(':id')
    async updateTutorCardById(@Param('id') authorId: number, @Body() createTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCard(authorId, createTutorCardDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateTutorCard(@Req() req: RequestWithUser, @Body() createTutorCardDto: UpdateTutorCardDto) {
        const authorId = req.user.id;
        return this.tutorsService.updateTutorCard(authorId, createTutorCardDto);
    }

    @Delete(':id')
    async deleteTutorCardById(@Param('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }
}
