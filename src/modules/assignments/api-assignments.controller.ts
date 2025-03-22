import { AssignmentsService } from './assignments.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('api/v1/assignments')
export class ApiAssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @Post('/add')
    @UseGuards(JwtAuthGuard)
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        const tutorId = req.user.id;
        const assignment = await this.assignmentsService.createAssignment(createAssignmentDto, tutorId);

        return { message: 'Assignment created successfully', assignment };
    }

    @Get(':id')
    async getAssigmentById(@Param('id') id: number) {
        return this.assignmentsService.getAssignmentById(id);
    }

    @Get('/student')
    @UseGuards(JwtAuthGuard)
    async getAssignmentsGroupByStudentId(@Res() res: RequestWithUser) {
        const studentId = res.user.id;
        return this.assignmentsService.getAssignmentsByStudentId(studentId);
    }

    //TODO подумать, кто обновляет, если ученик, то ставить выполнено в true, если препод то не менять
    //нужно ли получать id пользователя, чтобы проверять роль или сделать два разных endpoint ?
    @Patch(':id')
    async updateAssigmentById(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
        return this.assignmentsService.updateAssignmentById(id, updateAssignmentDto);
    }

    @Delete(':id')
    async deleteAssignmentById(@Param('id') id: number) {
        return this.assignmentsService.deleteAssignmentById(id);
    }
}
