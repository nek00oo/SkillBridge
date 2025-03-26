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
        return this.tutorsService.createTutorCard(req.user.id, createTutorCardDto);
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
    async updateTutorCardById(@Param('id') id: number, @Body() createTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCardById(id, createTutorCardDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async updateTutorCardByAuthorId(@Req() req: RequestWithUser, @Body() createTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCardByAuthorId(req.user.id, createTutorCardDto);
    }

    @Delete(':id')
    async deleteTutorCardById(@Param('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteTutorCardByAuthorId(@Req() req: RequestWithUser) {
        return this.tutorsService.deleteTutorCardByAuthorId(req.user.id);
    }
}
