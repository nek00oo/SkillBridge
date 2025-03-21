import { AssignmentsService } from './assignments.service';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('api/v1/assignments')
export class ApiAssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        const tutorId = req.user.id;
        const assignment = await this.assignmentsService.createAssignment(createAssignmentDto, tutorId);

        return { message: 'Assignment created successfully', assignment };
    }
}
