import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateReviewInput {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    comment?: string;
}
