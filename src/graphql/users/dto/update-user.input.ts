import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, Validate } from 'class-validator';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsOptional()
    password?: string;

    @Field({ nullable: true })
    @IsOptional()
    firstname?: string;

    @Field({ nullable: true })
    @IsOptional()
    lastname?: string;

    @Field({ nullable: true })
    @IsOptional()
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    birthDate?: string;

    @Field({ nullable: true })
    @IsOptional()
    profileImageUrl?: string;
}
