import { ReviewsService } from '../../modules/review/reviews.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => Review)
export class ReviewsResolver {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Mutation(() => Review)
    async createReview(
        @Args('studentId') studentId: number,
        @Args('createReviewInput') createReviewInput: CreateReviewInput,
    ) {
        return this.reviewsService.createReview(studentId, createReviewInput);
    }

    @Query(() => Review, { name: 'review' })
    async findReviewById(@Args('id') id: number) {
        return this.reviewsService.findReviewById(id);
    }

    @Query(() => [Review], { name: 'reviewsByStudent' })
    async findReviewsByStudentId(@Args('studentId') studentId: number) {
        return this.reviewsService.findReviewsByStudentId(studentId);
    }

    @Query(() => [Review], { name: 'reviewsByCard' })
    async findReviewsByCardId(@Args('cardId') cardId: number) {
        return this.reviewsService.findReviewsByCardId(cardId);
    }

    @Mutation(() => Review)
    updateReviewById(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    ) {
        return this.reviewsService.updateReviewById(id, updateReviewInput);
    }

    @Mutation(() => Review)
    deleteReview(@Args('id', { type: () => Int }) id: number) {
        return this.reviewsService.removeReviewById(id);
    }
}
