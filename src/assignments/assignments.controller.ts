import { Controller, Post, Body, UseGuards, Request, Get, Sse } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { Observable } from 'rxjs';
import { UpdateAssignment } from './dto/update-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        const tutorId = req.user.id;

        // Создаём задание
        const assignment = await this.assignmentsService.createAssignment(createAssignmentDto, tutorId);

        return { message: 'Assignment created successfully', assignment };
    }

    @UseGuards(JwtAuthGuard)
    @Get('sse')
    @Sse()
    getAssignmentsUpdates(@Request() req: RequestWithUser): Observable<UpdateAssignment> {
        const studentId = req.user.id;
        console.log('studentId: ', studentId);
        return this.assignmentsService.getAssignmentsUpdates(studentId);
    }
}
