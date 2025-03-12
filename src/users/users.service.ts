import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { parseDateOrNull } from '../common/utils/date-parser.util';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    //TODO сделать проверки на наличие объекта

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { birthDate, ...userData } = createUserDto;

        const parsedBirthDate = parseDateOrNull(birthDate, 'dd-MM-yyyy');

        return this.prisma.user.create({
            data: {
                ...userData,
                birthDate: parsedBirthDate?.toISOString() || null,
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

        const parsedBirthDate = parseDateOrNull(birthDate, 'dd-MM-yyyy');

        return this.prisma.user.update({
            where: { id: id },
            data: {
                ...userData,
                birthDate: parsedBirthDate?.toISOString() || null,
            },
        });
    }

    async deleteUserById(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }
}
