import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    cardId: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Комментарий не должен превышать 500 символов' })
    comment?: string;
}
