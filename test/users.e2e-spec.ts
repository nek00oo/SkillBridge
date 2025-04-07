import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaTestService } from './prisma-test.service';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';
import { setupE2eTest } from './setup-e2e';

type ResponseWithUser = {
    body: UserResponseInterface;
};

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
    let createdUserId: number;

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
        createdUserId = response.body.id;
    });

    it('should get the created user by ID', async () => {
        const response: ResponseWithUser = await request(app.getHttpServer())
            .get(`/api/v1/users/${createdUserId}`)
            .expect(200);

        expect(response.body.id).toBe(createdUserId);
        expect(response.body.firstname).toBe(testUser.firstname);
    });

    it('should update the user by ID', async () => {
        const updateDto: UpdateUserDto = { firstname: 'Johnny' };

        const response: ResponseWithUser = await request(app.getHttpServer())
            .patch(`/api/v1/users/${createdUserId}`)
            .send(updateDto)
            .expect(200);

        expect(response.body.firstname).toBe(updateDto.firstname);
    });

    it('should delete the user by ID', async () => {
        const response: ResponseWithUser = await request(app.getHttpServer())
            .delete(`/api/v1/users/${createdUserId}`)
            .expect(200);

        expect(response.body.id).toBe(createdUserId);
    });

    it('should return 404 when getting deleted user', async () => {
        await request(app.getHttpServer()).get(`/api/v1/users/${createdUserId}`).expect(404);
    });
});
