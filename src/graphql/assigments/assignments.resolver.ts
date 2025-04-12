import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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

    @Query(() => AssignmentEntity)
    async getAssignmentById(@Args('id', { type: () => Int }) id: number) {
        return this.assignmentsService.getAssignmentById(id);
    }

    @Query(() => [AssignmentStats])
    async getAssignmentsByStudentId(@Args('studentId', { type: () => Int }) studentId: number) {
        return this.assignmentsService.getAssignmentsByStudentId(studentId);
    }

    @Mutation(() => AssignmentEntity)
    async updateAssignmentById(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateAssignmentInput,
    ) {
        return this.assignmentsService.updateAssignmentById(id, input);
    }

    @Mutation(() => AssignmentEntity)
    async deleteAssignmentById(@Args('id', { type: () => Int }) id: number) {
        return this.assignmentsService.deleteAssignmentById(id);
    }
}
