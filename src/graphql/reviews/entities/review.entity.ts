import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Review {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    cardId: number;

    @Field(() => Int)
    studentId: number;

    @Field(() => Int)
    rating: number;

    @Field({ nullable: true })
    comment?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
