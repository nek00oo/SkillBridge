import { IsString, IsNumber, IsNotEmpty, Validate, IsEnum } from 'class-validator';
import { CustomDateString } from '../../../common/decorators/date-string.decorator';
import { Category } from '@prisma/client';

export class CreateAssignmentDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsEnum(Category)
    category: Category;

    @Validate(CustomDateString, ['dd-MM-yyyy'])
    dueDate: string;

    @IsNotEmpty()
    @IsNumber()
    studentId: number;
}

export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;
