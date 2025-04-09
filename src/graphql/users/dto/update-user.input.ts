import { InputType, Field } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    firstname?: string;

    @Field({ nullable: true })
    lastname?: string;

    @Field({ nullable: true })
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    birthDate?: string;

    @Field({ nullable: true })
    profileImageUrl?: string;
}
