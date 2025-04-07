import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from '../src/common/filters/exception.filter';
import { PrismaExceptionFilter } from '../src/common/filters/prisma-exception.filter';
import { PrismaTestService } from './prisma-test.service';

interface SetupResult {
    app: INestApplication;
    prisma: PrismaTestService;
}

export async function setupE2eTest(): Promise<SetupResult> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        providers: [PrismaTestService],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionFilter());
    await app.init();

    const prisma = moduleFixture.get(PrismaTestService);

    return { app, prisma };
}
