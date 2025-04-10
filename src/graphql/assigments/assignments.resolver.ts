import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AssignmentEntity, AssignmentStats } from './entities/assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { AssignmentsService } from '../../modules/assignments/assignments.service';
import { UpdateAssignmentInput } from './dto/update-assigments.input';

@Resolver(() => AssignmentEntity)
export class AssignmentsResolver {
    constructor(private readonly assignmentsService: AssignmentsService) {}

    @Mutation(() => AssignmentEntity)
    async createAssignment(@Args('input') input: CreateAssignmentInput, @Args('tutorId') tutorId: number) {
        return this.assignmentsService.createAssignment(input, tutorId);
    }

    @Query(() => AssignmentEntity, { name: 'assignment' })
    async getAssignmentById(@Args('id') id: number) {
        return this.assignmentsService.getAssignmentById(id);
    }

    @Query(() => [AssignmentStats], { name: 'assignmentsStats' })
    async getAssignmentsByStudentId(@Args('studentId') studentId: number) {
        return this.assignmentsService.getAssignmentsByStudentId(studentId);
    }

    @Mutation(() => AssignmentEntity)
    async updateAssignment(@Args('id') id: number, @Args('input') input: UpdateAssignmentInput) {
        return this.assignmentsService.updateAssignmentById(id, input);
    }

    @Mutation(() => AssignmentEntity)
    async deleteAssignment(@Args('id') id: number) {
        return this.assignmentsService.deleteAssignmentById(id);
    }
}
