import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    email: string;

    @Field()
    @IsNotEmpty()
    password: string;

    @Field()
    @IsNotEmpty()
    firstname: string;

    @Field({ nullable: true })
    @IsOptional()
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    birthDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    profileImageUrl?: string;

    @Field(() => Role, { defaultValue: 'STUDENT' })
    @IsOptional()
    role?: Role;
}
