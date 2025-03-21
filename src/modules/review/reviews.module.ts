import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiReviewsController } from './api-reviews.controller';
import { PrismaService } from '../../prisma.service';

@Module({
    controllers: [ApiReviewsController],
    providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
