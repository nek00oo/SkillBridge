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

    //TODO сделать проверки на наличие объекта

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
    async getUserById(id: number): Promise<User | null> {
        return this.prisma.user.findUniqueOrThrow({
            where: { id: id },
        });
    }

    @PrismaCatch()
    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUniqueOrThrow({
            where: { email: email },
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
