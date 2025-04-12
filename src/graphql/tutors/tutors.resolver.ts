import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TutorCardEntity, TutorCardsResponse } from './entities/tutor-card.entity';
import { TutorsService } from '../../modules/tutors/tutors.service';
import { Category } from '@prisma/client';
import { CreateTutorCardInput } from './dto/create-tutor-card.input';
import { UpdateTutorCardInput } from './dto/update-tutor-card.input';

@Resolver(() => TutorCardEntity)
export class TutorsResolver {
    constructor(private readonly tutorsService: TutorsService) {}

    @Mutation(() => TutorCardEntity)
    async createTutorCard(
        @Args('userId', { type: () => Int }) userId: number,
        @Args('input') input: CreateTutorCardInput,
    ) {
        return this.tutorsService.createTutorCard(userId, input);
    }

    @Query(() => TutorCardEntity)
    async getTutorCardById(@Args('id', { type: () => Int }) id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @Query(() => TutorCardsResponse)
    async getTutorCards(
        @Args('page', { defaultValue: 1 }) page: number,
        @Args('limit', { defaultValue: 9 }) limit: number,
        @Args('category', { nullable: true }) category?: Category,
    ) {
        return this.tutorsService.getTutorListBySubjectCategory(category, page, limit);
    }

    @Mutation(() => TutorCardEntity)
    async updateTutorCardById(@Args('id', { type: () => Int }) id: number, @Args('input') input: UpdateTutorCardInput) {
        return this.tutorsService.updateTutorCardById(id, input);
    }

    @Mutation(() => TutorCardEntity)
    async updateTutorCardByAuthor(
        @Args('authorId', { type: () => Int }) authorId: number,
        @Args('input') input: UpdateTutorCardInput,
    ) {
        return this.tutorsService.updateTutorCardByAuthorId(authorId, input);
    }

    @Mutation(() => TutorCardEntity)
    async deleteTutorCardById(@Args('id', { type: () => Int }) id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }

    @Mutation(() => TutorCardEntity)
    async deleteTutorCardByAuthor(@Args('authorId', { type: () => Int }) authorId: number) {
        return this.tutorsService.deleteTutorCardByAuthorId(authorId);
    }
}
