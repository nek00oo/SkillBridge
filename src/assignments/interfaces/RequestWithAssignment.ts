import { Request } from 'express';

export interface RequestWithAssignment extends Request {
    assigment: AssignmentInterface;
}
