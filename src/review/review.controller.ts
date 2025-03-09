import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    async createReview(@Body() createReviewDto: CreateReviewDto) {
        const studentId: number = 1; //TODO из токена
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
