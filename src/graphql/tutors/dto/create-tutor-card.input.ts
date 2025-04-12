import { InputType, Field } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateTutorCardInput {
    @Field()
    @IsNotEmpty()
    title: string;

    @Field(() => [Category])
    @IsNotEmpty()
    subjectCategories: Category[];

    @Field()
    @IsNotEmpty()
    price: number;

    @Field()
    @IsNotEmpty()
    content: string;

    @Field()
    @IsNotEmpty()
    imgUrl: string;

    @Field({ nullable: true })
    @IsOptional()
    isPublished?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    rating?: number;
}
