import { Module } from '@nestjs/common';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';
import { PrismaService } from '../../prisma.service';
import { ApiTutorsController } from './api-tutors.controller';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    // imports: [
    //     CacheModule.register({
    //         ttl: 40,
    //         max: 100,
    //     }),
    // ],
    controllers: [TutorsController, ApiTutorsController],
    providers: [
        TutorsService,
        PrismaService,
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
    exports: [TutorsService],
})
export class TutorsModule {}
