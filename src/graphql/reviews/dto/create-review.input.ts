import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateReviewInput {
    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    cardId: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    comment?: string;
}
