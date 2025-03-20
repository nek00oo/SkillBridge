import { Injectable } from '@nestjs/common';
import { filter, Observable, Subject } from 'rxjs';
import { PrismaService } from '../prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignment } from './dto/update-assignment.dto';
import { parseDate } from '../common/utils/date-parser.util';

@Injectable()
export class AssignmentsService {
    constructor(private readonly prisma: PrismaService) {}

    private assignmentStream = new Subject<UpdateAssignment>();

    emitAssignmentUpdate(update: UpdateAssignment) {
        console.log(update);
        this.assignmentStream.next(update);
    }

    getAssignmentsUpdates(studentId: number): Observable<UpdateAssignment> {
        return this.assignmentStream.pipe(filter((assignment) => assignment.studentId === studentId));
    }

    async createAssignment(data: CreateAssignmentDto, tutorId: number) {
        const { dueDate, ...assignmentData } = data;
        // Проверяем, существует ли связь между преподавателем и студентом
        const mentorship = await this.prisma.mentorship.findFirst({
            where: {
                studentId: data.studentId,
                tutorId: tutorId,
            },
        });

        if (!mentorship) {
            throw new Error('Студент не связан с этим преподавателем');
        }

        // Создаём задание
        const assignment = await this.prisma.assignment.create({
            data: {
                ...assignmentData,
                tutorId: tutorId,
                dueDate: parseDate(dueDate, 'dd-MM-yyyy').toISOString(),
            },
        });
        // Отправляем уведомление
        this.emitAssignmentUpdate({
            type: 'new',
            assignment: assignment,
            studentId: data.studentId,
        });

        return assignment;
    }
}
