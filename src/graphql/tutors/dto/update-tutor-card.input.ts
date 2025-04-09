import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTutorCardInput } from './create-tutor-card.input';

@InputType()
export class UpdateTutorCardInput extends PartialType(CreateTutorCardInput) {}
