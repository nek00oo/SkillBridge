import { Module } from '@nestjs/common';
import { ReviewsModule } from '../../modules/review/reviews.module';
import { ReviewsResolver } from './reviews.resolver';

@Module({
    imports: [ReviewsModule],
    providers: [ReviewsResolver],
})
export class ReviewsModuleGraphQL {}
