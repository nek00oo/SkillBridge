import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TutorsService } from './tutors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { CreateTutorCardDto } from './dto/create-tutorCard.dto';
import { UpdateTutorCardDto } from './dto/update-tutorCard.dto';
import { Category } from '@prisma/client';

@ApiTags('Tutors')
@Controller('/api/v1/tutors')
export class ApiTutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a tutor card' })
    @ApiBody({ type: CreateTutorCardDto })
    @ApiResponse({ status: 201, description: 'Tutor card successfully created.' })
    @ApiResponse({
        status: 400,
        description:
            'Invalid data provided or value too long/invalid (e.g. P2000, P2004, P2005, P2006, P2007, P2008, P2009, P2011, P2012, P2013, P2016, P2017, P2018, P2019, P2020, P2023).',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict error due to unique constraint or foreign key constraint failure (e.g. P2002, P2003).',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error during query execution (e.g. P2010, P2024, P2027).',
    })
    @Post()
    @UseGuards(JwtAuthGuard)
    async createTutorCard(@Req() req: RequestWithUser, @Body() createTutorCardDto: CreateTutorCardDto) {
        return this.tutorsService.createTutorCard(req.user.id, createTutorCardDto);
    }

    @ApiOperation({ summary: 'Get list of tutor cards by subject category' })
    @ApiQuery({ name: 'category', required: false, description: 'Subject category', enum: Category })
    @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', example: 12 })
    @ApiResponse({
        status: 200,
        description: 'List of tutor cards retrieved successfully.',
        type: [CreateTutorCardDto],
    })
    @ApiResponse({ status: 400, description: 'Invalid query parameters provided.' })
    @ApiResponse({ status: 404, description: 'No tutor cards found matching the criteria.' })
    @ApiResponse({ status: 500, description: 'Internal server error during retrieval.' })
    @Get()
    async getTutorListBySubjectCategory(
        @Query('category') category: Category,
        @Query('page') page = 1,
        @Query('limit') limit = 12,
    ) {
        return this.tutorsService.getTutorListBySubjectCategory(category, page, limit);
    }

    @ApiOperation({ summary: 'Get a tutor card by ID' })
    @ApiResponse({
        status: 200,
        description: 'Tutor card retrieved successfully.',
        type: CreateTutorCardDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid ID provided.' })
    @ApiResponse({ status: 404, description: 'Tutor card not found (e.g. P2001, P2015, P2018, P2025).' })
    @ApiResponse({ status: 500, description: 'Internal server error during retrieval.' })
    @Get(':id')
    async getTutorCardById(@Param('id') id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @ApiOperation({ summary: 'Update a tutor card by ID' })
    @ApiBody({ type: UpdateTutorCardDto })
    @ApiResponse({ status: 200, description: 'Tutor card updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided for update.' })
    @ApiResponse({ status: 404, description: 'Tutor card not found (e.g. P2001, P2015, P2018, P2025).' })
    @ApiResponse({
        status: 409,
        description: 'Conflict error due to unique or foreign key constraint failure during update.',
    })
    @ApiResponse({ status: 500, description: 'Internal server error during update.' })
    @Patch(':id')
    async updateTutorCardById(@Param('id') id: number, @Body() updateTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCardById(id, updateTutorCardDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a tutor card by author ID' })
    @ApiBody({ type: UpdateTutorCardDto })
    @ApiResponse({ status: 200, description: 'Tutor card updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided for update.' })
    @ApiResponse({ status: 404, description: 'Tutor card not found for the given author.' })
    @ApiResponse({
        status: 409,
        description: 'Conflict error due to unique or foreign key constraint failure during update.',
    })
    @ApiResponse({ status: 500, description: 'Internal server error during update.' })
    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateTutorCardByAuthorId(@Req() req: RequestWithUser, @Body() updateTutorCardDto: UpdateTutorCardDto) {
        return this.tutorsService.updateTutorCardByAuthorId(req.user.id, updateTutorCardDto);
    }

    @ApiOperation({ summary: 'Delete a tutor card by ID' })
    @ApiResponse({ status: 200, description: 'Tutor card deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Tutor card not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error during deletion.' })
    @Delete(':id')
    async deleteTutorCardById(@Param('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a tutor card by author ID' })
    @ApiResponse({ status: 200, description: 'Tutor card deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Tutor card not found for the given author.' })
    @ApiResponse({ status: 500, description: 'Internal server error during deletion.' })
    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteTutorCardByAuthorId(@Req() req: RequestWithUser) {
        return this.tutorsService.deleteTutorCardByAuthorId(req.user.id);
    }
}
