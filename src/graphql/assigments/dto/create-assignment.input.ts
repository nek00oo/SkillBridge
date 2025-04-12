import { InputType, Field, Int } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateAssignmentInput {
    @Field()
    @IsNotEmpty()
    @MaxLength(25)
    title: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(500)
    content: string;

    @Field(() => Category)
    @IsNotEmpty()
    category: Category;

    @Field()
    @IsNotEmpty()
    @CustomDateString('dd-MM-yyyy')
    dueDate: string;

    @Field(() => Int)
    @IsNotEmpty()
    studentId: number;
}
