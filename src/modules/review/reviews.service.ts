import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) {}

    async createReview(studentId: number, tutorId: number, createReviewDto: CreateReviewDto) {
        return this.prisma.review.create({
            data: {
                ...createReviewDto,
                studentId: studentId,
                tutorId: tutorId,
            },
        });
    }

    async findReviewByStudentId(studentId: number) {
        return this.prisma.review.findMany({
            where: { studentId: studentId },
        });
    }

    async updateReviewById(id: number, updateReviewDto: UpdateReviewDto) {
        return this.prisma.review.update({
            where: { id: id },
            data: updateReviewDto,
        });
    }

    async removeReviewById(id: number) {
        return this.prisma.review.delete({
            where: { id: id },
        });
    }
}
