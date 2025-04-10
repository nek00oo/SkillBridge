import { Field, InputType } from '@nestjs/graphql';
import { Category } from '@prisma/client';

@InputType()
export class UpdateTutorCardInput {
    @Field()
    title?: string;

    @Field(() => [Category])
    subjectCategories?: Category[];

    @Field()
    price?: number;

    @Field()
    content?: string;

    @Field({ nullable: true })
    isPublished?: boolean;

    @Field({ nullable: true })
    rating?: number;

    @Field()
    imgUrl?: string;
}
