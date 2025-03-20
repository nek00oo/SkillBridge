import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TutorsModule } from './tutors/tutors.module';
import { UsersModule } from './users/users.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { AssignmentsModule } from './assignments/assignments.module';
import * as process from 'node:process';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
        TutorsModule,
        UsersModule,
        ReviewModule,
        AuthModule,
        AssignmentsModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
