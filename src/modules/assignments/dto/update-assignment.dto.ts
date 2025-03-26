import { CreateAssignmentDto } from './create-assignment.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAssignmentDto extends PartialType(CreateAssignmentDto) {}
