import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { PrismaService } from '../prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class TutorsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllTutorCard() {
        const tutors = await this.prisma.tutorCard.findMany({
            include: {
                author: {
                    select: {
                        firstname: true,
                        lastname: true,
                    },
                },
                subjectCategories: {
                    select: {
                        category: true,
                    },
                },
            },
        });

        return tutors.map((tutor) => ({
            ...tutor,
            name: `${tutor.author.firstname} ${tutor.author.lastname}`,
            subject: tutor.subjectCategories.map((sc) => sc.category).join(', '),
        }));
    }

    async getTutorCardById(id: number) {
        const tutorCard = await this.prisma.tutorCard.findUnique({
            where: { id: id },
            include: {
                subjectCategories: true,
                author: true,
            },
        });
        if (!tutorCard) {
            throw new NotFoundException(`Tutor card with ID ${id} not found`);
        }
        return tutorCard;
    }

    async getTutorListBySubjectCategory(category: Category) {
        const tutorCards = await this.prisma.tutorCard.findMany({
            where: {
                subjectCategories: {
                    some: {
                        category: category,
                    },
                },
            },
            include: {
                subjectCategories: true,
                author: true,
            },
        });

        if (!tutorCards.length) {
            throw new NotFoundException(`No tutor cards found for category ${category}`);
        }

        return tutorCards;
    }

    async createTutorCard(userId: number, createDto: CreateTutorCardDto) {
        const { subjectCategories, ...rest } = createDto;

        const subjectCategoryData = subjectCategories.map((category: Category) => ({
            category: category,
        }));

        try {
            return this.prisma.tutorCard.create({
                data: {
                    ...rest,
                    authorId: userId,
                    subjectCategories: { create: subjectCategoryData },
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid data provided');
            }
            throw error;
        }
    }

    async updateTutorCard(id: number, updateTutorCardDto: UpdateTutorCardDto) {
        const { subjectCategories, ...rest } = updateTutorCardDto;

        const subjectCategoryData = subjectCategories?.map((category: Category) => ({
            category: category,
        }));

        //TODO проверить, что subjectCategories не обнулится и не перезапишется
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

    //TODO Мб ловить ошибки через interceptors
    async deleteTutorCardById(id: number) {
        try {
            return this.prisma.tutorCard.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Tutor card with ID ${id} not found`);
            }
            throw error;
        }
    }
}
