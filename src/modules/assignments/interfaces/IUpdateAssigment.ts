import { Assignment } from '@prisma/client';

export interface IUpdateAssignment {
    type: 'new' | 'updated';
    assignment: Assignment;
    studentId: number;
}
