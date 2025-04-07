import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaTestService } from './prisma-test.service';
// import { execSync } from 'child_process';
import { setupE2eTest } from './setup-e2e';

type ResponseBody = { message: string };

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaTestService;

    beforeAll(async () => {
        // try {
        //     execSync('npm run db:test:push', { stdio: 'inherit' });
        // } catch (err) {
        //     console.error('❌ Failed to push test DB schema', err);
        //     throw err;
        // }

        const setup = await setupE2eTest();
        app = setup.app;
        prisma = setup.prisma;

        await prisma.cleanAuthTestDatabase();
    });

    beforeEach(async () => {
        await prisma.cleanAuthTestDatabase();
    });

    afterAll(async () => {
        await prisma.cleanAuthTestDatabase();
        await app.close();
    });

    const user = {
        email: 'auth_test_e2euser@example.com',
        firstname: 'E2ETest',
        password: 'qwe123',
    };

    it('should register a new user and set authToken cookie', async () => {
        // Act
        const response = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(user).expect(200);
        const body: ResponseBody = response.body as { message: string };

        const rawCookies = response.headers['set-cookie'];
        const setCookie: string[] = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

        // Assert
        expect(body.message).toBe('Authenticated successfully');
        expect(setCookie).toBeDefined();
        expect(setCookie.some((c) => c.startsWith('authToken='))).toBe(true);
    });

    it('should login an existing user and set authToken cookie', async () => {
        // Arrange
        const registration_response = await request(app.getHttpServer())
            .post('/api/v1/auth/registration')
            .send(user)
            .expect(200);
        const registration_body: ResponseBody = registration_response.body as { message: string };

        // Act
        const login_response = await request(app.getHttpServer())
            .post('/api/v1/auth/login')
            .send({ email: user.email, password: user.password })
            .expect(200);

        const body: ResponseBody = login_response.body as { message: string };
        const rawCookies = login_response.headers['set-cookie'];
        const setCookie: string[] = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

        // Assert
        expect(registration_body.message).toBe('Authenticated successfully');
        expect(body.message).toBe('Authenticated successfully');
        expect(setCookie).toBeDefined();
        expect(setCookie.some((c) => c.startsWith('authToken='))).toBe(true);
    });

    it('should return 400 if user already exists', async () => {
        // Arrange
        const registration_response = await request(app.getHttpServer())
            .post('/api/v1/auth/registration')
            .send(user)
            .expect(200);
        const registration_body: ResponseBody = registration_response.body as { message: string };

        // Act
        const response = await request(app.getHttpServer()).post('/api/v1/auth/registration').send(user).expect(400);

        // Assert
        expect(registration_body.message).toBe('Authenticated successfully');
        expect(response.body).toEqual({
            statusCode: 400,
            message: 'User already exists',
        });
    });
});
