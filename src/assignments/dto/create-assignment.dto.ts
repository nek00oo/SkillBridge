import { IsString, IsNumber, IsNotEmpty, Validate } from 'class-validator';
import { CustomDateString } from '../../common/decorators/date-string.decorator';

export class CreateAssignmentDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @Validate(CustomDateString, ['dd-MM-yyyy'])
    dueDate: string;

    @IsNotEmpty()
    @IsNumber()
    studentId: number;
}
