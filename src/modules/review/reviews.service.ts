import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../../prisma.service';
import { PrismaCatch } from '../../common/decorators/prisma-catch.decorator';

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) {}

    @PrismaCatch()
    async createReview(studentId: number, createReviewDto: CreateReviewDto) {
        const review = await this.prisma.review.create({
            data: {
                ...createReviewDto,
                studentId: studentId,
            },
            include: {
                student: { select: { firstname: true, lastname: true } },
            },
        });

        const { student, ...rest } = review;

        return {
            ...rest,
            firstname: student.firstname,
            lastname: student.lastname,
        };
    }

    @PrismaCatch()
    async findReviewById(id: number) {
        return this.prisma.review.findUniqueOrThrow({
            where: { id: id },
        });
    }

    @PrismaCatch()
    async findReviewsByStudentId(studentId: number) {
        return this.prisma.review.findMany({
            where: { studentId: studentId },
        });
    }

    @PrismaCatch()
    async findReviewsByCardId(cardId: number) {
        const reviews = await this.prisma.review.findMany({
            where: { cardId },
            include: {
                student: { select: { firstname: true, lastname: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return reviews.map(({ student, ...rest }) => {
            return {
                ...rest,
                firstname: student.firstname,
                lastname: student.lastname,
            };
        });
    }

    @PrismaCatch()
    async updateReviewById(id: number, updateReviewDto: UpdateReviewDto) {
        return this.prisma.review.update({
            where: { id: id },
            data: updateReviewDto,
        });
    }

    @PrismaCatch()
    async removeReviewById(id: number) {
        return this.prisma.review.delete({
            where: { id: id },
        });
    }
}
