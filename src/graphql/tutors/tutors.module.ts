import { Module } from '@nestjs/common';
import { TutorsResolver } from './tutors.resolver';
import { TutorsModule } from '../../modules/tutors/tutors.module';

@Module({
    imports: [TutorsModule],
    providers: [TutorsResolver],
})
export class TutorsModuleGraphQL {}
