import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TutorsModule } from './tutors/tutors.module';
import { UsersModule } from './users/users.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot(), TutorsModule, UsersModule, ReviewModule, AuthModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
