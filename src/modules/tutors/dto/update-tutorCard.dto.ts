import { PartialType } from '@nestjs/swagger';
import { CreateTutorCardDto } from './create-tutorCard.dto';

export class UpdateTutorCardDto extends PartialType(CreateTutorCardDto) {}
