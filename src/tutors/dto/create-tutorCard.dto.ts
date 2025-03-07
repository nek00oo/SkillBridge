import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTutorCardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsString()
    content: string;

    @IsBoolean()
    isPublished: boolean;

    @IsNumber()
    rating: number;

    @IsString()
    imgUrl: string;
}

export type UpdateTutorCardDto = Partial<CreateTutorCardDto>;
