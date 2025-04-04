import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { PrismaService } from '../../prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { parseDate } from '../../common/utils/date-parser.util';
import { Category } from '@prisma/client';
import { PrismaCatch } from '../../common/decorators/prisma-catch.decorator';
import { IUpdateAssignment } from './interfaces/IUpdateAssigment';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
    constructor(private readonly prisma: PrismaService) {}

    private assignmentStream = new Subject<IUpdateAssignment>();

    //TODO Error - не будет отлавливаться
    @PrismaCatch()
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

    @PrismaCatch()
    async getAssignmentById(id: number) {
        return this.prisma.assignment.findUniqueOrThrow({
            where: { id: id },
        });
    }

    @PrismaCatch()
    async getTitleCategoryByStudentId(studentId: number, category?: Category) {
        return this.prisma.assignment.findMany({
            where: {
                studentId: studentId,
                ...(category && { category }),
            },
            select: { title: true, dueDate: true, completed: true, grade: true },
            orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
        });
    }

    @PrismaCatch()
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

    emitAssignmentUpdate(update: IUpdateAssignment) {
        this.assignmentStream.next(update);
    }

    getAssignmentsUpdates(studentId: number): Observable<{ data: string }> {
        return this.assignmentStream.pipe(
            filter((data: IUpdateAssignment) => data.studentId === studentId),
            map((data: IUpdateAssignment) => ({
                data: JSON.stringify(data),
            })),
        );
    }

    @PrismaCatch()
    async updateAssignmentById(id: number, updateAssignmentDto: UpdateAssignmentDto) {
        return this.prisma.assignment.update({
            where: { id: id },
            data: updateAssignmentDto,
        });
    }

    @PrismaCatch()
    async deleteAssignmentById(id: number) {
        return this.prisma.assignment.delete({
            where: { id: id },
        });
    }
}
