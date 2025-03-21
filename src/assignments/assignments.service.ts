import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignment } from './dto/update-assignment.dto';
import { parseDate } from '../common/utils/date-parser.util';

@Injectable()
export class AssignmentsService {
    constructor(private readonly prisma: PrismaService) {}

    private assignmentStream = new Subject<UpdateAssignment>();

    emitAssignmentUpdate(update: UpdateAssignment) {
        this.assignmentStream.next(update);
    }

    getAssignmentsUpdates(studentId: number): Observable<{ data: string }> {
        return this.assignmentStream.pipe(
            filter((data: UpdateAssignment) => data.studentId === studentId),
            map((data: UpdateAssignment) => ({
                data: JSON.stringify(data),
            })),
        );
    }

    async createAssignment(data: CreateAssignmentDto, tutorId: number) {
        const { dueDate, ...assignmentData } = data;

        const mentorship = await this.prisma.mentorship.findFirst({
            where: {
                studentId: data.studentId,
                tutorId: tutorId,
            },
        });

        if (!mentorship) {
            throw new Error(`Студент ${data.studentId} не связан с преподавателем ${tutorId}`);
        }

        const assignment = await this.prisma.assignment.create({
            data: {
                ...assignmentData,
                tutorId: tutorId,
                dueDate: parseDate(dueDate, 'dd-MM-yyyy').toISOString(),
            },
        });

        this.emitAssignmentUpdate({
            type: 'new',
            assignment: assignment,
            studentId: data.studentId,
        });

        return assignment;
    }
}
