import { InputType, Field, Int } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';

@InputType()
export class CreateAssignmentInput {
    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => Category)
    category: Category;

    @Field()
    @CustomDateString('dd-MM-yyyy')
    dueDate: string;

    @Field(() => Int)
    studentId: number;
}
