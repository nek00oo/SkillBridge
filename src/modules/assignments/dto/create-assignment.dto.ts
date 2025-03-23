import { IsString, IsNumber, IsNotEmpty, Validate, IsEnum } from 'class-validator';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { Category } from '@prisma/client';

export class CreateAssignmentDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;

    @IsNotEmpty()
    @Validate(CustomDateString, ['dd-MM-yyyy'])
    dueDate: string;

    @IsNotEmpty()
    @IsNumber()
    studentId: number;
}

export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;
