import { Controller, Post, Body, UseGuards, Request, Get, Sse } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { Observable } from 'rxjs';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        const tutorId = req.user.id;
        const assignment = await this.assignmentsService.createAssignment(createAssignmentDto, tutorId);

        return { message: 'Assignment created successfully', assignment };
    }

    @UseGuards(JwtAuthGuard)
    @Get('sse')
    @Sse()
    getAssignmentsUpdates(@Request() req: RequestWithUser): Observable<{ data: string }> {
        const studentId = req.user.id;
        return this.assignmentsService.getAssignmentsUpdates(studentId);
    }
}
