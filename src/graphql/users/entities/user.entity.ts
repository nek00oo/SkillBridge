import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { Role } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class UserEntity {
    @Field(() => ID)
    id: number;

    @Field(() => Role)
    role: Role;

    @Field()
    email: string;

    @Field()
    firstname: string;

    @Field({ nullable: true })
    @Transform(({ value }: { value: string | null }) => value ?? undefined)
    lastname?: string;

    @Field({ nullable: true })
    @Transform(({ value }: { value: Date | null }) => value?.toISOString() ?? undefined)
    birthDate?: Date;

    @Field({ nullable: true })
    @Transform(({ value }: { value: string | null }) => value ?? undefined)
    profileImageUrl?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
