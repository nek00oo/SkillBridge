import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class CreateTutorCardDto {
    @ApiProperty({ description: 'Card title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Subject categories', isArray: true, enum: Category })
    @IsNotEmpty()
    @IsArray()
    @IsEnum(Category, { each: true })
    subjectCategories: Category[];

    @ApiProperty({ description: 'Price for the tutoring session', example: 2700 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @ApiProperty({ description: 'Card content description' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Publication status of the card' })
    @IsOptional()
    @IsBoolean()
    isPublished: boolean;

    @ApiPropertyOptional({ description: 'Card rating' })
    @IsOptional()
    @IsNumber()
    rating: number;

    @ApiProperty({ description: 'Image URL' })
    @IsNotEmpty()
    @IsString()
    imgUrl: string;
}
