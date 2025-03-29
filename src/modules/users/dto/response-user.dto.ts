import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }

    @Expose()
    @ApiProperty({ description: 'User unique identifier' })
    id: number;

    @Expose()
    @ApiProperty({ description: 'User email address' })
    email: string;

    @Expose()
    @ApiProperty({ description: 'User role' })
    role: string;

    @Exclude()
    password?: string;

    @Expose()
    @ApiProperty({ description: 'User first name' })
    firstname: string;

    @Expose()
    @ApiPropertyOptional({ description: 'User last name', nullable: true })
    lastname: string | null;

    @Expose()
    @ApiPropertyOptional({ description: 'User birth date in ISO format', nullable: true })
    birthDate: Date | null;

    @ApiPropertyOptional({ description: 'URL of the user profile image', nullable: true })
    profileImageUrl: string | null;

    @Expose()
    @ApiProperty({ description: 'User created time in ISO format' })
    createdAt: Date;

    @Expose()
    @ApiProperty({ description: 'User updated time in ISO format' })
    updatedAt: Date;
}
