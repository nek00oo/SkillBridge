import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Category } from '@prisma/client';

registerEnumType(Category, {
    name: 'Category',
});

@ObjectType()
export class AssignmentEntity {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => Category)
    category: Category;

    @Field()
    dueDate: Date;

    @Field(() => Int)
    studentId: number;

    @Field(() => Int)
    tutorId: number;

    @Field({ nullable: true })
    completed?: boolean;

    @Field(() => Int, { nullable: true })
    grade?: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class AssignmentStats {
    @Field()
    category: string;

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    completed_count: number;
}
