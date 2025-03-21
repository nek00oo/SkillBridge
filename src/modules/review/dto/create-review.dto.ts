import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    tutor_id: number;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsString()
    comment: string;
}
