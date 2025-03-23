import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { PrismaService } from '../../prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignment } from './dto/update-assignment.dto';
import { parseDate } from '../../common/utils/date-parser.util';
import { Category } from '@prisma/client';

@Injectable()
export class AssignmentsService {
    constructor(private readonly prisma: PrismaService) {}

    private assignmentStream = new Subject<UpdateAssignment>();

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

    async getAssignmentById(id: number) {
        return this.prisma.assignment.findFirst({
            where: { id: id },
        });
    }

    async getTitleCategoryByStudentId(studentId: number, category?: Category) {
        return this.prisma.assignment.findMany({
            where: {
                studentId: studentId,
                ...(category && { category }),
            },
            select: {
                title: true,
                dueDate: true,
                completed: true,
                grade: true,
            },
            orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
        });
    }

    async getAssignmentsByStudentId(studentId: number) {
        return this.prisma.$queryRaw<
            Array<{
                category: string;
                total: number;
                completed_count: number;
            }>
        >`
            SELECT category,
                   COUNT(*)::int as total, COUNT(*) FILTER (WHERE completed = true)::int as completed_count
            FROM assignments
            WHERE "student_id" = ${studentId}
            GROUP BY category;
        `;
    }

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

    async updateAssignmentById(id: number, updateAssignmentDto: UpdateAssignmentDto) {
        return this.prisma.assignment.update({
            where: { id: id },
            data: updateAssignmentDto,
        });
    }

    async deleteAssignmentById(id: number) {
        return this.prisma.assignment.delete({
            where: { id: id },
        });
    }
}
