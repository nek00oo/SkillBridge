import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';
import { PrismaService } from '../../prisma.service';
import { ApiTutorsController } from './api-tutors.controller';

@Module({
    controllers: [TutorsController, ApiTutorsController],
    providers: [TutorsService, PrismaService],
})
export class TutorsModule {}
