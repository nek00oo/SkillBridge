import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma.service';
import { parseDate } from '../../common/utils/date-parser.util';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    //TODO сделать проверки на наличие объекта

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { birthDate, ...userData } = createUserDto;

        return this.prisma.user.create({
            data: {
                ...userData,
                birthDate: birthDate ? parseDate(birthDate, 'dd-MM-yyyy').toISOString() : null,
            },
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: id },
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { birthDate, ...userData } = updateUserDto;

        return this.prisma.user.update({
            where: { id: id },
            data: {
                ...userData,
                birthDate: birthDate ? parseDate(birthDate, 'dd-MM-yyyy').toISOString() : null,
            },
        });
    }

    async deleteUserById(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }
}
