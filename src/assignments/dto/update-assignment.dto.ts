import { Assignment } from '@prisma/client';

export interface UpdateAssignment {
    type: 'new' | 'updated';
    assignment: Assignment;
    studentId: number;
}
