import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTutorCardDto, UpdateTutorCardDto } from './dto/create-tutorCard.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TutorsService {
    constructor(private readonly prisma: PrismaService) {}

    private tutors = [
        {
            id: 1,
            name: 'Анна Петрова',
            subject: 'Математика',
            description: 'Опытный преподаватель',
            price: 900,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 2,
            name: 'Алина Беренцева',
            subject: 'Физика',
            description: 'Кандидат физико-математических наук. Индивидуальный подход к каждому ученику.',
            price: 2100,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 3,
            name: 'Елена Смирнова',
            subject: 'Английский язык',
            description: 'Сертифицированный преподаватель IELTS и TOEFL. Разговорный английский.',
            price: 1800,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 4,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },

        {
            id: 5,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 6,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 7,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 8,
            name: 'Михаил Козлов',
            subject: 'Химия',
            description: 'Преподаватель высшей категории. Подготовка к олимпиадам и экзаменам.',
            price: 1700,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        },
    ];

    getAllTutorCards() {
        return this.tutors;
    }

    async getTutorCardById(id: number) {
        const tutorCard = await this.prisma.tutorCard.findUnique({
            where: { id: id },
        });
        if (!tutorCard) {
            throw new NotFoundException(`Tutor card with ID ${id} not found`);
        }
        return tutorCard;
    }

    async createTutorCard(userId: number, createDto: CreateTutorCardDto) {
        return this.prisma.tutorCard.create({
            data: {
                ...createDto,
                authorId: userId, //TODO Установим из токена
                price: new Prisma.Decimal(createDto.price),
                rating: createDto.rating,
            },
        });
    }

    async updateTutorCard(id: number, updateTutorCardDto: UpdateTutorCardDto) {
        const { rating, price, ...rest } = updateTutorCardDto;

        return this.prisma.tutorCard.update({
            where: { id: id },
            data: {
                ...rest,
                price: price !== undefined ? new Prisma.Decimal(price) : undefined,
                rating: rating !== undefined ? new Prisma.Decimal(rating) : undefined,
                imgUrl: updateTutorCardDto.imgUrl || null,
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
