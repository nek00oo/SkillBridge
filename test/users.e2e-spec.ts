import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaTestService } from './prisma-test.service';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';
import { setupE2eTest } from './setup-e2e';
import { Role } from '@prisma/client';

type ResponseWithUser = {
    body: UserResponseInterface;
};

interface Admin {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    role: Role;
}

interface UserResponseInterface {
    id: number;
    email: string;
    role: string;
    password?: string;
    firstname: string;
    lastname: string;
    birthDate: Date | null;
    profileImageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaTestService;
    let createUserId: number;
    let adminCookie: string;

    const testUser: CreateUserDto = {
        email: 'user_test_testuser@example.com',
        firstname: 'John',
        password: 'securepassword123',
    };

    beforeAll(async () => {
        const setup = await setupE2eTest();
        app = setup.app;
        prisma = setup.prisma;

        await prisma.cleanUserTestDatabase();

        // Регистрация
        adminCookie = await registerAdmin(app);
    });

    afterAll(async () => {
        await prisma.cleanUserTestDatabase();
        await app.close();
    });

    it('should create a new user', async () => {
        const response: ResponseWithUser = await request(app.getHttpServer())
            .post('/api/v1/users')
            .send(testUser)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(testUser.email);
        createUserId = response.body.id;
    });

    it('should get the user by ID', async () => {
        const response: ResponseWithUser = await request(app.getHttpServer())
            .get(`/api/v1/users/${createUserId}`)
            .set('Cookie', adminCookie)
            .expect(200);

        expect(response.body.id).toBe(createUserId);
        expect(response.body.firstname).toBe(testUser.firstname);
    });

    it('should update the user by ID', async () => {
        const updateDto: UpdateUserDto = { firstname: 'Johnny' };

        const response: ResponseWithUser = await request(app.getHttpServer())
            .patch(`/api/v1/users/${createUserId}`)
            .send(updateDto)
            .set('Cookie', adminCookie)
            .expect(200);

        expect(response.body.firstname).toBe(updateDto.firstname);
    });

    it('should delete the user by ID', async () => {
        const response: ResponseWithUser = await request(app.getHttpServer())
            .delete(`/api/v1/users/${createUserId}`)
            .set('Cookie', adminCookie)
            .expect(200);

        expect(response.body.id).toBe(createUserId);
    });

    it('should return 404 when getting deleted user', async () => {
        await request(app.getHttpServer()).get(`/api/v1/users/${createUserId}`).set('Cookie', adminCookie).expect(404);
    });
});

async function registerAdmin(app: INestApplication): Promise<string> {
    const admin: Admin = {
        email: 'user_test__admin888@example.com',
        firstname: 'Admin',
        lastname: 'Super',
        password: 'password123',
        role: 'ADMIN',
    };

    const res = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(admin);
    return res.headers['set-cookie'][0];
}
