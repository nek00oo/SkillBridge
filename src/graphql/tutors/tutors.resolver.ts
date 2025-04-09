import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TutorCardEntity, TutorCardsResponse } from './entities/tutor-card.entity';
import { TutorsService } from '../../modules/tutors/tutors.service';
import { Category } from '@prisma/client';
import { CreateTutorCardInput } from './dto/create-tutor-card.input';
import { UpdateTutorCardInput } from './dto/update-tutor-card.input';

@Resolver(() => TutorCardEntity)
export class TutorsResolver {
    constructor(private readonly tutorsService: TutorsService) {}

    @Query(() => TutorCardsResponse)
    async tutorCards(
        @Args('page', { defaultValue: 1 }) page: number,
        @Args('limit', { defaultValue: 9 }) limit: number,
        @Args('category', { nullable: true }) category?: Category,
    ) {
        return this.tutorsService.getTutorListBySubjectCategory(category, page, limit);
    }

    @Query(() => TutorCardEntity)
    async tutorCard(@Args('id') id: number) {
        return this.tutorsService.getTutorCardById(id);
    }

    @Mutation(() => TutorCardEntity)
    async createTutorCard(@Args('userId') userId: number, @Args('input') input: CreateTutorCardInput) {
        return this.tutorsService.createTutorCard(userId, input);
    }

    @Mutation(() => TutorCardEntity)
    async updateTutorCard(@Args('id') id: number, @Args('input') input: UpdateTutorCardInput) {
        return this.tutorsService.updateTutorCardById(id, input);
    }

    @Mutation(() => TutorCardEntity)
    async updateTutorCardByAuthor(@Args('authorId') authorId: number, @Args('input') input: UpdateTutorCardInput) {
        return this.tutorsService.updateTutorCardByAuthorId(authorId, input);
    }

    @Mutation(() => TutorCardEntity)
    async deleteTutorCard(@Args('id') id: number) {
        return this.tutorsService.deleteTutorCardById(id);
    }

    @Mutation(() => TutorCardEntity)
    async deleteTutorCardByAuthor(@Args('authorId') authorId: number) {
        return this.tutorsService.deleteTutorCardByAuthorId(authorId);
    }
}
