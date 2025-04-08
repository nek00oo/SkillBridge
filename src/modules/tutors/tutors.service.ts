import { Injectable } from '@nestjs/common';
import { CreateTutorCardDto } from './dto/create-tutorCard.dto';
import { Category } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { PrismaCatch } from '../../common/decorators/prisma-catch.decorator';
import { UpdateTutorCardDto } from './dto/update-tutorCard.dto';

@Injectable()
export class TutorsService {
    constructor(private readonly prisma: PrismaService) {}

    @PrismaCatch()
    async getTutorListBySubjectCategory(category?: Category, page = 1, limit = 9) {
        const skip = (page - 1) * limit;
        const where = category ? { subjectCategories: { some: { category } } } : {};

        const [tutorCards, total] = await Promise.all([
            this.prisma.tutorCard.findMany({
                where,
                skip,
                take: limit,
                include: {
                    author: { select: { firstname: true, lastname: true } },
                    subjectCategories: { select: { category: true } },
                },
            }),
            this.prisma.tutorCard.count({ where }),
        ]);

        return {
            tutors: tutorCards.map((tutor) => ({
                ...tutor,
                name: `${tutor.author.firstname} ${tutor.author.lastname}`,
                subjects: tutor.subjectCategories.map((sc) => sc.category),
            })),
            total,
        };
    }

    @PrismaCatch()
    async getTutorCardById(id: number) {
        return this.prisma.tutorCard.findUniqueOrThrow({
            where: { id },
            include: {
                subjectCategories: { select: { category: true } },
                author: { select: { firstname: true } },
            },
        });
    }

    @PrismaCatch()
    async createTutorCard(userId: number, createDto: CreateTutorCardDto) {
        const { subjectCategories, ...rest } = createDto;

        const subjectCategoryData = subjectCategories.map((category: Category) => ({
            category: category,
        }));

        return this.prisma.tutorCard.create({
            data: {
                ...rest,
                authorId: userId,
                subjectCategories: { create: subjectCategoryData },
            },
            include: {
                subjectCategories: { select: { category: true } },
            },
        });
    }

    @PrismaCatch()
    async updateTutorCardById(id: number, updateTutorCardDto: UpdateTutorCardDto) {
        const { subjectCategories, ...rest } = updateTutorCardDto;

        const subjectCategoryData = subjectCategories?.map((category: Category) => ({
            category: category,
        }));

        return this.prisma.tutorCard.update({
            where: { id: id },
            data: {
                ...rest,
                subjectCategories: { create: subjectCategoryData },
            },
            include: {
                subjectCategories: true,
            },
        });
    }

    @PrismaCatch()
    async updateTutorCardByAuthorId(authorId: number, updateTutorCardDto: UpdateTutorCardDto) {
        const { subjectCategories, ...rest } = updateTutorCardDto;

        const subjectCategoryData = subjectCategories?.map((category: Category) => ({
            category: category,
        }));

        return this.prisma.tutorCard.update({
            where: { authorId: authorId },
            data: {
                ...rest,
                subjectCategories: { create: subjectCategoryData },
            },
            include: {
                subjectCategories: true,
            },
        });
    }

    @PrismaCatch()
    async deleteTutorCardById(id: number) {
        return this.prisma.tutorCard.delete({
            where: { id: id },
        });
    }

    @PrismaCatch()
    async deleteTutorCardByAuthorId(authorId: number) {
        return this.prisma.tutorCard.delete({
            where: { authorId: authorId },
        });
    }
}
