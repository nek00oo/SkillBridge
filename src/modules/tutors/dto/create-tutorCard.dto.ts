import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class CreateTutorCardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsArray()
    @IsEnum(Category, { each: true })
    subjectCategories: Category[];

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsBoolean()
    isPublished: boolean;

    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    imgUrl: string;
}

export type UpdateTutorCardDto = Partial<CreateTutorCardDto>;
