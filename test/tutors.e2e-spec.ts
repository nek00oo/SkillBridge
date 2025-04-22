import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaTestService } from './prisma-test.service';
import { Category, Role } from '@prisma/client';
import { CreateTutorCardDto } from '../src/modules/tutors/dto/create-tutorCard.dto';
import { setupE2eTest } from './setup-e2e';
import { UpdateTutorCardDto } from '../src/modules/tutors/dto/update-tutorCard.dto';

type ResponseWithTutorCard = {
    body: TutorCardResponseInterface;
};

type ResponseWithTutorList = {
    body: TutorListCardResponseInterface;
};

interface TutorListCardResponseInterface {
    tutors: TutorCardResponseInterface[];
    total: number;
}

interface TutorCardResponseInterface {
    id: number;
    title: string;
    subjects: Category[];
    price: number;
    content: string;
    isPublished?: boolean;
    rating?: number;
    imgUrl: string;
    firstname?: string;
    author?: Author;
}

interface Author {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    role: Role;
}

describe('TutorsController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaTestService;
    let tutorCardId: number;
    let adminCookie: string;
    let cookie: string;

    const dto: CreateTutorCardDto = {
        title: 'Physics Help',
        price: 5,
        content: 'I explain physics in easy language.',
        subjectCategories: ['PHYSICS'],
        imgUrl: 'url/image.png',
    };

    const updateDto: UpdateTutorCardDto = {
        title: 'Advanced Physics Help',
        price: 10,
        content: 'Updated content with more details',
        subjectCategories: ['MATHEMATICS'],
        imgUrl: 'url/new-image.png',
        isPublished: true,
    };

    const author: Author = {
        email: 'tutor_card_test_tutor1@example.com',
        firstname: 'Alina1',
        lastname: 'Visnya',
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
        adminCookie = await registerAdmin(app);
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

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(dto.title);
        expect(res.body.content).toBe(dto.content);
        expect(res.body.price).toBe(dto.price.toString());
        expect(res.body.isPublished).toBe(false);
        expect(res.body.imgUrl).toBe(dto.imgUrl);
        expect(res.body.subjects).toEqual(dto.subjectCategories);
        tutorCardId = res.body.id;
    });

    it('should return the created tutor card by id', async () => {
        const res: ResponseWithTutorCard = await request(app.getHttpServer())
            .get(`/api/v1/tutors/${tutorCardId}`)
            .expect(200);

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(dto.title);
        expect(res.body.content).toBe(dto.content);
        expect(res.body.price).toBe(dto.price.toString());
        expect(res.body.isPublished).toBe(false);
        expect(res.body.subjects).toEqual(dto.subjectCategories);
        expect(res.body.imgUrl).toBe(dto.imgUrl);

        expect(res.body.firstname).toEqual(author.firstname);
    });

    it('should update tutor card by ID', async () => {
        const res: ResponseWithTutorCard = await request(app.getHttpServer())
            .patch(`/api/v1/tutors/${tutorCardId}`)
            .send(updateDto)
            .set('Cookie', adminCookie)
            .expect(200);

        expect(res.body.title).toBe(updateDto.title);
        expect(res.body.content).toBe(updateDto.content);
        expect(res.body.price).toBe(updateDto.price?.toString());
        expect(res.body.isPublished).toBe(updateDto.isPublished);
        expect(res.body.imgUrl).toBe(updateDto.imgUrl);

        expect(res.body.subjects).toEqual(dto.subjectCategories.concat(...(updateDto.subjectCategories ?? [])));
    });

    it('should return 404 for non-existent tutor card', async () => {
        await request(app.getHttpServer())
            .patch('/api/v1/tutors/999999')
            .send(updateDto)
            .set('Cookie', adminCookie)
            .expect(404);
    });

    it('should return 400 for invalid data', async () => {
        await request(app.getHttpServer())
            .patch(`/api/v1/tutors/${tutorCardId}`)
            .send({ price: -10 })
            .set('Cookie', adminCookie)
            .expect(400);
    });

    it('should delete the tutor card by id', async () => {
        await request(app.getHttpServer())
            .delete(`/api/v1/tutors/${tutorCardId}`)
            .set('Cookie', adminCookie)
            .expect(200);

        await request(app.getHttpServer()).get(`/api/v1/tutors/${tutorCardId}`).set('Cookie', adminCookie).expect(404);
    });

    it('should delete tutor card by author ID', async () => {
        // Регистрация
        const registration = await request(app.getHttpServer()).post('/api/v1/auth/registration').send({
            email: 'tutor_card_test_tutor2@example.com',
            firstname: 'Alina2',
            password: 'password123',
            role: 'TUTOR',
        });

        const currentCookie = registration.headers['set-cookie'][0];

        await request(app.getHttpServer()).post('/api/v1/tutors').set('Cookie', currentCookie).send(dto);
        await request(app.getHttpServer()).delete('/api/v1/tutors').set('Cookie', currentCookie).expect(200);
        // Проверяем что карточки больше нет
        await request(app.getHttpServer()).delete('/api/v1/tutors').set('Cookie', currentCookie).expect(404);
    });
});

describe('GET /api/v1/tutors (filter by category)', () => {
    let app: INestApplication;
    let prisma: PrismaTestService;

    const authorDto3: Author = {
        email: 'tutor_card_test_tutor3@example.com',
        firstname: 'Alina3',
        lastname: 'Yakovenko',
        password: 'password123',
        role: 'TUTOR',
    };

    const cardDto3 = {
        title: 'Physics and Math Tutor',
        price: 5,
        content: 'I explain physics in easy language.',
        imgUrl: 'url/image.png',
        subjectCategories: ['PHYSICS', 'MATHEMATICS'],
    };

    const authorDto4: Author = {
        email: 'tutor_card_test_tutor4@example.com',
        firstname: 'Alina4',
        lastname: 'Yakovenko',
        password: 'password123',
        role: 'TUTOR',
    };

    const cardDto4 = {
        title: 'Physics Only Tutor',
        price: 5,
        content: 'I explain physics in easy language.',
        imgUrl: 'url/image.png',
        subjectCategories: ['PHYSICS'],
    };

    const authorDto5: Author = {
        email: 'tutor_card_test_tutor5@example.com',
        firstname: 'Alina5',
        lastname: 'Yakovenko',
        password: 'password123',
        role: 'TUTOR',
    };

    const cardDto5 = {
        title: 'Chemistry Tutor',
        price: 5,
        content: 'I explain physics in easy language.',
        imgUrl: 'url/image.png',
        subjectCategories: ['CHEMISTRY'],
    };

    beforeAll(async () => {
        const setup = await setupE2eTest();
        app = setup.app;
        prisma = setup.prisma;

        await prisma.cleanTutorCardTestDatabase();

        const registration3 = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(authorDto3);

        const cookie3 = registration3.headers['set-cookie'][0];

        const registration4 = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(authorDto4);

        const cookie4 = registration4.headers['set-cookie'][0];

        const registration5 = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(authorDto5);

        const cookie5 = registration5.headers['set-cookie'][0];

        // Создаем несколько карточек с разными категориями
        await Promise.all([
            // Физика + Математика
            request(app.getHttpServer()).post('/api/v1/tutors').set('Cookie', cookie3).send(cardDto3),

            // Только Физика
            request(app.getHttpServer()).post('/api/v1/tutors').set('Cookie', cookie4).send(cardDto4),

            // Химия
            request(app.getHttpServer()).post('/api/v1/tutors').set('Cookie', cookie5).send(cardDto5),
        ]);
    });

    afterAll(async () => {
        await prisma.cleanTutorCardTestDatabase();
        await app.close();
    });

    it('should return all tutor cards when no category specified', async () => {
        const res: ResponseWithTutorList = await request(app.getHttpServer()).get('/api/v1/tutors').expect(200);

        expect(res.body.tutors.length).toBe(3);
        expect(res.body.total).toBe(3);
    });

    it('should filter by PHYSICS category', async () => {
        const res: ResponseWithTutorList = await request(app.getHttpServer())
            .get('/api/v1/tutors')
            .query({ category: 'PHYSICS' })
            .expect(200);

        expect(res.body.tutors.length).toBe(2);
        expect(res.body.total).toBe(2);
        expect(res.body.tutors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: cardDto3.title }),
                expect.objectContaining({ title: cardDto4.title }),
            ]),
        );
    });

    it('should filter by CHEMISTRY category', async () => {
        const res: ResponseWithTutorList = await request(app.getHttpServer())
            .get('/api/v1/tutors')
            .query({ category: 'CHEMISTRY' })
            .expect(200);

        expect(res.body.tutors.length).toBe(1);
        expect(res.body.total).toBe(1);
        expect(res.body.tutors[0].title).toBe(cardDto5.title);
        expect(res.body.tutors[0].author?.firstname).toBe(authorDto5.firstname);
        expect(res.body.tutors[0].author?.lastname).toBe(authorDto5.lastname);

        expect(res.body.tutors[0].subjects).toEqual(cardDto5.subjectCategories);
    });

    it('should return empty array for non-existent category', async () => {
        const res: ResponseWithTutorList = await request(app.getHttpServer())
            .get('/api/v1/tutors')
            .query({ category: 'BIOLOGY' })
            .expect(200);

        expect(res.body.tutors.length).toBe(0);
        expect(res.body.total).toBe(0);
    });
});

async function registerAdmin(app: INestApplication): Promise<string> {
    const admin: Author = {
        email: 'tutor_card_test_admin@example.com',
        firstname: 'Admin',
        lastname: 'Super',
        password: 'password123',
        role: 'ADMIN',
    };

    const res = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(admin);
    return res.headers['set-cookie'][0];
}
