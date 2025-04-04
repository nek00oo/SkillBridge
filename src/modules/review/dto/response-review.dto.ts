import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewResponseDto {
    constructor(partial: Partial<ReviewResponseDto>) {
        Object.assign(this, partial);
    }

    @Expose()
    @ApiProperty({ description: 'User unique identifier' })
    id: number;

    @Expose()
    @ApiProperty({ description: 'Student ID' })
    studentId: number;

    @Expose()
    @ApiProperty({ description: 'Card ID' })
    cardId: number;

    @Expose()
    @ApiProperty({ description: 'Review rating' })
    rating: number;

    @Expose()
    @ApiPropertyOptional({ description: 'Comment in the review', nullable: true })
    comment: string | null;

    @Expose()
    @ApiProperty({ description: 'Review created time in ISO format' })
    createdAt: Date;

    @Expose()
    @ApiProperty({ description: 'Review updated time in ISO format' })
    updatedAt: Date;
}
