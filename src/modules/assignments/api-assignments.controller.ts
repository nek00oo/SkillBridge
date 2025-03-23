import { AssignmentsService } from './assignments.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { Category } from '@prisma/client';

@Controller('api/v1/assignments')
export class ApiAssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        const tutorId = req.user.id;
        const assignment = await this.assignmentsService.createAssignment(createAssignmentDto, tutorId);

        return { message: 'Assignment created successfully', assignment };
    }

    @UseGuards(JwtAuthGuard)
    @Get('/tasks')
    async getAssignmentsGroupByCategoryByStudentId(
        @Req() req: RequestWithUser,
        @Query('category') category?: Category,
    ) {
        return this.assignmentsService.getTitleCategoryByStudentId(req.user.id, category);
    }

    @Get(':id')
    async getAssigmentById(@Param('id') id: number) {
        return this.assignmentsService.getAssignmentById(id);
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
