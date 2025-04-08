import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaTestService } from './prisma-test.service';
import { Category, Role } from '@prisma/client';
import { CreateTutorCardDto } from '../src/modules/tutors/dto/create-tutorCard.dto';
import { setupE2eTest } from './setup-e2e';

type ResponseWithTutorCard = {
    body: TutorCardResponseInterface;
};

interface TutorCardResponseInterface {
    id: number;
    title: string;
    subjectCategories: Category[];
    price: number;
    content: string;
    isPublished?: boolean;
    rating?: number;
    imgUrl: string;
    author?: Author;
}

interface Author {
    email: string;
    firstname: string;
    password: string;
    role: Role;
}

describe('TutorsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaTestService;
    let tutorCardId: number;
    let cookie: string;

    const dto: CreateTutorCardDto = {
        title: 'Physics Help',
        price: 5,
        content: 'I explain physics in easy language.',
        subjectCategories: ['PHYSICS'],
        imgUrl: 'url/image.png',
    };

    const author: Author = {
        email: 'tutor_card_test_tutor@example.com',
        firstname: 'Anya',
        password: 'password123',
        role: 'TUTOR',
    };

    beforeAll(async () => {
        const setup = await setupE2eTest();
        app = setup.app;
        prisma = setup.prisma;

        await prisma.cleanTutorCardTestDatabase();

        // Регистрация
        const registrationRes = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(author);

        cookie = registrationRes.headers['set-cookie'][0];
    });

    afterAll(async () => {
        await prisma.cleanTutorCardTestDatabase();
        await app.close();
    });

    it('should create a tutor card', async () => {
        const res: ResponseWithTutorCard = await request(app.getHttpServer())
            .post('/api/v1/tutors')
            .set('Cookie', cookie)
            .send(dto)
            .expect(201);

        const expectedCategories = dto.subjectCategories.map((category) => ({ category }));

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(dto.title);
        expect(res.body.content).toBe(dto.content);
        expect(res.body.price).toBe('5');
        expect(res.body.isPublished).toBe(false);
        expect(res.body.imgUrl).toBe(dto.imgUrl);
        expect(res.body.subjectCategories).toEqual(expectedCategories);
        tutorCardId = res.body.id;
    });

    it('should return the created tutor card by id', async () => {
        const res: ResponseWithTutorCard = await request(app.getHttpServer())
            .get(`/api/v1/tutors/${tutorCardId}`)
            .expect(200);

        const expectedCategories = dto.subjectCategories.map((category) => ({ category }));

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(dto.title);
        expect(res.body.content).toBe(dto.content);
        expect(res.body.price).toBe('5');
        expect(res.body.isPublished).toBe(false);
        expect(res.body.subjectCategories).toEqual(expectedCategories);
        expect(res.body.imgUrl).toBe(dto.imgUrl);

        expect(res.body.author?.firstname).toEqual(author.firstname);
    });

    it('should delete the tutor card by id', async () => {
        await request(app.getHttpServer()).delete(`/api/v1/tutors/${tutorCardId}`).expect(200);

        await request(app.getHttpServer()).get(`/api/v1/tutors/${tutorCardId}`).expect(404);
    });
});
