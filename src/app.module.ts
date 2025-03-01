import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TutorsModule } from './tutors/tutors.module';

@Module({
    imports: [ConfigModule.forRoot(), TutorsModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
