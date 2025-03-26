import { IsString, IsNumber, IsNotEmpty, Validate, IsEnum } from 'class-validator';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
    @ApiProperty({ description: 'Title of the assignment' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Content of the assignment' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'Category of the assignment', enum: Category })
    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;

    @ApiProperty({ description: 'Due date in dd-MM-yyyy format' })
    @IsNotEmpty()
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    dueDate: string;

    @ApiProperty({ description: 'Student ID assigned to this assignment' })
    @IsNotEmpty()
    @IsNumber()
    studentId: number;
}
