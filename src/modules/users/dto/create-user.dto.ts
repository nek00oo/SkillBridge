import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Validate } from 'class-validator';
import { Role } from '@prisma/client';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User email address' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: 'User first name' })
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiPropertyOptional({ description: 'User role' })
    @IsOptional()
    @IsEnum(Role)
    role: Role;

    @ApiPropertyOptional({ description: 'User last name' })
    @IsOptional()
    @IsString()
    lastname: string;

    @ApiPropertyOptional({ description: 'User birth date in dd-MM-yyyy format' })
    @IsOptional()
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    birthDate: string;

    @ApiPropertyOptional({ description: 'URL of the user profile image' })
    @IsOptional()
    @IsUrl()
    profileImageUrl: string;
}
