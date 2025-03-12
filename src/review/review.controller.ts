import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

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
