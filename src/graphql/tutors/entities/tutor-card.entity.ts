import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Category } from '@prisma/client';

registerEnumType(Category, { name: 'Category' });

@ObjectType()
export class TutorCardEntity {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    price: number;

    @Field()
    content: string;

    @Field({ nullable: true })
    isPublished?: boolean;

    @Field({ nullable: true })
    rating?: number;

    @Field()
    imgUrl: string;

    @Field(() => [Category])
    subjects: Category[];

    @Field({ nullable: true })
    firstname?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class TutorCardsResponse {
    @Field(() => [TutorCardEntity])
    tutors: TutorCardEntity[];

    @Field()
    total: number;
}
