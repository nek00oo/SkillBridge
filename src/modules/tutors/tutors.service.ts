import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TutorsService {
    constructor(private readonly prisma: PrismaService) {}

    async getTutorListBySubjectCategory(category?: Category) {
        const tutorCards = await this.prisma.tutorCard.findMany({
            where: category ? { subjectCategories: { some: { category } } } : undefined,
            include: {
                author: { select: { firstname: true, lastname: true } },
                subjectCategories: { select: { category: true } },
            },
        });

        return tutorCards.map((tutor) => ({
            ...tutor,
            name: `${tutor.author.firstname} ${tutor.author.lastname}`,
            subjects: tutor.subjectCategories.map((sc) => sc.category), // Изменили field name и структуру
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

    async updateTutorCard(authorId: number, updateTutorCardDto: UpdateTutorCardDto) {
        const { subjectCategories, ...rest } = updateTutorCardDto;

        const subjectCategoryData = subjectCategories?.map((category: Category) => ({
            category: category,
        }));

        //TODO проверить, что subjectCategories не обнулится и не перезапишется
        //TODO Нужно сверять с id автора, а не как сейчас, с id карточки
        return this.prisma.tutorCard.update({
            where: { id: authorId },
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
                where: { id: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Tutor card with ID ${id} not found`);
            }
            throw error;
        }
    }
}
