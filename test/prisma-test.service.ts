import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaTestService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async cleanAuthTestDatabase() {
        await this.user.deleteMany({ where: { email: { startsWith: 'auth_test_' } } });
    }

    async cleanUserTestDatabase() {
        await this.user.deleteMany({ where: { email: { startsWith: 'user_test_' } } });
    }

    async cleanTutorCardTestDatabase() {
        await this.subjectCategory.deleteMany({
            where: { tutorCard: { author: { email: { startsWith: 'tutor_card_test_' } } } },
        });
        await this.tutorCard.deleteMany({ where: { author: { email: { startsWith: 'tutor_card_test_' } } } });
        await this.user.deleteMany({ where: { email: { startsWith: 'tutor_card_test_' } } });
    }
}
