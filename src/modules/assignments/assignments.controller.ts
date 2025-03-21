import { Controller, UseGuards, Request, Get, Sse } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssignmentsService } from './assignments.service';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { Observable } from 'rxjs';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @Get('sse')
    @Sse()
    @UseGuards(JwtAuthGuard)
    getAssignmentsUpdates(@Request() req: RequestWithUser): Observable<{ data: string }> {
        const studentId = req.user.id;
        return this.assignmentsService.getAssignmentsUpdates(studentId);
    }
}
