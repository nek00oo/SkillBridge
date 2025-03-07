import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [TutorsController],
    providers: [TutorsService, PrismaService],
})
export class TutorsModule {}
