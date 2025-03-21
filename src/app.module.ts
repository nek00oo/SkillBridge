import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { TutorsModule } from './modules/tutors/tutors.module';
import { UsersModule } from './modules/users/users.module';
import { ReviewsModule } from './modules/review/reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
        TutorsModule,
        UsersModule,
        ReviewsModule,
        AuthModule,
        AssignmentsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
