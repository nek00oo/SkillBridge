import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { CacheControl } from '../../common/decorators/cache-control.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UnauthorizedRedirectFilter } from '../auth/filters/unauthorized-redirect.filter';

@ApiTags('Reviews')
@Controller('/api/v1')
export class ApiReviewsController {
    constructor(private readonly reviewService: ReviewsService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new review' })
    @ApiBody({ type: CreateReviewDto })
    @ApiResponse({ status: 201, description: 'Review successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided (e.g. P2000, P2007, P2012).' })
    @ApiResponse({ status: 409, description: 'Conflict error (e.g. unique constraint failure).' })
    @ApiResponse({ status: 500, description: 'Internal server error during review creation.' })
    @UseGuards(JwtAuthGuard)
    @Post('reviews')
    async createReview(@Req() req: RequestWithUser, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewService.createReview(req.user.id, createReviewDto);
    }

    @ApiOperation({ summary: 'Get a review by its ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
    @ApiResponse({ status: 200, description: 'Review retrieved successfully.', type: CreateReviewDto })
    @ApiResponse({ status: 404, description: 'Review not found (e.g. P2001, P2025).' })
    @ApiResponse({ status: 500, description: 'Internal server error during retrieval.' })
    @CacheControl('public', 360)
    @Get('reviews/:id')
    async getReviewById(@Param('id') id: number) {
        return this.reviewService.findReviewById(id);
    }

    @ApiOperation({ summary: 'Get reviews by student ID' })
    @ApiParam({ name: 'studentId', type: Number, description: 'Student ID' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.', type: [CreateReviewDto] })
    @ApiResponse({ status: 404, description: 'No reviews found for the given student.' })
    @ApiResponse({ status: 500, description: 'Internal server error during retrieval.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('students/:studentId/reviews')
    async getReviewsByStudentId(@Param('studentId') studentId: number) {
        return this.reviewService.findReviewsByStudentId(studentId);
    }

    @ApiOperation({ summary: 'Get reviews by tutor card ID' })
    @ApiParam({ name: 'cardId', type: Number, description: 'Tutor card ID' })
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.', type: [CreateReviewDto] })
    @ApiResponse({ status: 404, description: 'No reviews found for the given tutor card.' })
    @ApiResponse({ status: 500, description: 'Internal server error during retrieval.' })
    @Get('tutor-cards/:cardId/reviews')
    async getReviewsByCardId(@Param('cardId') cardId: number) {
        return this.reviewService.findReviewsByCardId(cardId);
    }

    @ApiOperation({ summary: 'Update a review by its ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
    @ApiBody({ type: UpdateReviewDto })
    @ApiResponse({ status: 200, description: 'Review updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided for update.' })
    @ApiResponse({ status: 404, description: 'Review not found.' })
    @ApiResponse({ status: 409, description: 'Conflict error during update.' })
    @ApiResponse({ status: 500, description: 'Internal server error during update.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('reviews/:id')
    async updateReviewById(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.updateReviewById(id, updateReviewDto);
    }

    @ApiOperation({ summary: 'Delete a review by its ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Review ID' })
    @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Review not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error during deletion.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('reviews/:id')
    async deleteReviewById(@Param('id') id: number) {
        return this.reviewService.removeReviewById(id);
    }
}
