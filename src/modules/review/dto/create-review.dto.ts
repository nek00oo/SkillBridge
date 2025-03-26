import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ description: 'Tutor card ID to which the review belongs' })
    @IsNotEmpty()
    @IsNumber()
    cardId: number;

    @ApiProperty({ description: 'Rating given to the tutor', minimum: 1, maximum: 5, example: 5 })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({ description: 'Optional comment for the review', maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Comment must not exceed 500 characters' })
    comment?: string;
}
