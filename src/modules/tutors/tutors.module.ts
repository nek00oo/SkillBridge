import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { PrismaService } from '../../prisma.service';
import { ApiTutorsController } from './api-tutors.controller';
import { HttpCacheModule } from '../../common/modules/cache.module';
import { TutorsController } from './tutors.controller';

@Module({
    controllers: [ApiTutorsController, TutorsController],
    providers: [TutorsService, PrismaService],
    exports: [TutorsService],
    imports: [HttpCacheModule],
})
export class TutorsModule {}
