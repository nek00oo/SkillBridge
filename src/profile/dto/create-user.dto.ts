import { IsEmail, IsNotEmpty, IsString, IsUrl, Validate } from 'class-validator';
import { Role } from '@prisma/client';
import { CustomDateString } from '../../common/decorators/date-string.decorator';

export class CreateUserDto {
    role: Role;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @Validate(CustomDateString, ['dd-MM-yyyy'])
    birthDate: string;

    @IsUrl()
    profileImageUrl: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
