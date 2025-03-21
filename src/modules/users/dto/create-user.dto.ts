import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { Role } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsString()
    lastname: string;

    @IsOptional()
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    birthDate: string;

    @IsOptional()
    @IsUrl()
    profileImageUrl: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;
