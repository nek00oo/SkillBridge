import { Field, InputType } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateTutorCardInput {
    @Field({ nullable: true })
    @IsOptional()
    title?: string;

    @Field(() => [Category], { nullable: true })
    @IsOptional()
    subjectCategories?: Category[];

    @Field({ nullable: true })
    @IsOptional()
    price?: number;

    @Field({ nullable: true })
    @IsOptional()
    content?: string;

    @Field({ nullable: true })
    @IsOptional()
    isPublished?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    rating?: number;

    @Field({ nullable: true })
    @IsOptional()
    imgUrl?: string;
}
