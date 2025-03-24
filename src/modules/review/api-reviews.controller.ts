import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('/api/v1/reviews')
export class ApiReviewsController {
    constructor(private readonly reviewService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(@Req() req: RequestWithUser, @Body() createReviewDto: CreateReviewDto) {
        const studentId = req.user.id;
        return this.reviewService.createReview(studentId, createReviewDto);
    }

    @Get(':id')
    async findReviewById(@Param('id') id: number) {
        return this.reviewService.findReviewById(id);
    }

    @Get('students/:studentId')
    async findReviewByStudentId(@Param('studentId') studentId: number) {
        return this.reviewService.findReviewByStudentId(studentId);
    }

    @Get('cards/:cardId')
    async findReviewsByCardId(@Param('cardId') cardId: number) {
        return this.reviewService.findReviewsByCardId(cardId);
    }

    @Patch(':id')
    async updateReview(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.updateReviewById(id, updateReviewDto);
    }

    @Delete(':id')
    async removeReview(@Param('id') id: number) {
        return this.reviewService.removeReviewById(id);
    }
}
