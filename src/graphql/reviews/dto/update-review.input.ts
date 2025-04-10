import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateReviewInput {
    @Field(() => Int)
    @IsNumber()
    cardId?: number;

    @Field(() => Int)
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(500)
    comment?: string;
}
