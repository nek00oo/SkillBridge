import { Field, InputType, Int } from '@nestjs/graphql';
import { Category } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';

@InputType()
export class UpdateAssignmentInput {
    @Field()
    title?: string;

    @Field()
    content?: string;

    @Field(() => Category)
    category?: Category;

    @Field()
    @CustomDateString('dd-MM-yyyy')
    dueDate?: string;

    @Field({ nullable: true })
    completed?: boolean;

    @Field(() => Int, { nullable: true })
    grade?: number;

    @Field(() => Int)
    studentId?: number;
}
