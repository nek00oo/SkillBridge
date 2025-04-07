import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma.service';
import { parseDate } from '../../common/utils/date-parser.util';
import { PrismaCatch } from '../../common/decorators/prisma-catch.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    @PrismaCatch()
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { birthDate, ...userData } = createUserDto;

        return this.prisma.user.create({
            data: {
                ...userData,
                birthDate: birthDate ? parseDate(birthDate, 'dd-MM-yyyy').toISOString() : null,
            },
        });
    }

    @PrismaCatch()
    async getUserById(id: number): Promise<User> {
        return this.prisma.user.findUniqueOrThrow({
            where: { id: id },
        });
    }

    //TODO null нужен, чтобы registration проверял, есть ли пользователь. Использовать findUniqueOrThrow тут не верно,
    // т.к тогда не будет проходить регистрация
    // PrismaCatch сейчас работать не будет, т.к ошибка тут не кинется
    @PrismaCatch()
    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    @PrismaCatch()
    async getUsers(limit: number = 10, offset: number = 0): Promise<User[]> {
        const safeLimit = Math.min(Math.max(1, limit), 100);
        const safeOffset = Math.max(0, offset);

        return this.prisma.user.findMany({
            take: safeLimit,
            skip: safeOffset,
            orderBy: { createdAt: 'desc' },
        });
    }

    @PrismaCatch()
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { birthDate, ...userData } = updateUserDto;

        return this.prisma.user.update({
            where: { id },
            data: {
                ...userData,
                birthDate: birthDate ? parseDate(birthDate, 'dd-MM-yyyy').toISOString() : null,
            },
        });
    }

    @PrismaCatch()
    async deleteUserById(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }
}
