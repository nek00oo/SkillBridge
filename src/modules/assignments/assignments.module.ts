import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { PrismaService } from '../../prisma.service';
import { ApiAssignmentsController } from './api-assignments.controller';

@Module({
    controllers: [AssignmentsController, ApiAssignmentsController],
    providers: [AssignmentsService, PrismaService],
    exports: [AssignmentsService],
})
export class AssignmentsModule {}
