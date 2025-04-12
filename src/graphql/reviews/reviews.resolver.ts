import { ReviewsService } from '../../modules/review/reviews.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver(() => ReviewEntity)
export class ReviewsResolver {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Mutation(() => ReviewEntity)
    async createReview(
        @Args('studentId', { type: () => Int }) studentId: number,
        @Args('createReviewInput') createReviewInput: CreateReviewInput,
    ) {
        return this.reviewsService.createReview(studentId, createReviewInput);
    }

    @Query(() => ReviewEntity)
    async getReviewById(@Args('id', { type: () => Int }) id: number) {
        return this.reviewsService.findReviewById(id);
    }

    @Query(() => [ReviewEntity])
    async getReviewsByStudentId(@Args('studentId', { type: () => Int }) studentId: number) {
        return this.reviewsService.findReviewsByStudentId(studentId);
    }

    @Query(() => [ReviewEntity])
    async getReviewsByCardId(@Args('cardId', { type: () => Int }) cardId: number) {
        return this.reviewsService.findReviewsByCardId(cardId);
    }

    @Mutation(() => ReviewEntity)
    updateReviewById(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
    ) {
        return this.reviewsService.updateReviewById(id, updateReviewInput);
    }

    @Mutation(() => ReviewEntity)
    deleteReviewById(@Args('id', { type: () => Int }) id: number) {
        return this.reviewsService.removeReviewById(id);
    }
}
