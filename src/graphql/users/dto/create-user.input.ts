import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    firstname: string;

    @Field({ nullable: true })
    lastname?: string;

    @Field({ nullable: true })
    birthDate?: string;

    @Field({ nullable: true })
    profileImageUrl?: string;

    @Field(() => Role, { defaultValue: 'STUDENT' })
    role?: Role;
}
