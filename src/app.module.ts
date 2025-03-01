import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TutorsModule } from './tutors/tutors.module';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [ConfigModule.forRoot(), TutorsModule, ProfileModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
