import { AssignmentsService } from './assignments.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { Category, Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CacheControl } from '../../common/decorators/cache-control.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Assignments')
@ApiBearerAuth()
@Controller('api/v1/assignments')
export class ApiAssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @ApiOperation({ summary: 'Create a new assignment' })
    @ApiResponse({ status: 201, description: 'Assignment created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TUTOR, Role.ADMIN)
    @Post()
    async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto, @Request() req: RequestWithUser) {
        return await this.assignmentsService.createAssignment(createAssignmentDto, req.user.id);
    }

    @ApiOperation({ summary: 'Get assignments grouped by category for a student' })
    @ApiResponse({ status: 200, description: 'Assignments retrieved successfully', type: [CreateAssignmentDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(JwtAuthGuard)
    @Get('/tasks')
    async getAssignmentsGroupByCategoryByStudentId(
        @Req() req: RequestWithUser,
        @Query('category') category?: Category,
    ) {
        return this.assignmentsService.getTitleCategoryByStudentId(req.user.id, category);
    }

    @ApiOperation({ summary: 'Get assignment by ID' })
    @ApiResponse({ status: 200, description: 'Assignment retrieved successfully', type: CreateAssignmentDto })
    @ApiResponse({ status: 404, description: 'Assignment not found' })
    @CacheControl('private', 360)
    @Get(':id')
    async getAssigmentById(@Param('id') id: number) {
        return await this.assignmentsService.getAssignmentById(id);
    }

    @ApiOperation({ summary: 'Update assignment by ID' })
    @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
    @ApiResponse({ status: 404, description: 'Assignment not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TUTOR, Role.ADMIN)
    @Patch(':id')
    async updateAssigmentById(@Param('id') id: number, @Body() updateAssignmentDto: UpdateAssignmentDto) {
        return await this.assignmentsService.updateAssignmentById(id, updateAssignmentDto);
    }

    @ApiOperation({ summary: 'Delete assignment by ID' })
    @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
    @ApiResponse({ status: 404, description: 'Assignment not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TUTOR, Role.ADMIN)
    @Delete(':id')
    async deleteAssignmentById(@Param('id') id: number) {
        return await this.assignmentsService.deleteAssignmentById(id);
    }
}
