import { Controller, Get, Render } from '@nestjs/common';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
    constructor(private readonly tutorsService: TutorsService) {}

    @Get()
    @Render('tutors')
    getTutors() {
        return { tutors: this.tutorsService.getAllTutors() };
    }
}
