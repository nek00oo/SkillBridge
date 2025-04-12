import { Field, InputType, Int } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { IsOptional, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class UpdateAssignmentInput {
    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(25)
    title?: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(500)
    content?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(1)
    @Max(5)
    grade?: number;

    @Field(() => Category, { nullable: true })
    @IsOptional()
    category?: Category;

    @Field({ nullable: true })
    @IsOptional()
    @CustomDateString('dd-MM-yyyy')
    dueDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    completed?: boolean;
}
