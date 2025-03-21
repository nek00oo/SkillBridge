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
        const tutorId: number = 1; //TODO из карточки, куда оставляют отзыв
        return this.reviewService.createReview(studentId, tutorId, createReviewDto);
    }

    @Get(':id')
    async findReview(@Param('id') id: number) {
        return this.reviewService.findReviewByStudentId(id);
    }

    @Patch(':id/edit')
    async updateReview(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
        return this.reviewService.updateReviewById(id, updateReviewDto);
    }

    @Delete(':id')
    async removeReview(@Param('id') id: number) {
        return this.reviewService.removeReviewById(id);
    }
}
